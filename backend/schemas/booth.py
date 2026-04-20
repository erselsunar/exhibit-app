from pydantic import BaseModel
from typing import Optional

class BoothCreate(BaseModel):
    booth_id: str
    expo_id: int
    partner_id: Optional[int] = None
    dimension: Optional[str] = None
    uom: Optional[str] = None

class BoothUpdate(BaseModel):
    booth_id: Optional[str] = None
    expo_id: Optional[int] = None
    partner_id: Optional[int] = None
    dimension: Optional[str] = None
    uom: Optional[str] = None

class BoothResponse(BaseModel):
    id: int
    booth_id: str
    expo_id: int
    partner_id: Optional[int]
    dimension: Optional[str]
    uom: Optional[str]

    class Config:
        from_attributes = True
