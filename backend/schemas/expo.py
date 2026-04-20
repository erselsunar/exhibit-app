from pydantic import BaseModel
from datetime import date
from typing import Optional

class ExpoCreate(BaseModel):
    expo_name: str
    expo_year: int
    venue_id: int
    start_date: date
    end_date: date
    expo_mgmt_id: int

class ExpoUpdate(BaseModel):
    expo_name: Optional[str] = None
    expo_year: Optional[int] = None
    venue_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    expo_mgmt_id: Optional[int] = None

class ExpoResponse(BaseModel):
    id: int
    expo_name: str
    expo_year: int
    venue_id: int
    start_date: date
    end_date: date
    expo_mgmt_id: int

    class Config:
        from_attributes = True
