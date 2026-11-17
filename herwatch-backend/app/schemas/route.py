from pydantic import BaseModel, Field
from typing import List, Optional

class RouteRequest(BaseModel):
    origin_lat: float = Field(..., alias="originLat")
    origin_lng: float = Field(..., alias="originLng")
    destination_lat: float = Field(..., alias="destinationLat")
    destination_lng: float = Field(..., alias="destinationLng")
    destination_name: Optional[str] = Field("Destination", alias="destinationName")

    class Config:
        populate_by_name = True

class RouteStep(BaseModel):
    instruction: str
    distance_meters: int = Field(..., alias="distanceMeters")
    is_safe_corridor: bool = Field(True, alias="isSafeCorridor")
    note: Optional[str] = None

    class Config:
        populate_by_name = True

class RouteOption(BaseModel):
    route_type: str = Field(..., alias="routeType") # "SAFEST" | "FASTEST"
    name: str
    coordinates: List[List[float]] # [[lat, lng], ...]
    distance_km: float = Field(..., alias="distanceKm")
    duration_mins: int = Field(..., alias="durationMins")
    safety_score: int = Field(..., alias="safetyScore") # 0-100%
    risk_level: str = Field(..., alias="riskLevel") # "Low", "Medium", "High"
    hotspots_encountered: int = Field(0, alias="hotspotsEncountered")
    safe_havens_along_route: int = Field(0, alias="safeHavensAlongRoute")
    steps: List[RouteStep]

    class Config:
        populate_by_name = True

class SafeHaven(BaseModel):
    name: str
    type: str # "Police Station" | "Hospital" | "Metro Station"
    latitude: float
    longitude: float

class SafeRouteResponse(BaseModel):
    safest_route: RouteOption = Field(..., alias="safestRoute")
    fastest_route: RouteOption = Field(..., alias="fastestRoute")
    hotspots: List[dict]
    safe_havens: List[SafeHaven] = Field(..., alias="safeHavens")

    class Config:
        populate_by_name = True
