from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import profiles, journals, moods, quotes, insights

app = FastAPI(title="Journaly API")

# CORS - Update allow_origins with your frontend URL (e.g. EC2 IP or Netlify URL)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profiles.router)
app.include_router(journals.router)
app.include_router(moods.router)
app.include_router(quotes.router)
app.include_router(insights.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    # Run on 0.0.0.0 to expose it to the outside world (EC2)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)