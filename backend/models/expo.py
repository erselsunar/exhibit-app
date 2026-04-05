from sqlalchemy import Column, Integer, String, ForeignKey, Date
from database import Base

class Expo(Base):
    __tablename__ = "expos"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    venue_id = Column(Integer, ForeignKey("venues.id"))
    start_date = Column(Date)
    end_date = Column(Date)