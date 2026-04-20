from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db

from schemas.expo_mgmt import ExpoMgmtCreate, ExpoMgmtUpdate, ExpoMgmtResponse
from services.expo_mgmt_service import get_all, get_by_id, create_expo_mgmt, update_expo_mgmt, delete_expo_mgmt

router = APIRouter()

@router.get("/", response_model=list[ExpoMgmtResponse])
def read_all(db: Session = Depends(get_db)):
    return get_all(db)

@router.get("/{mgmt_id}", response_model=ExpoMgmtResponse)
def read_one(mgmt_id: int, db: Session = Depends(get_db)):
    obj = get_by_id(db, mgmt_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Bulunamadı")
    return obj

@router.post("/", response_model=ExpoMgmtResponse)
def create(data: ExpoMgmtCreate, db: Session = Depends(get_db)):
    return create_expo_mgmt(db, data)

@router.put("/{mgmt_id}", response_model=ExpoMgmtResponse)
def update(mgmt_id: int, data: ExpoMgmtUpdate, db: Session = Depends(get_db)):
    obj = update_expo_mgmt(db, mgmt_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="Bulunamadı")
    return obj

@router.delete("/{mgmt_id}")
def delete(mgmt_id: int, db: Session = Depends(get_db)):
    obj = delete_expo_mgmt(db, mgmt_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Bulunamadı")
    return {"message": "Silindi"}
