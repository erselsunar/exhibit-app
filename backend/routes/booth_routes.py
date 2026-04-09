from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db

from schemas.booth import BoothCreate, BoothResponse
from services.booth_service import *

router = APIRouter()

@router.get("/", response_model=list[BoothResponse])
def read_booths(expo_id: int, db: Session = Depends(get_db)):
    return get_booths_by_expo(db, expo_id)


@router.post("/", response_model=BoothResponse)
def create(data: BoothCreate, db: Session = Depends(get_db)):
    return create_booth(db, data)


@router.get("/{booth_id}", response_model=BoothResponse)
def read_booth(booth_id: int, db: Session = Depends(get_db)):
    return get_booth_by_id(db, booth_id)

@router.delete("/{booth_id}")
def delete(booth_id: int, db: Session = Depends(get_db)):
    return delete_booth(db, booth_id)