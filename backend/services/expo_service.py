from sqlalchemy.orm import Session
from models.expo import Expo

def get_expos(db: Session):
    return db.query(Expo).all()

def get_expo(db: Session, expo_id: int):
    return db.query(Expo).filter(Expo.id == expo_id).first()

def create_expo(db: Session, data):
    expo = Expo(**data.dict())
    db.add(expo)
    db.commit()
    db.refresh(expo)
    return expo

def update_expo(db: Session, expo_id: int, data):
    expo = db.query(Expo).filter(Expo.id == expo_id).first()
    if not expo:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(expo, key, value)
    db.commit()
    db.refresh(expo)
    return expo

def delete_expo(db: Session, expo_id: int):
    expo = db.query(Expo).filter(Expo.id == expo_id).first()
    if expo:
        db.delete(expo)
        db.commit()
    return expo
