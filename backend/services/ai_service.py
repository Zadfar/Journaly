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

WEEKLY_PROMPT = """
You are an empathetic, wise AI journaling assistant. Your role is to analyze a user's week and provide a "Weekly Harvest" summary.
Tone: Warm, grounded, insightful, like a gardener observing growth. Avoid clinical or robotic language.

INPUT: A list of mood entries and journal entries for the week.
OUTPUT: Strictly valid JSON with the following fields:
1. "headline": A 3-6 word poetic title for the week (e.g. "A Week of Quiet Resilience").
2. "summary": A 2-3 sentence warm reflection on their week.
3. "pattern": A specific observation connecting their mood to an activity or topic (e.g. "You felt lighter on days you walked").
4. "sentiment_trend": One of ["Rising", "Falling", "Stable", "Volatile"].
5. "actionable_tip": A gentle suggestion for next week based on their lows/highs.

Do not include markdown formatting. Return raw JSON.
"""

async def generate_weekly_insight(moods: list, journals: list, start_date: str, end_date: str):
    """
    Analyzes moods and journals for a specific week to generate a summary.
    """
    client = get_groq()
    
    # 1. Pre-process Data for the LLM
    # We need to decrypt journals and format moods into a readable string
    
    context_str = f"Timeframe: {start_date} to {end_date}\n\n"
    
    # Format Moods
    context_str += "MOOD HISTORY:\n"
    if not moods:
        context_str += "No moods logged this week.\n"
    for m in moods:
        # m['created_at'] is usually an ISO string
        date_str = m['created_at'].split('T')[0]
        context_str += f"- {date_str}: Score {m['mood_score']}/5 ({m['mood_label']})\n"
        
    context_str += "\nJOURNAL ENTRIES:\n"
    if not journals:
        context_str += "No journals written this week.\n"
    for j in journals:
        try:
            date_str = j['created_at'].split('T')[0]
            # Decrypt content for analysis
            decrypted_content = crypto_service.decrypt(j['content_encrypted'])
            # We truncate to 500 chars to save context window, focusing on the core message
            context_str += f"- {date_str}: {decrypted_content[:500]}...\n"
        except Exception:
            context_str += f"- {date_str}: [Content Unreadable]\n"

    # 2. Call LLM
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": WEEKLY_PROMPT},
                {"role": "user", "content": f"Analyze this user data:\n\n{context_str}"}
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        return json.loads(completion.choices[0].message.content)
        
    except Exception as e:
        print(f"Error generating weekly insight: {e}")
        return {
            "headline": "A Quiet Week",
            "summary": "We couldn't fully analyze your week, but every day is a new beginning.",
            "pattern": "Keep tracking to see more patterns.",
            "sentiment_trend": "Stable",
            "actionable_tip": "Take a moment to breathe deeply today."
        }