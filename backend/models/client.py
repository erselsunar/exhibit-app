from sqlalchemy import Column, Integer, String, Text, BigInteger, ForeignKey
from database.base import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    short_name = Column(String(255))
    contact_person = Column(String(255))
    email = Column(String(255))
    phone = Column(String(50))
    address = Column(Text)
    city_id = Column(BigInteger, ForeignKey("cities.id"), nullable=True)
    tax_number = Column(String(50))
