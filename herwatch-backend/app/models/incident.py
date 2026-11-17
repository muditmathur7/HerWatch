from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    incident_type = Column(String(50), nullable=False)
    location_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    severity = Column(String(20), default="Medium", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
