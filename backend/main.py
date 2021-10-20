import json
import os
from dotenv import load_dotenv
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import datetime
import jwt
from fastapi.security import OAuth2PasswordBearer
from starlette import status
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import SessionLocal, engine
import models, schemas, crud


load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')


app = FastAPI()


models.Base.metadata.create_all(bind = engine)  # Create the tables in the database

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "token")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def authHandler(jwt_token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return crud.get_current_user(jwt_token, db)


@app.get("/")
async def root():
    return {"test": "received"}


@app.post('/signup')
async def signup(credentials: schemas.UserSignup, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if user:
        return {"error": "User with given email already exists"}
    
    newuser = models.User(email = credentials.email, password = pwd_context.hash(credentials.password))
    db.add(newuser)
    db.commit()
    db.refresh(newuser)
    return {"Message": "Signup Successful"}


@app.post('/login')
async def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user:
        return {"error": "No such user exists"}
    if not pwd_context.verify(credentials.password, user.password):
        return {"error": "Wrong Password"}
    token = jwt.encode({'email': user.email,
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes = 300)},
                       SECRET_KEY)
    return {"token": token}


