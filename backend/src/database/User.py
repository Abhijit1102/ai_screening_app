from pymongo import MongoClient, errors
from bson import ObjectId
from src.config import Config

class UserdbClient:
    def __init__(self):
        try:
            self.client = MongoClient(Config.MONGO_URI)
            self.db = self.client[Config.DATABASE_NAME]
            print("✅ MongoDB connection established successfully.")
        except errors.ConnectionFailure as e:
            print(f"❌ Error connecting to MongoDB: {e}")
            raise e
    
    def get_user_collection(self):
        return self.db[Config.USER_COLLECTION_NAME]

    def insert_user(self, user_data):
        try:
            collection = self.get_user_collection()
            result = collection.insert_one(user_data)
            return result.inserted_id
        except Exception as e:
            print(f"❌ Error inserting user: {e}")
            raise e

    def find_user(self, query):
        try:
            collection = self.get_user_collection()
            return collection.find_one(query)
        except Exception as e:
            print(f"❌ Error finding user: {e}")
            raise e

    
    def find_user_by_id(self, user_id: str):
        try:
            object_id = ObjectId(user_id)
            collection = self.get_user_collection()
            user = collection.find_one({"_id": object_id})
            return user
        except Exception as e:
            print(f"❌ Error finding user by ID: {e}")
        raise e

    def update_user(self, query, update_data):
        try:
            collection = self.get_user_collection()
            return collection.update_one(query, {"$set": update_data}).modified_count
        except Exception as e:
            print(f"❌ Error updating user: {e}")
            raise e

    def delete_user(self, query):
        try:
            collection = self.get_user_collection()
            return collection.delete_one(query).deleted_count
        except Exception as e:
            print(f"❌ Error deleting user: {e}")
            raise e

    def close_connection(self):
        self.client.close()
        print("🔌 MongoDB connection closed.")
