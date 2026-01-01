from config import get_cipher

def encrypt(text: str) -> str:
    """Encrypts text to a base64 string"""
    return get_cipher().encrypt(text.encode()).decode()

def decrypt(text: str) -> str:
    """Decrypts base64 string back to text"""
    try:
        return get_cipher().decrypt(text.encode()).decode()
    except Exception:
        return "[Decryption Error]"