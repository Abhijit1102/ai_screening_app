from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class Message(BaseModel):
    user: str
    doctor: str

class ScreeningSession(BaseModel):
    user_id: str
    session_id: UUID
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str
    conversation_history: List[Message]

  