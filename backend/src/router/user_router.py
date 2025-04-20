from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from pymongo.errors import PyMongoError
from src.model.UserSchema import UserSchema
from src.database.User import UserdbClient  

user_router = APIRouter()
user_db_client = UserdbClient()

@user_router.get("/")
def find_user(email: str = Query(..., description="Email ID of the user")):
    try:
        user = user_db_client.find_user({"email": email})
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    if user:
        user["_id"] = str(user["_id"])
        return {"message": "User data found", "data": user}
    else:
        raise HTTPException(status_code=404, detail="User not found")

@user_router.get("/{user_id}")
def get_user_by_id(user_id: str):
    try:
        user = user_db_client.find_user_by_id(user_id)

        if user:
            user["_id"] = str(user["_id"])
            return {"message": "User found", "data": user}
        raise HTTPException(status_code=404, detail="User not found")
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid ID format: {e}")

@user_router.post("/")
def create_user(user: UserSchema):
    try:
        user_data = user.dict()
        inserted_id = user_db_client.insert_user(user_data)
        return {
            "message": "User created successfully",
            "user_id": str(inserted_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")
