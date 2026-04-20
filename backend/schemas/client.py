from pydantic import BaseModel
from typing import Optional

class ClientCreate(BaseModel):
    name: str
    short_name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city_id: Optional[int] = None
    tax_number: Optional[str] = None

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city_id: Optional[int] = None
    tax_number: Optional[str] = None

class ClientResponse(BaseModel):
    id: int
    name: str
    short_name: Optional[str]
    contact_person: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    city_id: Optional[int]
    tax_number: Optional[str]

    class Config:
        from_attributes = True
