import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGODB_URL")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  
    DATABASE_NAME = "mental_health_db"
    USER_COLLECTION_NAME = "users"
    SCEENING_COLLECTION_NAME = "screenings"
