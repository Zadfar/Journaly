from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_current_user
from config import get_supabase
from schemas import MoodCreate, MoodResponse

router = APIRouter(prefix="/moods", tags=["Moods"])

# Save Mood
@router.post("/", response_model=MoodResponse)
def log_mood(entry: MoodCreate, user_id: str = Depends(get_current_user)):
    supabase = get_supabase()
    
    # Check if already logged today to prevent spamming
    today_start = datetime.utcnow().date().isoformat()
    existing = supabase.table("mood_entries")\
        .select("id")\
        .eq("user_id", user_id)\
        .gte("created_at", today_start)\
        .execute()
        
    if existing.data:
        raise HTTPException(status_code=400, detail="Mood already logged today")

    # Insert Data
    data = {
        "user_id": user_id,
        "mood_score": entry.score,
        "mood_label": entry.label
    }
    
    res = supabase.table("mood_entries").insert(data).execute()
    
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to save mood")
        
    new_mood = res.data[0]
    
    return MoodResponse(
        id=new_mood['id'],
        mood_score=new_mood['mood_score'],
        mood_label=new_mood['mood_label'],
        created_at=new_mood['created_at']
    )

# Get Today Mood
@router.get("/today", response_model=bool)
def check_mood_logged_today(user_id: str = Depends(get_current_user)):
    # Returns True if the user has already logged a mood today
    supabase = get_supabase()
    today_start = datetime.utcnow().date().isoformat()
    
    res = supabase.table("mood_entries")\
        .select("id")\
        .eq("user_id", user_id)\
        .gte("created_at", today_start)\
        .execute()
        
    return len(res.data) > 0