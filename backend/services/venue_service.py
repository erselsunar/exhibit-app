from sqlalchemy.orm import Session
from models.venue import Venue

def get_venues(db: Session):
    return db.query(Venue).all()
    
def get_venue(db: Session, venue_id: int):
    return db.query(Venue).filter(Venue.id == venue_id).first()

def create_venue(db: Session, venue_name: str, city_id: int):
    venue = Venue(venue_name=venue_name, city_id=city_id)
    db.add(venue)
    db.commit()
    db.refresh(venue)
    return venue
    
def delete_venue(db: Session, venue_id :int):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if venue:
        db.delete(venue)
        db.commit()
    return venue