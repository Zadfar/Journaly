import requests
from datetime import datetime
from fastapi import APIRouter, HTTPException
import os
from pydantic import BaseModel

router = APIRouter(prefix="/quotes", tags=["Quotes"])

# Simple in-memory cache
class QuoteCache:
    date: str = None
    data: dict = None

cache = QuoteCache()

class QuoteResponse(BaseModel):
    quote: str
    author: str

@router.get("/daily", response_model=QuoteResponse)
def get_daily_quote():
    api_key = os.getenv("API_NINJAS_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API Key not configured")

    today = datetime.utcnow().date().isoformat()

    # 1. CHECK CACHE: If we already fetched it today, return it
    if cache.date == today and cache.data:
        return cache.data

    # 2. FETCH FROM API NINJAS
    url = "https://api.api-ninjas.com/v2/quotes?category=inspirational%2Cwisdom"
    
    try:
        response = requests.get(url, headers={'X-Api-Key': api_key})
        response.raise_for_status()
        
        data = response.json()
        
        if data and len(data) > 0:
            raw_quote = data[0]

            
            cleaned_data = {
                "quote": raw_quote.get('quote'),
                "author": raw_quote.get('author'),
            }
            
            # Update Cache
            cache.date = today
            cache.data = cleaned_data
            
            return cleaned_data
        else:
             raise HTTPException(status_code=404, detail="No quote found")

    except Exception as e:
        print(f"Error fetching quote: {e}")
        # Fallback if API fails (so UI doesn't break)
        return {
            "quote": "The only journey is the one within.",
            "author": "Rainer Maria Rilke",
            "category": "fallback"
        }