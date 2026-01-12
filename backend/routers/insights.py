from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

from dependencies import get_current_user
from config import get_supabase
from services import ai_service

router = APIRouter(prefix="/insights", tags=["Insights"])

class WeeklySummaryResponse(BaseModel):
    id: Optional[str]
    week_start: str
    week_end: str
    payload: Dict[str, Any]

@router.get("/weekly", response_model=WeeklySummaryResponse)
async def get_weekly_summary(
    offset: int = 0, # 0 = Last completed week, 1 = Week before that, etc.
    user_id: str = Depends(get_current_user)
):
    supabase = get_supabase()
    
    # Calculate the Date Range (Monday to Sunday of the requested week)
    today = datetime.utcnow().date()
    # Find start of current week (Monday)
    current_week_start = today - timedelta(days=today.weekday())
    
    # Calculate target week based on offset
    # If offset=0, we look for the LAST COMPLETED week (so, 1 week ago)
    target_week_start = current_week_start - timedelta(weeks=(offset + 1))
    target_week_end = target_week_start + timedelta(days=6)
    
    start_iso = target_week_start.isoformat() # e.g. "2026-01-05"
    end_iso = target_week_end.isoformat()     # e.g. "2026-01-11"

    # CHECK DB: Do we already have this insight?
    existing = supabase.table("user_insights").select("*")\
        .eq("user_id", user_id)\
        .eq("insight_type", "weekly_summary")\
        .eq("valid_from", start_iso)\
        .execute()

    if existing.data:
        row = existing.data[0]
        return WeeklySummaryResponse(
            id=row['id'],
            week_start=start_iso,
            week_end=end_iso,
            payload=row['payload']
        )

    # GENERATE: If not found, we build it.
    
    moods = supabase.table("mood_entries").select("*")\
        .eq("user_id", user_id)\
        .gte("created_at", start_iso)\
        .lte("created_at", end_iso)\
        .execute()
        
    journals = supabase.table("journals").select("*")\
        .eq("user_id", user_id)\
        .gte("created_at", start_iso)\
        .lte("created_at", end_iso)\
        .execute()

    if len(moods.data) < 2 and len(journals.data) < 1:
        return WeeklySummaryResponse(
            id=None,
            week_start=start_iso,
            week_end=end_iso,
            payload={
                "headline": "A Quiet Week",
                "summary": "You didn't log much this week. Try journaling more to uncover patterns!",
                "is_empty": True
            }
        )

    # Call AI Service
    ai_payload = await ai_service.generate_weekly_insight(
        moods.data, 
        journals.data, 
        start_iso, 
        end_iso
    )

    # Save to DB 
    new_insight = {
        "user_id": user_id,
        "insight_type": "weekly_summary",
        "valid_from": start_iso,
        "valid_until": end_iso,
        "payload": ai_payload
    }
    
    res = supabase.table("user_insights").insert(new_insight).execute()
    
    return WeeklySummaryResponse(
        id=res.data[0]['id'],
        week_start=start_iso,
        week_end=end_iso,
        payload=ai_payload
    )