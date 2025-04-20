# src/routes/screening_routes.py

from fastapi import APIRouter, Request
from src.controllers.screening_controller import handle_chat, get_result

screening_router = APIRouter()

@screening_router.post("/chat")
async def get_screenings(request: Request):
    data = await request.json()
    user_id = data.get("userId")
    user_message = data.get("message")

    if not user_id or not user_message:
        return {"message": "Missing userId or message."}

    return await handle_chat(user_id, user_message)

@screening_router.get("/result")
async def result(user_id: str, session_id: str):
    return await get_result(user_id, session_id)
