import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_project_crud_and_ownership(client: AsyncClient, auth_headers: dict, second_auth_headers: dict):
    # 1. Create Project for User A
    create_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={
            "name": "AI Automation 2026",
            "description": "YouTube & LinkedIn content strategy",
            "target_audience": "Software Engineers",
            "tone": "Educational",
            "primary_goal": "Growth"
        }
    )
    assert create_resp.status_code == 201
    project = create_resp.json()
    project_id = project["id"]
    assert project["name"] == "AI Automation 2026"
    assert project["target_audience"] == "Software Engineers"

    # 2. List Projects for User A
    list_resp = await client.get("/api/v1/projects", headers=auth_headers)
    assert list_resp.status_code == 200
    projects = list_resp.json()
    assert len(projects) >= 1
    assert any(p["id"] == project_id for p in projects)

    # 3. Retrieve Project Detail for User A
    get_resp = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == project_id
    assert "assets_count" in get_resp.json()

    # 4. Security Check: User B CANNOT access User A's Project (403 Forbidden)
    forbidden_resp = await client.get(f"/api/v1/projects/{project_id}", headers=second_auth_headers)
    assert forbidden_resp.status_code == 403
    assert "access" in forbidden_resp.json()["error"]["message"].lower()

    # 5. Update Project
    update_resp = await client.patch(
        f"/api/v1/projects/{project_id}",
        headers=auth_headers,
        json={"name": "AI Automation Masters 2026"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["name"] == "AI Automation Masters 2026"

    # 6. Delete Project
    del_resp = await client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert del_resp.status_code == 204

    # 7. Verify deletion
    verify_resp = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert verify_resp.status_code == 404
