from pydantic import BaseModel, EmailStr
from typing import Literal

class UserSchema(BaseModel):
    name: str
    age: int
    gender: Literal["Male", "Female", "Trans"]
    email: EmailStr