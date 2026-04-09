from sqlalchemy import Column, Integer, String, Date, ForeignKey
from database.base import Base

class Expo(Base):
    __tablename__ = "expo"

    id = Column(Integer, primary_key=True, index=True)
    expo_name = Column(String(100), nullable=False)
    expo_year = Column(Integer, nullable=False)

    venue_id = Column(Integer, ForeignKey("venue.id"), nullable=False)

    start_date = Column(Date)
    end_date = Column(Date)

    expo_mgmt_id = Column(Integer, ForeignKey("expo_mgmt.id"), nullable=False)