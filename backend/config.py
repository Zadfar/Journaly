import os
from supabase import create_client, Client
from groq import Groq
from cryptography.fernet import Fernet
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Environment Variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
EDGE_FUNCTION_URL = os.getenv("EDGE_FUNCTION_URL")

if not all([SUPABASE_URL, SUPABASE_KEY, GROQ_API_KEY, ENCRYPTION_KEY, EDGE_FUNCTION_URL]):
    raise ValueError("Missing environment variables! Check .env")

# Initialize Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
groq_client = Groq(api_key=GROQ_API_KEY)
cipher_suite = Fernet(ENCRYPTION_KEY.encode())

# Dependency Getters
def get_supabase() -> Client:
    return supabase

def get_groq() -> Groq:
    return groq_client

def get_cipher() -> Fernet:
    return cipher_suite