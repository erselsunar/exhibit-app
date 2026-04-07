from sqlalchemy import Column, Integer, String, ForeignKey
from database.base import Base

class Venue(Base):
    __tablename__ = "venue"

    id = Column(Integer, primary_key=True, index=True)
    venue_name = Column(String(40), nullable=False)
    city_id = Column(Integer, ForeignKey("city.id"), nullable=False)