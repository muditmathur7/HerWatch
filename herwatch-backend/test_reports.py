from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_reports():
    # 1. Post report
    report_data = {
        "incidentType": "Harassment",
        "locationName": "Central Metro Station Gate 2",
        "description": "Group of individuals making inappropriate comments near unlit exit.",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "severity": "High"
    }
    res = client.post("/api/v1/reports", json=report_data)
    assert res.status_code == 201, res.text
    created = res.json()
    assert created["incidentType"] == "Harassment"
    print("✓ Incident report submitted successfully")

    # 2. Get reports
    res = client.get("/api/v1/reports")
    assert res.status_code == 200, res.text
    reports = res.json()
    assert len(reports) >= 1
    print(f"✓ Retrieved {len(reports)} incident reports")

    # 3. Get hotspots
    res = client.get("/api/v1/reports/hotspots")
    assert res.status_code == 200, res.text
    hotspots = res.json()
    assert len(hotspots) >= 1
    print(f"✓ Hotspots aggregated: {len(hotspots)} danger zones identified")

if __name__ == "__main__":
    test_reports()
    print("\nALL REPORTS TESTS PASSED PERFECTLY!")
