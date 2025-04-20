from fastapi.responses import JSONResponse
from datetime import datetime
from uuid import uuid4
from typing import Dict
from src.utils.contextMaker import get_context, clean_document, format_for_llm
from src.llm.ChatBot import QAChatBot
from src.database.Screening import ScreeningClient
from src.llm.ScreeningScore import MentalHealthRubricScorer

screening_client = ScreeningClient()
user_collection = screening_client.get_user_collection()
scorer = MentalHealthRubricScorer()
chatbot = QAChatBot()

user_sessions: Dict[str, Dict] = {}
MAX_TURNS = 5

async def handle_chat(user_id: str, user_message: str):
    if user_id not in user_sessions:
        user_sessions[user_id] = {
            "turn_count": 0,
            "session_id": str(uuid4()),
            "start_time": datetime.utcnow(),
            "conversation_history": []
        }

    session = user_sessions[user_id]

    # Check if turn_count exceeds MAX_TURNS before processing the new message
    if session["turn_count"] >= MAX_TURNS:
        session_data = {
            "user_id": user_id,
            "session_id": session["session_id"],
            "start_time": session["start_time"],
            "end_time": datetime.utcnow(),
            "status": "completed",
            "conversation_history": session["conversation_history"]
        }

        # Store session data once conversation ends
        user_collection.insert_one(session_data)

        return JSONResponse(content={
            "redirect_url": f"/result?user_id={user_id}&session_id={session['session_id']}"
        })

    # If MAX_TURNS not exceeded, proceed to get a response
    context = get_context(user_id)
    answer = chatbot.get_answer(user_message, context)

    # Store the conversation history
    session["conversation_history"].append({"user": user_message, "doctor": answer})

    # Increment turn count after conversation processing
    session["turn_count"] += 1

    # Update session data
    session_data = {
        "user_id": user_id,
        "session_id": session["session_id"],
        "start_time": session["start_time"],
        "status": "in_progress",
        "conversation_history": session["conversation_history"]
    }

    user_collection.update_one(
        {"session_id": session["session_id"]},
        {"$set": session_data},
        upsert=True
    )

    return {
        "message": answer,
        "session_id": session["session_id"],
        "turn": session["turn_count"],
        "conversation_history": session["conversation_history"]
    }


async def get_result(user_id: str, session_id: str):
    session_data = user_collection.find_one({
        "user_id": user_id,
        "session_id": session_id
    })

    if session_data and "conversation_history" in session_data:
        cleaned_history = clean_document(session_data["conversation_history"])
        chat_history = format_for_llm(cleaned_history)
        result = scorer.score_conversation(chat_history)
        return JSONResponse(content=result)

    return JSONResponse(content={"message": "Session or conversation history not found."})
