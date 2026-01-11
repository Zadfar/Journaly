from datetime import datetime
from typing import Optional
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel
from dependencies import get_current_user
from config import get_supabase
from schemas import JournalCreate, JournalResponse
from services import ai_service, crypto_service

router = APIRouter(prefix="/journals", tags=["Journals"])

class DeepenRequest(BaseModel):
    content: str
    journal_id: Optional[str] = None

# Get All Journals 
@router.get("/", response_model=list[JournalResponse])
def get_journals(user_id: str = Depends(get_current_user)):
    supabase = get_supabase()
    
    response = supabase.table("journals").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    
    journals = []
    for item in response.data:
        journals.append(JournalResponse(
            id=item['id'],
            mood_score=item['mood_score'],
            summary=item.get('summary'),
            tags=item.get('tags') or [],
            created_at=item['created_at'],
            content=""
        ))
    return journals

# Save Journal
@router.post("/", response_model=JournalResponse)
async def create_journal(
    entry: JournalCreate,
    background_tasks: BackgroundTasks,
    user_id: str = Depends(get_current_user)
):
    supabase = get_supabase()

    try:
        
        encrypted_content = crypto_service.encrypt(entry.content)

        journal_data = {
            "user_id": user_id,
            "mood_score": entry.mood_score,
            "content_encrypted": encrypted_content,
            "summary": "Generating summary...",
            "tags": []
        }

        res = supabase.table("journals").insert(journal_data).execute()
        new_journal = res.data[0]

        background_tasks.add_task(
            ai_service.process_journal_background,
            new_journal['id'],
            entry.content,
            user_id
        )

        return JournalResponse(
            id=new_journal['id'],
            mood_score=new_journal['mood_score'],
            summary="Generating Summary...",
            tags=[],
            created_at=new_journal['created_at'],
            content=entry.content
        )

    except Exception as e:
        print(f"Error creating journal: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Delete Journal    
@router.delete("/{journal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_journal(journal_id: str, user_id: str = Depends(get_current_user)):
    supabase = get_supabase()
    
    # We explicitly add .eq('user_id', user_id) for extra safety, 
    # ensuring a user can never delete someone else's journal.
    result = supabase.table("journals").delete().eq("id", journal_id).eq("user_id", user_id).execute()
    
    # Check if a row was actually deleted
    if not result.data:
        raise HTTPException(status_code=404, detail="Journal not found or not authorized")
    
    return None

# Get Journal by Id
@router.get("/{journal_id}", response_model=JournalResponse)
def get_journal_detail(journal_id: str, user_id: str = Depends(get_current_user)):
    supabase = get_supabase()
    
    # Fetch specific row
    response = supabase.table("journals").select("*").eq("id", journal_id).eq("user_id", user_id).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Journal not found")
        
    data = response.data
    
    # Decrypt the content for the editor
    decrypted_content = crypto_service.decrypt(data['content_encrypted'])
    
    return JournalResponse(
        id=data['id'],
        mood_score=data['mood_score'],
        summary=data['summary'],
        tags=data['tags'],
        created_at=data['created_at'],
        content=decrypted_content
    )

# Update Journal By Id
@router.put("/{journal_id}", response_model=JournalResponse)
def update_journal(journal_id: str, entry: JournalCreate, user_id: str = Depends(get_current_user)):
    supabase = get_supabase()

    # Encrypt new content
    encrypted_content = crypto_service.encrypt(entry.content)
    
    # Update DB (For now, we are NOT re-running AI to save resources, but you could)
    data = {
        "content_encrypted": encrypted_content,
        "mood_score": entry.mood_score
    }
    
    res = supabase.table("journals").update(data).eq("id", journal_id).eq("user_id", user_id).execute()
    
    # Return updated object
    return JournalResponse(
        id=journal_id,
        mood_score=entry.mood_score,
        summary="Updated...", # Placeholder until AI runs again
        created_at=datetime.now(),
        content=entry.content
    )

# Go Deeper
@router.post("/deepen")
async def go_deeper(req: DeepenRequest, user_id: str = Depends(get_current_user)):
    supabase = get_supabase()
    
    # We must ensure the entry exists/is updated before we run analysis
    journal_id = req.journal_id
    encrypted_content = crypto_service.encrypt(req.content)

    if journal_id:
        # Update existing
        supabase.table("journals").update({
            "content_encrypted": encrypted_content
        }).eq("id", journal_id).eq("user_id", user_id).execute()
    else:
        # Create new (Draft)
        res = supabase.table("journals").insert({
            "user_id": user_id,
            "mood_score": 5, # Default, user can change later
            "content_encrypted": encrypted_content,
            "summary": "Draft...",
        }).execute()
        journal_id = res.data[0]['id']

    # RUN "GO DEEPER" AI
    prompt = await ai_service.get_deepen_prompt(user_id, req.content)

    return {
        "journal_id": journal_id, # Return ID so frontend can update URL if it was new
        "prompt": prompt
    }