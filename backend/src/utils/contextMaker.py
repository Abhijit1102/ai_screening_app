from bson import ObjectId
from datetime import datetime
from src.database.User import UserdbClient

user_db_client = UserdbClient()

def get_context(user_id: str) -> str:
    user = user_db_client.find_user_by_id(user_id)
    
    if not user:
        return "No user context available."

    name = user.get("name", "Unknown")
    age = user.get("age", "Unknown")
    gender = user.get("gender", "Unknown")

    return (
        f"You are chatting with a patient named {name}, a {age}-year-old {gender.lower()}. "
    )

def clean_document(doc):
    """Recursively convert ObjectId and datetime to JSON-serializable formats."""
    if isinstance(doc, dict):
        return {
            k: clean_document(v) for k, v in doc.items()
        }
    elif isinstance(doc, list):
        return [clean_document(item) for item in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, datetime):
        return doc.isoformat()
    return doc

def format_for_llm(history):
    return [
        {"role": "user", "content": entry["user"]}
        if "user" in entry else
        {"role": "doctor", "content": entry["doctor"]}
        for entry in history
        for key in entry
    ]