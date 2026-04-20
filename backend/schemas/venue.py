from pydantic import BaseModel
from typing import Optional

class VenueCreate(BaseModel):
    venue_name: str
    city_id: int
    address: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class VenueUpdate(BaseModel):
    venue_name: Optional[str] = None
    city_id: Optional[int] = None
    address: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class VenueResponse(BaseModel):
    id: int
    venue_name: str
    city_id: int
    address: Optional[str]
    postal_code: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    website: Optional[str]

    class Config:
        from_attributes = True
