import json
import os
from dotenv import load_dotenv
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
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

SECRET_KEY = os.getenv("SECRET_KEY")


app = FastAPI()


models.Base.metadata.create_all(bind=engine)  # Create the tables in the database

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def authHandler(
    jwt_token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    return crud.get_current_user(jwt_token, db)


@app.get("/")
async def root():
    return {"test": "received"}


@app.post("/api/user/signup")
async def signup(credentials: schemas.UserSignup, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if user:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"msg": "User already exists"},
        )

    newuser = models.User(
        email=credentials.email, password=pwd_context.hash(credentials.password)
    )
    db.add(newuser)
    db.commit()
    db.refresh(newuser)
    return {"Message": "Signup Successful"}


@app.post("/login/api/user/login")
async def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"msg": "User does not exist"},
        )
    if not pwd_context.verify(credentials.password, user.password):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN, content={"msg": "Incorrect password"}
        )
    token = jwt.encode(
        {
            "email": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        },
        SECRET_KEY,
    )
    return {"token": token, "email": user.email}


@app.get("/api/fetch", response_model=schemas.locations)
async def fetch_locations(
    db: Session = Depends(get_db), user: models.User = Depends(authHandler)
):
    return crud.fetch_locations(db)


@app.get("/api/predict")
async def get_predictions(index: int, warehouse: int, db: Session = Depends(get_db)):
    if warehouse == 1:
        return crud.predict_for_warehouse(index, db)
    elif warehouse == 0:
        return crud.predict_for_zone(index, db)
    else:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"msg": "Invalid value for parameter warehouse"},
        )
