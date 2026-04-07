from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from schemas.city import CityCreate, CityResponse
from services.city_service import *
from database.session import get_db

router = APIRouter()

@router.get("/", response_model=list[CityResponse])
def read_cities(db: Session = Depends(get_db)):
    return get_cities(db)

@router.get("/{city_id}", response_model=CityResponse)
def read_city(city_id: int, db: Session = Depends(get_db)):
    city = get_city(db, city_id)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city

@router.post("/", response_model=CityResponse)
def create(city: CityCreate, db: Session = Depends(get_db)):
    return create_city(db, city.city_name)

@router.delete("/{city_id}")
def delete(city_id: int, db: Session = Depends(get_db)):
    city = delete_city(db, city_id)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return {"message": "Deleted successfully"}