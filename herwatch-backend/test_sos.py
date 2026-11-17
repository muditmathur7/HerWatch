from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_sos_lifecycle():
    # 1. Login user
    res = client.post("/api/v1/auth/login", json={
        "email": "pranati@example.com",
        "password": "newsecurepassword456"
    })
    assert res.status_code == 200, res.text
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Trigger SOS
    trigger_payload = {
        "latitude": 28.5355,
        "longitude": 77.3910,
        "batteryLevel": 85
    }
    res = client.post("/api/v1/sos/trigger", json=trigger_payload, headers=headers)
    assert res.status_code == 201, res.text
    sos_data = res.json()
    assert sos_data["status"] == "ACTIVE"
    sos_id = sos_data["id"]
    print(f"✓ SOS Alert triggered with ID: {sos_id}")

    # 3. Check Active SOS
    res = client.get("/api/v1/sos/active", headers=headers)
    assert res.status_code == 200, res.text
    assert res.json()["id"] == sos_id
    print("✓ Active SOS status confirmed")

    # 4. Ping new GPS coordinates
    ping_payload = {
        "latitude": 28.5360,
        "longitude": 77.3915,
        "accuracy": 5.2,
        "speed": 1.2
    }
    res = client.post(f"/api/v1/sos/{sos_id}/location", json=ping_payload, headers=headers)
    assert res.status_code == 200, res.text
    print("✓ Live GPS breadcrumb coordinate logged")

    # 5. Public track endpoint (for emergency contacts / authorities)
    res = client.get(f"/api/v1/sos/{sos_id}/track")
    assert res.status_code == 200, res.text
    track_detail = res.json()
    assert len(track_detail["recentLocations"]) >= 2
    print(f"✓ Tracking link verified with {len(track_detail['recentLocations'])} location logs")

    # 6. Resolve SOS using user's PIN
    resolve_payload = {"pin": "1234"}
    res = client.post(f"/api/v1/sos/{sos_id}/resolve", json=resolve_payload, headers=headers)
    assert res.status_code == 200, res.text
    assert res.json()["status"] == "RESOLVED"
    print("✓ SOS Alert disarmed and resolved with security PIN")

    # 7. Check Active SOS is now None
    res = client.get("/api/v1/sos/active", headers=headers)
    assert res.status_code == 200
    assert res.json() is None
    print("✓ Active SOS cleared")

if __name__ == "__main__":
    test_sos_lifecycle()
    print("\nALL SOS LIFECYCLE TESTS PASSED PERFECTLY!")
