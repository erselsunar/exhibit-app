from sqlalchemy.orm import Session
from models.city import City

def get_cities(db: Session):
    return db.query(City).all()

def get_city(db: Session, city_id: int):
    return db.query(City).filter(City.id == city_id).first()

def create_city(db: Session, city_name: str):
    new_city = City(city_name=city_name)
    db.add(new_city)
    db.commit()
    db.refresh(new_city)
    return new_city

def delete_city(db: Session, city_id: int):
    city = db.query(City).filter(City.id == city_id).first()
    if city:
        db.delete(city)
        db.commit()
    return city