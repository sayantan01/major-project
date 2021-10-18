from pydantic import BaseModel
from datetime import date
from typing import List, Optional


class UserSignup(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str