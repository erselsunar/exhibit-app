from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from schemas.venue import VenueCreate, VenueUpdate, VenueResponse
from services.venue_service import (
    get_venues, get_venues_by_city, get_venue,
    create_venue, update_venue, delete_venue
)
from database.session import get_db

router = APIRouter()

@router.get("/", response_model=list[VenueResponse])
def read_venues(city_id: Optional[int] = None, db: Session = Depends(get_db)):
    if city_id:
        return get_venues_by_city(db, city_id)
    return get_venues(db)

@router.get("/{venue_id}", response_model=VenueResponse)
def read_venue(venue_id: int, db: Session = Depends(get_db)):
    venue = get_venue(db, venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue bulunamadı")
    return venue

@router.post("/", response_model=VenueResponse)
def create(venue: VenueCreate, db: Session = Depends(get_db)):
    return create_venue(db, venue)

@router.put("/{venue_id}", response_model=VenueResponse)
def update(venue_id: int, venue: VenueUpdate, db: Session = Depends(get_db)):
    updated = update_venue(db, venue_id, venue)
    if not updated:
        raise HTTPException(status_code=404, detail="Venue bulunamadı")
    return updated

@router.delete("/{venue_id}")
def delete(venue_id: int, db: Session = Depends(get_db)):
    venue = delete_venue(db, venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue bulunamadı")
    return {"message": "Silindi"}
