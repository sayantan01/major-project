from pydantic import BaseModel
from datetime import date
from typing import List, Optional


class UserSignup(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class single_location(BaseModel):
    name: str
    district: str
    latitude: float
    longitude: float


class locations(BaseModel):
    warehouses: List[single_location]
    zones: List[single_location]


class prediction(BaseModel):
    ratios: List[float]
    distances: List[float]
