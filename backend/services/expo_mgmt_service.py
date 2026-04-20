from sqlalchemy.orm import Session
from models.expo_mgmt import ExpoMgmt

def get_all(db: Session):
    return db.query(ExpoMgmt).all()

def get_by_id(db: Session, mgmt_id: int):
    return db.query(ExpoMgmt).filter(ExpoMgmt.id == mgmt_id).first()

def create_expo_mgmt(db: Session, data):
    obj = ExpoMgmt(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_expo_mgmt(db: Session, mgmt_id: int, data):
    obj = db.query(ExpoMgmt).filter(ExpoMgmt.id == mgmt_id).first()
    if not obj:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj

def delete_expo_mgmt(db: Session, mgmt_id: int):
    obj = db.query(ExpoMgmt).filter(ExpoMgmt.id == mgmt_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj
