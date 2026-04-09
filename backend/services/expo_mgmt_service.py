from sqlalchemy.orm import Session
from models.expo_mgmt import ExpoMgmt

def create_expo_mgmt(db: Session, data):
    obj = ExpoMgmt(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_all(db: Session):
    return db.query(ExpoMgmt).all()