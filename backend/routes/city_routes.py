from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db

from services.city_service import get_cities_by_state
from schemas.city import CityResponse

router = APIRouter()

@router.get("/", response_model=list[CityResponse])
def read_cities(state_id: int, db: Session = Depends(get_db)):
    return get_cities_by_state(db, state_id)