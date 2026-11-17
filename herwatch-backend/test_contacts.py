from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_contacts_crud():
    # 1. Login user
    res = client.post("/api/v1/auth/login", json={
        "email": "pranati@example.com",
        "password": "newsecurepassword456"
    })
    assert res.status_code == 200, res.text
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Add contact
    contact_data = {
        "name": "Mom",
        "phone": "9811122233",
        "email": "mom@example.com",
        "relationship": "Mother",
        "isPrimary": True
    }
    res = client.post("/api/v1/contacts", json=contact_data, headers=headers)
    assert res.status_code == 201, res.text
    created = res.json()
    assert created["name"] == "Mom"
    contact_id = created["id"]
    print("✓ Emergency contact added successfully")

    # 3. Get contacts
    res = client.get("/api/v1/contacts", headers=headers)
    assert res.status_code == 200, res.text
    contacts = res.json()
    assert len(contacts) >= 1
    print(f"✓ Retrieved {len(contacts)} contacts")

    # 4. Update contact
    res = client.put(f"/api/v1/contacts/{contact_id}", json={"phone": "9999988888"}, headers=headers)
    assert res.status_code == 200, res.text
    assert res.json()["phone"] == "9999988888"
    print("✓ Contact updated successfully")

    # 5. Delete contact
    res = client.delete(f"/api/v1/contacts/{contact_id}", headers=headers)
    assert res.status_code == 200, res.text
    print("✓ Contact deleted successfully")

if __name__ == "__main__":
    test_contacts_crud()
    print("\nALL CONTACTS TESTS PASSED PERFECTLY!")
