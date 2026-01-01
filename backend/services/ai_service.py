import json
import httpx
import asyncio
from config import get_groq, EDGE_FUNCTION_URL, SUPABASE_KEY, get_supabase, SUPABASE_URL
import services.crypto_service as crypto_service

def generate_summary(text: str):
    client = get_groq()
    
    completion = client.chat.completions.create(
        messages=[
            {
                "role": "system", 
                "content": "Write a concise, emotionally-aware summary in 10 to 15 words. Return JSON: { \"summary\": string, \"tags\": string[] }"
            },
            {"role": "user", "content": text}
        ],
        model="llama-3.1-8b-instant",
        response_format={"type": "json_object"}
    )
    return json.loads(completion.choices[0].message.content)

async def generate_embeddings_via_edge(text: str):
    """
    Splits text into chunks and calls the Supabase Edge Function 
    for each chunk in parallel.
    """
    
    chunks = [c for c in text.split('\n\n') if c.strip()]
    if not chunks:
        chunks = [text]

    async with httpx.AsyncClient() as client:
        async def fetch_vector(chunk_text):
            response = await client.post(
                EDGE_FUNCTION_URL,
                json={"input": chunk_text},
                headers={
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )
            if response.status_code != 200:
                print(f"Embedding Error: {response.text}")
                return None
            return response.json()['vector']

        # Run all chunks in parallel (Async Fan-Out)
        tasks = [fetch_vector(chunk) for chunk in chunks]
        vectors = await asyncio.gather(*tasks)

    valid_results = [(c, v) for c, v in zip(chunks, vectors) if v is not None]
    
    if not valid_results:
        return [], []
        
    final_chunks, final_vectors = zip(*valid_results)
    return list(final_chunks), list(final_vectors)

async def get_deepen_prompt(user_id: str, current_content: str):
    supabase = get_supabase()
    
    _, vectors = await generate_embeddings_via_edge(current_content)
    if not vectors:
        return "Could not analyze text."
    
    query_vector = vectors[0]

    rpc_params = {
        "query_embedding": query_vector,
        "match_threshold": 0.5,
        "match_count": 3,
        "requesting_user_id": user_id
    }
    
    related_response = supabase.rpc("match_journals", rpc_params).execute()
    
    related_context = ""
    for item in related_response.data:
        # Skip if it's the exact same entry we are currently writing
        decrypted = crypto_service.decrypt(item['content'])
        related_context += f"- Past Entry: {decrypted[:300]}...\n"

    client = get_groq()
    
    system_prompt = (
        "You are an empathetic, psychological journaling assistant. "
        "The user is writing a journal entry. You have access to snippets of their past memories that are semantically similar. "
        "Your goal is to provide ONE single, short, profound question that connects their current thought to their past patterns "
        "or encourages them to dig deeper into the 'Why'. "
        "Do not be preachy. Just ask the question."
    )

    user_prompt = f"""
    CURRENT DRAFT:
    "{current_content}"

    RELATED PAST MEMORIES:
    {related_context}

    Based on this, what should I ask myself next?
    """

    completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model="llama-3.3-70b-versatile",
    )
    
    return completion.choices[0].message.content

async def process_journal_background(journal_id: str, content: str, user_id: str):
    supabase = get_supabase()
    
    try:
        # We run both Groq (Summary) and Edge Function (Vectors) at the same time
        ai_task = asyncio.to_thread(generate_summary, content)
        vector_task = generate_embeddings_via_edge(content)
        
        ai_data, (chunks, vectors) = await asyncio.gather(ai_task, vector_task)

        # 2. Update Journal with Summary
        supabase.table("journals").update({
            "summary": ai_data.get("summary"),
            "tags": ai_data.get("tags")
        }).eq("id", journal_id).execute()

        # 3. Insert Vectors
        if vectors:
            vector_rows = []
            for i, vector in enumerate(vectors):
                vector_rows.append({
                    "journal_id": journal_id,
                    "user_id": user_id,
                    "content_chunk_encrypted": crypto_service.encrypt(chunks[i]),
                    "embedding": vector
                })
            supabase.table("journal_vectors").insert(vector_rows).execute()
            
        print(f"✅ [Background] AI processing complete for {journal_id}")

    except Exception as e:
        print(f"❌ [Background Error] {str(e)}")