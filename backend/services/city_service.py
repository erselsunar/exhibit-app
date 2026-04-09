from sqlalchemy.orm import Session
from models.city import City

def get_cities_by_state(db: Session, state_id: int):
    return db.query(City).filter(City.state_id == state_id).all()