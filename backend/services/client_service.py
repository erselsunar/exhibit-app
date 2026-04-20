from sqlalchemy.orm import Session
from models.client import Client

def get_clients(db: Session):
    return db.query(Client).all()

def get_client(db: Session, client_id: int):
    return db.query(Client).filter(Client.id == client_id).first()

def create_client(db: Session, data):
    client = Client(**data.dict())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

def update_client(db: Session, client_id: int, data):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(client, key, value)
    db.commit()
    db.refresh(client)
    return client

def delete_client(db: Session, client_id: int):
    client = db.query(Client).filter(Client.id == client_id).first()
    if client:
        db.delete(client)
        db.commit()
    return client
