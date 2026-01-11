from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Profile ---
class ProfileResponse(BaseModel):
    id: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime

# --- Journal ---
class JournalCreate(BaseModel):
    content: str
    mood_score: int

class JournalResponse(BaseModel):
    id: str
    mood_score: int
    summary: Optional[str]
    tags: List[str] = []
    created_at: datetime
    content: Optional[str] = None

# --- Mood ---
class MoodCreate(BaseModel):
    score: int
    label: str

class MoodResponse(BaseModel):
    id: str
    mood_score: int
    mood_label: str
    created_at: datetime