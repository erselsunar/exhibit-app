from sqlalchemy.orm import Session
from models.venue import Venue

def get_venues(db: Session):
    return db.query(Venue).all()

def get_venues_by_city(db: Session, city_id: int):
    return db.query(Venue).filter(Venue.city_id == city_id).all()

def get_venue(db: Session, venue_id: int):
    return db.query(Venue).filter(Venue.id == venue_id).first()

def create_venue(db: Session, data):
    venue = Venue(**data.dict())
    db.add(venue)
    db.commit()
    db.refresh(venue)
    return venue

def update_venue(db: Session, venue_id: int, data):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(venue, key, value)
    db.commit()
    db.refresh(venue)
    return venue

def delete_venue(db: Session, venue_id: int):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if venue:
        db.delete(venue)
        db.commit()
    return venue
