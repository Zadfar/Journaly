from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_current_user
from config import get_supabase
from schemas import ProfileResponse

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/", response_model=ProfileResponse)
def get_my_profile(user_id: str = Depends(get_current_user)):
    supabase = get_supabase()
    
    response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    data = response.data
    return ProfileResponse(
        id=data['id'],
        display_name=data.get('display_name'),
        avatar_url=data.get('avatar_url'),
        created_at=data['created_at']
    )