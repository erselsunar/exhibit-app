from sqlalchemy import Column, Integer, String
from database.base import Base

class ExpoMgmt(Base):
    __tablename__ = "expo_management"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(40), nullable=False)
    contact_person = Column(String(100))
    email = Column(String(100))
    phone = Column(String(30))