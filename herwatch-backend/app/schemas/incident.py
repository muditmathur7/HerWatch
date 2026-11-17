from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class IncidentCreate(BaseModel):
    incident_type: str = Field(..., alias="incidentType")
    location_name: str = Field(..., alias="locationName")
    description: str = Field(..., min_length=5)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity: Optional[str] = "Medium"

    class Config:
        populate_by_name = True

class IncidentResponse(BaseModel):
    id: int
    user_id: Optional[int] = Field(None, alias="userId")
    incident_type: str = Field(..., alias="incidentType")
    location_name: str = Field(..., alias="locationName")
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity: str
    created_at: datetime = Field(..., alias="createdAt")

    class Config:
        from_attributes = True
        populate_by_name = True

class HotspotZone(BaseModel):
    latitude: float
    longitude: float
    location_name: str = Field(..., alias="locationName")
    incident_count: int = Field(..., alias="incidentCount")
    risk_level: str = Field(..., alias="riskLevel")
    types: List[str]

    class Config:
        populate_by_name = True
