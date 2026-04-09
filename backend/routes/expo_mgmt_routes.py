from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db

from schemas.expo_mgmt import ExpoMgmtCreate, ExpoMgmtResponse
from services.expo_mgmt_service import *

router = APIRouter()

@router.get("/", response_model=list[ExpoMgmtResponse])
def read_all(db: Session = Depends(get_db)):
    return get_all(db)

@router.post("/", response_model=ExpoMgmtResponse)
def create(data: ExpoMgmtCreate, db: Session = Depends(get_db)):
    return create_expo_mgmt(db, data)