from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SOSTriggerRequest(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    battery_level: Optional[int] = Field(None, alias="batteryLevel")

    class Config:
        populate_by_name = True

class SOSLocationPing(BaseModel):
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    speed: Optional[float] = None

class SOSResolveRequest(BaseModel):
    pin: Optional[str] = None # Optional safety PIN to disarm

class LocationLogResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    speed: Optional[float] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class SOSResponse(BaseModel):
    id: int
    user_id: int = Field(..., alias="userId")
    user_name: Optional[str] = Field(None, alias="userName")
    user_phone: Optional[str] = Field(None, alias="userPhone")
    status: str
    initial_latitude: Optional[float] = Field(None, alias="initialLatitude")
    initial_longitude: Optional[float] = Field(None, alias="initialLongitude")
    battery_level: Optional[int] = Field(None, alias="batteryLevel")
    started_at: datetime = Field(..., alias="startedAt")
    resolved_at: Optional[datetime] = Field(None, alias="resolvedAt")
    notified_contacts_count: int = Field(0, alias="notifiedContactsCount")
    tracking_url: Optional[str] = Field(None, alias="trackingUrl")

    class Config:
        from_attributes = True
        populate_by_name = True

class SOSTrackingDetail(BaseModel):
    alert: SOSResponse
    recent_locations: List[LocationLogResponse] = Field([], alias="recentLocations")

    class Config:
        populate_by_name = True
