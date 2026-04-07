from pydantic import BaseModel

class VenueCreate(BaseModel):
    venue_name: str
    city_id: int

class VenueResponse(BaseModel):
    id: int
    venue_name: str
    city_id: int

    class Config:
        from_attributes = True