from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db

from services.state_service import get_state_by_country
from schemas.state import StateResponse

router = APIRouter()

@router.get("/", response_model=list[StateResponse])
def read_states(country_id: int, db: Session = Depends(get_db)):
    return get_state_by_country(db, country_id)