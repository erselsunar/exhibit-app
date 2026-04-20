from sqlalchemy.orm import Session
from models.booth import Booth
from fastapi import HTTPException

def create_booth(db: Session, data):
    booth = Booth(**data.dict())
    db.add(booth)
    db.commit()
    db.refresh(booth)
    return booth

def get_booths_by_expo(db: Session, expo_id: int):
    return db.query(Booth).filter(Booth.expo_id == expo_id).all()

def get_booth_by_id(db: Session, booth_id: int):
    booth = db.query(Booth).filter(Booth.id == booth_id).first()
    if not booth:
        raise HTTPException(status_code=404, detail="Booth bulunamadı")
    return booth

def update_booth(db: Session, booth_id: int, data):
    booth = db.query(Booth).filter(Booth.id == booth_id).first()
    if not booth:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(booth, key, value)
    db.commit()
    db.refresh(booth)
    return booth

def delete_booth(db: Session, booth_id: int):
    booth = db.query(Booth).filter(Booth.id == booth_id).first()
    if booth:
        db.delete(booth)
        db.commit()
    return {"message": "Silindi"}
