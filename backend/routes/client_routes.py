from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db

from schemas.client import ClientCreate, ClientUpdate, ClientResponse
from services.client_service import get_clients, get_client, create_client, update_client, delete_client

router = APIRouter()

@router.get("/", response_model=list[ClientResponse])
def read_all(db: Session = Depends(get_db)):
    return get_clients(db)

@router.get("/{client_id}", response_model=ClientResponse)
def read_one(client_id: int, db: Session = Depends(get_db)):
    client = get_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Müşteri bulunamadı")
    return client

@router.post("/", response_model=ClientResponse)
def create(data: ClientCreate, db: Session = Depends(get_db)):
    return create_client(db, data)

@router.put("/{client_id}", response_model=ClientResponse)
def update(client_id: int, data: ClientUpdate, db: Session = Depends(get_db)):
    client = update_client(db, client_id, data)
    if not client:
        raise HTTPException(status_code=404, detail="Müşteri bulunamadı!")
    return client

@router.delete("/{client_id}")
def delete(client_id: int, db: Session = Depends(get_db)):
    client = delete_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Müşteri bulunamadı!")
    return {"message": "Silindi"}
