from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db

from services.country_service import get_all, get_country_by_id
from schemas.country import CountryResponse

router = APIRouter()

@router.get("/", response_model=list[CountryResponse])
def read_countries(db: Session = Depends(get_db)):
    return get_all(db)

@router.get("/{id}", response_model=CountryResponse)
def read_country(id : int, db: Session = Depends(get_db)):
    return get_country_by_id(db, id)

