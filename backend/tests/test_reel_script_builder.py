import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_reel_script_builder_authentication_requirement(client: AsyncClient):
    """
    Test 2: Verifies that unauthenticated requests to Reel Script Builder return 401 Unauthorized.
    """
    resp = await client.post(
        "/api/v1/tools/reel-scripts/generate",
        json={"topic": "Microcontrollers & Edge AI"}
    )
    assert resp.status_code == 401

    # Also test the alias route
    resp_alias = await client.post(
        "/api/v1/tools/reel-script-builder/generate",
        json={"topic": "Microcontrollers & Edge AI"}
    )
    assert resp_alias.status_code == 401


@pytest.mark.asyncio
async def test_reel_script_builder_validation(client: AsyncClient, auth_headers: dict):
    """
    Test 4: Verifies input validation rules:
    - Empty topic
    - Topic too short (< 3 chars)
    """
    # 1. Empty topic
    resp1 = await client.post(
        "/api/v1/tools/reel-scripts/generate",
        headers=auth_headers,
        json={"topic": "   "}
    )
    assert resp1.status_code in [400, 422]

    # 2. Too short topic
    resp2 = await client.post(
        "/api/v1/tools/reel-scripts/generate",
        headers=auth_headers,
        json={"topic": "ab"}
    )
    assert resp2.status_code in [400, 422]


@pytest.mark.asyncio
async def test_reel_script_builder_project_ownership(
    client: AsyncClient,
    auth_headers: dict,
    second_auth_headers: dict
):
    """
    Test 3: Verifies project ownership security:
    - 404 when project does not exist
    - 403 when project belongs to another authenticated user
    """
    # 1. Non-existent project
    resp_404 = await client.post(
        "/api/v1/tools/reel-scripts/generate",
        headers=auth_headers,
        json={
            "topic": "Autonomous Robotics",
            "project_id": "00000000-0000-0000-0000-000000000000"
        }
    )
    assert resp_404.status_code == 404

    # 2. Project owned by second user
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=second_auth_headers,
        json={"name": "Second User Project"}
    )
    second_user_proj_id = proj_resp.json()["id"]

    resp_403 = await client.post(
        "/api/v1/tools/reel-scripts/generate",
        headers=auth_headers,
        json={
            "topic": "Autonomous Robotics",
            "project_id": second_user_proj_id
        }
    )
    assert resp_403.status_code == 403


@pytest.mark.asyncio
async def test_reel_script_builder_execution_and_persistence(client: AsyncClient, auth_headers: dict):
    """
    Test 1, 5, 8: Valid request execution, structured output validation,
    and database persistence of AIGeneration, Project Asset, and UsageRecord.
    """
    # 1. Create a project
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={
            "name": "Hardware Reels Series",
            "description": "Short-form video scripts for maker engineering channels",
            "target_audience": "Makers and Embedded Engineers",
            "tone": "Engaging"
        }
    )
    project_id = proj_resp.json()["id"]

    # 2. Generate reel script
    gen_resp = await client.post(
        "/api/v1/tools/reel-scripts/generate",
        headers=auth_headers,
        json={
            "topic": "Building an autonomous IoT methane monitoring system using ESP32",
            "audience": "Hardware engineers and makers",
            "platform": "instagram",
            "tone": "engaging",
            "duration": "30-60",
            "content_goal": "educate",
            "project_id": project_id
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()

    # Verify response structure
    assert "generation_id" in data and data["generation_id"] is not None
    assert data["project_id"] == project_id
    assert "script" in data
    script = data["script"]

    # Verify 3-part script architecture
    assert "title" in script and len(script["title"]) > 0
    assert "hook" in script and len(script["hook"]) > 0
    assert "body" in script and len(script["body"]) > 0
    assert "cta" in script and len(script["cta"]) > 0
    assert "duration" in script
    assert "scenes" in script and len(script["scenes"]) >= 3

    # Verify scene details
    for scene in script["scenes"]:
        assert "scene_number" in scene
        assert "timestamp" in scene
        assert "dialogue" in scene and len(scene["dialogue"]) > 0
        assert "visual_direction" in scene and len(scene["visual_direction"]) > 0

    # 3. Verify Project Asset persisted
    assets_resp = await client.get(f"/api/v1/projects/{project_id}/assets", headers=auth_headers)
    assert assets_resp.status_code == 200
    assets = assets_resp.json()
    assert len(assets) == 1
    assert assets[0]["type"] == "reel_script"
    assert "Reel Script:" in assets[0]["title"]
    assert "Scene" in assets[0]["content"]

    # 4. Verify AIGeneration record persisted
    gens_resp = await client.get(f"/api/v1/projects/{project_id}/generations", headers=auth_headers)
    assert gens_resp.status_code == 200
    gens = gens_resp.json()
    assert len(gens) == 1
    assert gens[0]["tool"] == "reel-script-builder"
    assert gens[0]["provider"] == "gemini"
    assert gens[0]["status"] == "completed"

    # 5. Verify Usage tracking
    usage_resp = await client.get("/api/v1/usage", headers=auth_headers)
    assert usage_resp.status_code == 200
    usage_data = usage_resp.json()
    assert usage_data["total_generations"] >= 1


@pytest.mark.asyncio
async def test_reel_script_builder_cross_app_hook_handoff(client: AsyncClient, auth_headers: dict):
    """
    Test 10 & Cross-App Handoff: Verifies that passing a pre-existing hook (from Hook Generator)
    is accepted and preserved in metadata.
    """
    custom_hook = "Stop paying $500 for industrial gas monitors when a $15 ESP32 can detect leaks autonomously."

    gen_resp = await client.post(
        "/api/v1/tools/reel-scripts/generate",
        headers=auth_headers,
        json={
            "topic": "Autonomous IoT Methane Monitoring System using ESP32",
            "hook": custom_hook,
            "platform": "youtube_shorts",
            "tone": "contrarian",
            "duration": "30-60"
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    assert data["metadata"]["hook_preserved"] is True
    assert data["script"]["hook"] is not None


@pytest.mark.asyncio
async def test_reel_script_builder_grounding(client: AsyncClient, auth_headers: dict):
    """
    Test 6: Verifies grounding validation prevents off-topic drift.
    """
    gen_resp = await client.post(
        "/api/v1/tools/reel-scripts/generate",
        headers=auth_headers,
        json={
            "topic": "Autonomous IoT Methane Monitoring System using ESP32",
            "platform": "tiktok",
            "tone": "engaging",
            "duration": "30-60"
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    assert data["metadata"]["is_grounded"] is True


@pytest.mark.asyncio
async def test_reel_script_builder_registry_status(client: AsyncClient, auth_headers: dict):
    """
    Test 9: Verifies that reel-script-builder is registered and active in the central registry.
    """
    resp = await client.get("/api/v1/registry/applications", headers=auth_headers)
    assert resp.status_code == 200
    tools = resp.json()
    reel_tool = next((t for t in tools if t["id"] == "reel-script-builder"), None)
    assert reel_tool is not None, "reel-script-builder not found in registry"
    assert reel_tool["status"] == "active"
    assert reel_tool["route"] == "/tools/reel-script-builder"


@pytest.mark.asyncio
async def test_reel_script_builder_alias_route(client: AsyncClient, auth_headers: dict):
    """
    Verifies that the alias route /api/v1/tools/reel-script-builder/generate behaves identically.
    """
    gen_resp = await client.post(
        "/api/v1/tools/reel-script-builder/generate",
        headers=auth_headers,
        json={
            "topic": "Autonomous IoT Methane Monitoring System using ESP32",
            "platform": "instagram",
            "tone": "educational",
            "duration": "30-60"
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    assert "generation_id" in data
    assert data["script"]["title"] is not None
