from pydantic import BaseModel
from datetime import date

class ExpoCreate(BaseModel):
    expo_name: str
    expo_year: int
    venue_id: int
    start_date: date
    end_date: date
    expo_mgmt_id : int

class ExpoResponse(BaseModel):
    id: int
    expo_name: str
    expo_year: int
    venue_id: int
    start_date: date
    end_date: date
    expo_mgmt_id : int

    class Config:
        from_attributes = True