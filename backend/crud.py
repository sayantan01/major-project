from fastapi import HTTPException
import json
import jwt
from starlette import status
import pandas as pd
import datetime
import numpy as np
import os
from sqlalchemy.orm import Session

import models, schemas

SECRET_KEY = os.getenv('SECRET_KEY')


def get_current_user(token: str, db: Session):
    credentials_exception = HTTPException (
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Could not validate credentials",
        headers = {"WWW-Authenticate": "Bearer"},
    )
    email = None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms = ["HS256"])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
    except Exception as e:
        print(e)
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user
