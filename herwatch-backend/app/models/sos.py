from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class SOSAlert(Base):
    __tablename__ = "sos_alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(20), default="ACTIVE", nullable=False) # ACTIVE, RESOLVED, CANCELLED
    initial_latitude = Column(Float, nullable=True)
    initial_longitude = Column(Float, nullable=True)
    battery_level = Column(Integer, nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    location_logs = relationship("SOSLocationLog", back_populates="alert", cascade="all, delete-orphan")

class SOSLocationLog(Base):
    __tablename__ = "sos_location_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sos_id = Column(Integer, ForeignKey("sos_alerts.id", ondelete="CASCADE"), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=True)
    speed = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    alert = relationship("SOSAlert", back_populates="location_logs")
