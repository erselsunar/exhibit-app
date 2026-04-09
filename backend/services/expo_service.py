from sqlalchemy.orm import Session
from models.expo import Expo

def create_expo(db: Session, data):
    expo = Expo(**data.dict())
    db.add(expo)
    db.commit()
    db.refresh(expo)
    return expo

def get_expos(db: Session):
    return db.query(Expo).all()