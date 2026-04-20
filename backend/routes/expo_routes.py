from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db

from schemas.expo import ExpoCreate, ExpoUpdate, ExpoResponse
from services.expo_service import get_expos, get_expo, create_expo, update_expo, delete_expo

router = APIRouter()

@router.get("/", response_model=list[ExpoResponse])
def read_expos(db: Session = Depends(get_db)):
    return get_expos(db)

@router.get("/{expo_id}", response_model=ExpoResponse)
def read_expo(expo_id: int, db: Session = Depends(get_db)):
    expo = get_expo(db, expo_id)
    if not expo:
        raise HTTPException(status_code=404, detail="Expo bulunamadı")
    return expo

@router.post("/", response_model=ExpoResponse)
def create(expo: ExpoCreate, db: Session = Depends(get_db)):
    return create_expo(db, expo)

@router.put("/{expo_id}", response_model=ExpoResponse)
def update(expo_id: int, expo: ExpoUpdate, db: Session = Depends(get_db)):
    updated = update_expo(db, expo_id, expo)
    if not updated:
        raise HTTPException(status_code=404, detail="Expo bulunamadı")
    return updated

@router.delete("/{expo_id}")
def delete(expo_id: int, db: Session = Depends(get_db)):
    expo = delete_expo(db, expo_id)
    if not expo:
        raise HTTPException(status_code=404, detail="Expo bulunamadı")
    return {"message": "Silindi"}
