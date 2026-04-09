from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db

from schemas.expo import ExpoCreate, ExpoResponse
from services.expo_service import *

router = APIRouter()

@router.get("/", response_model=list[ExpoResponse])
def read_expos(db: Session = Depends(get_db)):
    return get_expos(db)

@router.post("/", response_model=ExpoResponse)
def create(expo: ExpoCreate, db: Session = Depends(get_db)):
    return create_expo(db, expo)