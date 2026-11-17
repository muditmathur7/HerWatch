from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_safe_routes():
    payload = {
        "originLat": 28.6139,
        "originLng": 77.2090,
        "destinationLat": 28.6300,
        "destinationLng": 77.2200,
        "destinationName": "Connaught Place Central"
    }
    res = client.post("/api/v1/routes/safe-route", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    assert "safestRoute" in data
    assert "fastestRoute" in data
    safest = data["safestRoute"]
    fastest = data["fastestRoute"]

    print(f"✓ Safest Route: {safest['distanceKm']} km, {safest['durationMins']} mins, Safety: {safest['safetyScore']}%")
    print(f"✓ Fastest Route: {fastest['distanceKm']} km, {fastest['durationMins']} mins, Safety: {fastest['safetyScore']}%, Risk: {fastest['riskLevel']}")
    assert safest["safetyScore"] > fastest["safetyScore"]
    print("✓ Safe route has significantly higher safety rating than direct route")

if __name__ == "__main__":
    test_safe_routes()
    print("\nALL SAFE ROUTE TESTS PASSED PERFECTLY!")
