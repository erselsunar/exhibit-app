from sqlalchemy.orm import Session
from models.country import Country
from fastapi import HTTPException

def get_all(db: Session):
    return db.query(Country).all()

def get_country_by_id(db: Session, id: int):
    country = db.query(Country).filter(Country.id == id).first()
    
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    return country