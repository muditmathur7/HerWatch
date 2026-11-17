from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List, Dict, Optional
from app.core.database import get_db
from app.models.user import User
from app.models.contact import EmergencyContact
from app.models.sos import SOSAlert, SOSLocationLog
from app.schemas.sos import (
    SOSTriggerRequest,
    SOSLocationPing,
    SOSResolveRequest,
    SOSResponse,
    SOSTrackingDetail,
    LocationLogResponse
)
from app.api.deps import get_current_user
from app.core.security import verify_pin

router = APIRouter(prefix="/sos", tags=["Emergency SOS & Live Tracking"])

# In-memory WebSocket connection manager for live tracking streams
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, sos_id: int, websocket: WebSocket):
        await websocket.accept()
        if sos_id not in self.active_connections:
            self.active_connections[sos_id] = []
        self.active_connections[sos_id].append(websocket)

    def disconnect(self, sos_id: int, websocket: WebSocket):
        if sos_id in self.active_connections:
            if websocket in self.active_connections[sos_id]:
                self.active_connections[sos_id].remove(websocket)
            if not self.active_connections[sos_id]:
                del self.active_connections[sos_id]

    async def broadcast_location(self, sos_id: int, data: dict):
        if sos_id in self.active_connections:
            for connection in self.active_connections[sos_id]:
                try:
                    await connection.send_json(data)
                except Exception:
                    pass

ws_manager = ConnectionManager()

def build_sos_response(alert: SOSAlert, user: User, contacts_count: int) -> SOSResponse:
    return SOSResponse(
        id=alert.id,
        user_id=alert.user_id,
        user_name=user.full_name if user else "Unknown User",
        user_phone=user.phone if user else "",
        status=alert.status,
        initial_latitude=alert.initial_latitude,
        initial_longitude=alert.initial_longitude,
        battery_level=alert.battery_level,
        started_at=alert.started_at,
        resolved_at=alert.resolved_at,
        notified_contacts_count=contacts_count,
        tracking_url=f"/track/{alert.id}"
    )

@router.post("/trigger", response_model=SOSResponse, status_code=status.HTTP_201_CREATED)
def trigger_sos(
    req: SOSTriggerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if there is already an active SOS for this user
    existing_alert = db.query(SOSAlert).filter(
        SOSAlert.user_id == current_user.id,
        SOSAlert.status == "ACTIVE"
    ).first()

    if existing_alert:
        contacts_count = db.query(EmergencyContact).filter(EmergencyContact.user_id == current_user.id).count()
        return build_sos_response(existing_alert, current_user, contacts_count)

    # Create new SOS alert
    alert = SOSAlert(
        user_id=current_user.id,
        status="ACTIVE",
        initial_latitude=req.latitude,
        initial_longitude=req.longitude,
        battery_level=req.battery_level,
        started_at=datetime.now(timezone.utc)
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    # Log initial location if provided
    if req.latitude is not None and req.longitude is not None:
        log = SOSLocationLog(
            sos_id=alert.id,
            latitude=req.latitude,
            longitude=req.longitude,
            timestamp=datetime.now(timezone.utc)
        )
        db.add(log)
        db.commit()

    contacts = db.query(EmergencyContact).filter(EmergencyContact.user_id == current_user.id).all()
    contacts_count = len(contacts)

    # In production, dispatch SMS / WhatsApp / Push notification via Twilio/Fast2SMS
    print(f"🚨 SOS DISPATCH: User {current_user.full_name} triggered emergency alert!")
    for c in contacts:
        print(f"   -> Alert dispatched to {c.name} ({c.phone}) with live link /track/{alert.id}")

    return build_sos_response(alert, current_user, contacts_count)

@router.get("/active", response_model=Optional[SOSResponse])
def get_active_sos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(SOSAlert).filter(
        SOSAlert.user_id == current_user.id,
        SOSAlert.status == "ACTIVE"
    ).first()

    if not alert:
        return None

    contacts_count = db.query(EmergencyContact).filter(EmergencyContact.user_id == current_user.id).count()
    return build_sos_response(alert, current_user, contacts_count)

@router.post("/{sos_id}/location")
async def ping_location(
    sos_id: int,
    ping: SOSLocationPing,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(SOSAlert).filter(
        SOSAlert.id == sos_id,
        SOSAlert.user_id == current_user.id,
        SOSAlert.status == "ACTIVE"
    ).first()

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active SOS alert not found."
        )

    log = SOSLocationLog(
        sos_id=alert.id,
        latitude=ping.latitude,
        longitude=ping.longitude,
        accuracy=ping.accuracy,
        speed=ping.speed,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    # Broadcast to live watchers via WebSocket
    payload = {
        "event": "location_update",
        "sos_id": alert.id,
        "latitude": ping.latitude,
        "longitude": ping.longitude,
        "accuracy": ping.accuracy,
        "speed": ping.speed,
        "timestamp": log.timestamp.isoformat()
    }
    await ws_manager.broadcast_location(alert.id, payload)

    return {"message": "Location updated successfully.", "id": log.id}

@router.post("/{sos_id}/resolve", response_model=SOSResponse)
async def resolve_sos(
    sos_id: int,
    req: Optional[SOSResolveRequest] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(SOSAlert).filter(
        SOSAlert.id == sos_id,
        SOSAlert.user_id == current_user.id
    ).first()

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOS alert not found."
        )

    # If PIN is provided, verify it
    if req and req.pin:
        if not verify_pin(req.pin, current_user.pin_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect security PIN."
            )

    alert.status = "RESOLVED"
    alert.resolved_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(alert)

    # Broadcast resolution event
    await ws_manager.broadcast_location(alert.id, {
        "event": "sos_resolved",
        "sos_id": alert.id,
        "status": "RESOLVED"
    })

    contacts_count = db.query(EmergencyContact).filter(EmergencyContact.user_id == current_user.id).count()
    return build_sos_response(alert, current_user, contacts_count)

@router.get("/{sos_id}/track", response_model=SOSTrackingDetail)
def track_sos(sos_id: int, db: Session = Depends(get_db)):
    alert = db.query(SOSAlert).filter(SOSAlert.id == sos_id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency alert not found."
        )

    user = db.query(User).filter(User.id == alert.user_id).first()
    contacts_count = db.query(EmergencyContact).filter(EmergencyContact.user_id == alert.user_id).count()

    recent_logs = db.query(SOSLocationLog).filter(
        SOSLocationLog.sos_id == alert.id
    ).order_by(SOSLocationLog.timestamp.desc()).limit(100).all()

    return SOSTrackingDetail(
        alert=build_sos_response(alert, user, contacts_count),
        recent_locations=[LocationLogResponse.model_validate(l) for l in recent_logs]
    )

@router.websocket("/{sos_id}/ws")
async def websocket_tracking(websocket: WebSocket, sos_id: int):
    await ws_manager.connect(sos_id, websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(sos_id, websocket)
