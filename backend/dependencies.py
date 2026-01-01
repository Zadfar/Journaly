from fastapi import Header, HTTPException
from config import get_supabase

async def get_current_user(authorization: str = Header(...)):
    """
    Validates the Supabase JWT sent by the frontend 
    and returns the user_id.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    
    token = authorization.split(" ")[1]
    supabase = get_supabase()
    
    user_response = supabase.auth.get_user(token)
    
    if not user_response.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
        
    return user_response.user.id