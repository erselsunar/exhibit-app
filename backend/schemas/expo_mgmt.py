from pydantic import BaseModel

class ExpoMgmtCreate(BaseModel):
    name: str
    contact_person: str | None = None
    email: str | None = None
    phone: str | None = None

class ExpoMgmtResponse(BaseModel):
    id: int
    name: str
    contact_person: str | None
    email: str | None
    phone: str | None

    class Config:
        from_attributes = True