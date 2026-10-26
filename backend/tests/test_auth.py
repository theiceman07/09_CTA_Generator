import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_auth_register_and_login(client: AsyncClient):
    # 1. Register new user
    reg_resp = await client.post("/api/v1/auth/register", json={
        "email": "sarah@creator.io",
        "password": "StrongPassword99!",
        "name": "Sarah Connor"
    })
    assert reg_resp.status_code == 200
    reg_data = reg_resp.json()
    assert "token" in reg_data
    assert "access_token" in reg_data
    assert reg_data["token"] == reg_data["access_token"]
    assert reg_data["user"]["email"] == "sarah@creator.io"
    assert reg_data["user"]["full_name"] == "Sarah Connor"
    assert reg_data["user"]["name"] == "Sarah Connor"

    # 2. Prevent duplicate registration
    dup_resp = await client.post("/api/v1/auth/register", json={
        "email": "sarah@creator.io",
        "password": "OtherPassword123!",
        "name": "Sarah Connor"
    })
    assert dup_resp.status_code == 400

    # 3. Login
    login_resp = await client.post("/api/v1/auth/login", json={
        "email": "sarah@creator.io",
        "password": "StrongPassword99!"
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    # 4. Get Current User (/me)
    me_resp = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "sarah@creator.io"

@pytest.mark.asyncio
async def test_auth_invalid_credentials(client: AsyncClient):
    resp = await client.post("/api/v1/auth/login", json={
        "email": "nonexistent@creator.io",
        "password": "WrongPassword"
    })
    assert resp.status_code == 401

@pytest.mark.asyncio
async def test_complete_auth_regression_flow(client: AsyncClient):
    """
    Regression Test:
    1. User A registers.
    2. User A logs in.
    3. Returned JWT can authenticate.
    4. GET /api/v1/auth/me succeeds.
    5. Authenticated project creation succeeds.
    6. Authenticated project listing succeeds.
    7. Unauthenticated request returns 401 (including Bearer undefined).
    8. User B cannot access User A's project.
    """
    # 1. User A registers
    reg_a = await client.post("/api/v1/auth/register", json={
        "email": "user_a@creator.io",
        "password": "SecurePasswordA1!",
        "name": "User Alpha"
    })
    assert reg_a.status_code == 200
    assert "access_token" in reg_a.json()
    assert "token" in reg_a.json()

    # 2. User A logs in
    login_a = await client.post("/api/v1/auth/login", json={
        "email": "user_a@creator.io",
        "password": "SecurePasswordA1!"
    })
    assert login_a.status_code == 200
    token_a = login_a.json()["access_token"]
    assert token_a is not None and len(token_a) > 20

    # 3 & 4. Authenticate & GET /auth/me
    me_a = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token_a}"})
    assert me_a.status_code == 200
    assert me_a.json()["email"] == "user_a@creator.io"

    # 5. Authenticated project creation
    proj_resp = await client.post(
        "/api/v1/projects",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"name": "Alpha Project", "description": "Private project of User Alpha"}
    )
    assert proj_resp.status_code == 201
    proj_id = proj_resp.json()["id"]

    # 6. Authenticated project listing
    list_resp = await client.get("/api/v1/projects", headers={"Authorization": f"Bearer {token_a}"})
    assert list_resp.status_code == 200
    projs = list_resp.json()
    assert any(p["id"] == proj_id for p in projs)

    # 7. Unauthenticated requests return 401
    unauth_resp1 = await client.get("/api/v1/projects")
    assert unauth_resp1.status_code == 401

    unauth_resp2 = await client.get("/api/v1/projects", headers={"Authorization": "Bearer undefined"})
    assert unauth_resp2.status_code == 401

    # 8. User B cannot access User A's project
    reg_b = await client.post("/api/v1/auth/register", json={
        "email": "user_b@creator.io",
        "password": "SecurePasswordB2!",
        "name": "User Beta"
    })
    assert reg_b.status_code == 200
    token_b = reg_b.json()["access_token"]

    user_b_access = await client.get(
        f"/api/v1/projects/{proj_id}",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    # Must be 403 or 404 so User B cannot access User A's project
    assert user_b_access.status_code in (403, 404)
