from pymongo import MongoClient, errors
from bson import ObjectId
from src.config import Config  

class ScreeningClient:
    def __init__(self):
        try:
            self.client = MongoClient(Config.MONGO_URI)
            self.db = self.client[Config.DATABASE_NAME]
            print("✅ MongoDB connection established successfully.")
        except errors.ConnectionFailure as e:
            print(f"❌ Error connecting to MongoDB: {e}")
            raise e
    
    def get_user_collection(self):
        return self.db[Config.SCEENING_COLLECTION_NAME]

    def get_screenings_session(self, user_id: str, session_id: str):
        collection = self.get_user_collection()
        return collection.find_one({
            "user_id": user_id,
            "session_id": session_id
        }) 
