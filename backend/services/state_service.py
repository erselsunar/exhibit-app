from sqlalchemy.orm import Session
from models.state import State

def get_state_by_country(db: Session, country_id: int):
    return db.query(State).filter(State.country_id == country_id).all()