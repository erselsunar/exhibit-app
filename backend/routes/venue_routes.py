from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from schemas.venue import VenueCreate, VenueResponse
from services.venue_service import *
from database.session import get_db

router = APIRouter()

@router.get("/", response_model=list[VenueResponse])
def read_venues(db: Session = Depends(get_db)):
    return get_venues(db)

@router.post("/", response_model=VenueResponse)
def create(venue: VenueCreate, db: Session = Depends(get_db)):
    return create_venue(db, venue.venue_name, venue.city_id)