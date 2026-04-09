from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey, Text, Numeric
from database.base import Base

class Venue(Base):
    __tablename__ = "venue"

    id = Column(Integer, primary_key=True, index=True)
    venue_name = Column(String(100), nullable=False)

    city_id = Column(BigInteger, ForeignKey("cities.id"), nullable=False)

    address = Column(Text)
    postal_code = Column(String(20))

    phone = Column(String(20))
    email = Column(String(100))
    website = Column(String(255))