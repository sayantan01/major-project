from fastapi import HTTPException
from fastapi.responses import JSONResponse
import json
import jwt
from starlette import status
import pandas as pd
import datetime
import numpy as np
import os
from sqlalchemy.orm import Session

import models, schemas

SECRET_KEY = os.getenv("SECRET_KEY")


def get_current_user(token: str, db: Session):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    email = None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
    except Exception as e:
        print(e)
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


def csvToList(path, fields):
    df = pd.read_csv(path)
    res_list = []
    for i in range(len(df)):
        res_list.append(
            schemas.single_location(
                name=df.loc[i, fields[0]],
                district=df.loc[i, fields[1]],
                latitude=df.loc[i, fields[2]],
                longitude=df.loc[i, fields[3]],
            )
        )
    return res_list


def fetch_locations(db: Session):
    warehouses = csvToList(
        "../datasets/data/warehouses.csv",
        ["college", "district", "latitude", "longitude"],
    )
    zones = csvToList(
        "../datasets/data/zones.csv",
        ["headquarter", "district", "latitude", "longitude"],
    )
    return schemas.locations(warehouses=warehouses, zones=zones)


def predict_for_warehouse(warehouse_index: int, db: Session):
    prediction_matrix = np.load("./core/prediction_matrix.npy")
    if warehouse_index < 0 or warehouse_index > len(prediction_matrix):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"msg": "Invalid value for parameter index"},
        )
    ratios = list(prediction_matrix[warehouse_index])
    distance_matrix = pd.read_csv(
        "../datasets/data/distance_matrix.csv", header=None
    ).values.tolist()
    distances = list(distance_matrix[warehouse_index])
    print(ratios, distances)
    return schemas.prediction(ratios=ratios, distances=distances)


def predict_for_zone(zone_index: int, db: Session):
    prediction_matrix = np.load("./core/prediction_matrix.npy")
    if zone_index < 0 or zone_index > len(prediction_matrix[0]):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"msg": "Invalid value for parameter index"},
        )
    ratios = list(prediction_matrix[:, zone_index])
    distance_matrix = pd.read_csv(
        "../datasets/data/distance_matrix.csv", header=None
    ).values.tolist()
    distances = list(np.array(distance_matrix)[:, zone_index])
    print(ratios, distances)
    return schemas.prediction(ratios=ratios, distances=distances)
