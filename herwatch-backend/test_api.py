from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_auth_flow():
    # 1. Health check
    res = client.get("/health")
    assert res.status_code == 200, res.text
    print("✓ Health check passed")

    # 2. Register user
    signup_payload = {
        "firstName": "Pranati",
        "lastName": "Sharma",
        "email": "pranati@example.com",
        "phone": "9876543210",
        "age": 22,
        "gender": "Female",
        "username": "pranati22",
        "password": "securepassword123",
        "pin": "1234"
    }
    res = client.post("/api/v1/auth/register", json=signup_payload)
    assert res.status_code == 201, f"Register failed: {res.text}"
    data = res.json()
    token = data["access_token"]
    assert token is not None
    assert data["user"]["email"] == "pranati@example.com"
    print("✓ User registered and received JWT token")

    # 3. Login
    login_payload = {
        "email": "pranati@example.com",
        "password": "securepassword123"
    }
    res = client.post("/api/v1/auth/login", json=login_payload)
    assert res.status_code == 200, f"Login failed: {res.text}"
    login_data = res.json()
    new_token = login_data["access_token"]
    print("✓ User login succeeded")

    # 4. Access protected /me endpoint
    headers = {"Authorization": f"Bearer {new_token}"}
    res = client.get("/api/v1/auth/me", headers=headers)
    assert res.status_code == 200, f"Get /me failed: {res.text}"
    user_data = res.json()
    assert user_data["username"] == "pranati22"
    print("✓ Protected endpoint /me returned correct user profile")

    # 5. Change password
    change_pass_payload = {
        "currentPassword": "securepassword123",
        "newPassword": "newsecurepassword456"
    }
    res = client.post("/api/v1/auth/change-password", json=change_pass_payload, headers=headers)
    assert res.status_code == 200, f"Change password failed: {res.text}"
    print("✓ Password successfully changed")

    # 6. Verify login with new password
    login_payload["password"] = "newsecurepassword456"
    res = client.post("/api/v1/auth/login", json=login_payload)
    assert res.status_code == 200, f"Login with new password failed: {res.text}"
    print("✓ Logged in with new password successfully")

if __name__ == "__main__":
    test_full_auth_flow()
    print("\nALL AUTH TESTS PASSED PERFECTLY!")
