from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from collections import defaultdict
from app.core.database import get_db
from app.models.user import User
from app.models.incident import IncidentReport
from app.schemas.incident import IncidentCreate, IncidentResponse, HotspotZone
from app.api.deps import oauth2_scheme
from app.core.security import decode_access_token

router = APIRouter(prefix="/reports", tags=["Incident Reports & Hotspots"])

def get_optional_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    return db.query(User).filter(User.id == int(user_id)).first()

@router.get("", response_model=List[IncidentResponse])
def get_reports(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    reports = db.query(IncidentReport).order_by(IncidentReport.created_at.desc()).limit(limit).all()
    return reports

@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def submit_report(
    report_in: IncidentCreate,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    report = IncidentReport(
        user_id=current_user.id if current_user else None,
        incident_type=report_in.incident_type,
        location_name=report_in.location_name,
        description=report_in.description,
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        severity=report_in.severity or "Medium"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/hotspots", response_model=List[HotspotZone])
def get_hotspots(db: Session = Depends(get_db)):
    reports = db.query(IncidentReport).filter(
        IncidentReport.latitude.isnot(None),
        IncidentReport.longitude.isnot(None)
    ).all()

    # Simple spatial clustering (rounds to ~1km grid ~0.01 deg)
    clusters = defaultdict(list)
    for r in reports:
        key = (round(r.latitude, 2), round(r.longitude, 2))
        clusters[key].append(r)

    hotspots: List[HotspotZone] = []
    for (lat, lng), group in clusters.items():
        count = len(group)
        types = list(set([r.incident_type for r in group]))
        location = group[0].location_name

        if count >= 5:
            risk = "High"
        elif count >= 2:
            risk = "Medium"
        else:
            risk = "Low"

        hotspots.append(HotspotZone(
            latitude=lat,
            longitude=lng,
            location_name=location,
            incident_count=count,
            risk_level=risk,
            types=types
        ))

    return hotspots
