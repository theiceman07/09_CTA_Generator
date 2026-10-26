import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_caption_assistant_authentication_requirement(client: AsyncClient):
    """
    Test 1: Verifies that unauthenticated requests to Caption Assistant return 401 Unauthorized.
    """
    resp = await client.post(
        "/api/v1/tools/captions/generate",
        json={"topic": "Edge AI Microcontrollers"}
    )
    assert resp.status_code == 401

    # Also test the alias route
    resp_alias = await client.post(
        "/api/v1/tools/caption-assistant/generate",
        json={"topic": "Edge AI Microcontrollers"}
    )
    assert resp_alias.status_code == 401


@pytest.mark.asyncio
async def test_caption_assistant_validation(client: AsyncClient, auth_headers: dict):
    """
    Test 2: Verifies input validation rules:
    - Empty topic
    - Topic too short (< 3 chars)
    - Whitespace only topic
    """
    # 1. Whitespace topic
    resp1 = await client.post(
        "/api/v1/tools/captions/generate",
        headers=auth_headers,
        json={"topic": "   "}
    )
    assert resp1.status_code in [400, 422]

    # 2. Too short topic
    resp2 = await client.post(
        "/api/v1/tools/captions/generate",
        headers=auth_headers,
        json={"topic": "ab"}
    )
    assert resp2.status_code in [400, 422]


@pytest.mark.asyncio
async def test_caption_assistant_project_ownership(
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
        "/api/v1/tools/captions/generate",
        headers=auth_headers,
        json={
            "topic": "Autonomous Robotics Telemetry",
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
        "/api/v1/tools/captions/generate",
        headers=auth_headers,
        json={
            "topic": "Autonomous Robotics Telemetry",
            "project_id": second_user_proj_id
        }
    )
    assert resp_403.status_code == 403


@pytest.mark.asyncio
async def test_caption_assistant_execution_and_persistence(client: AsyncClient, auth_headers: dict):
    """
    Test 4: Valid request execution, structured output validation,
    and database persistence of AIGeneration, Project Asset, and UsageRecord.
    """
    # 1. Create a project
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={
            "name": "Social Tech Captions",
            "description": "Platform-optimized captions for maker engineering channels",
            "target_audience": "Makers and Embedded Engineers",
            "tone": "Engaging"
        }
    )
    project_id = proj_resp.json()["id"]

    # 2. Generate caption
    gen_resp = await client.post(
        "/api/v1/tools/captions/generate",
        headers=auth_headers,
        json={
            "topic": "Building an autonomous IoT methane monitoring system using ESP32",
            "target_audience": "Hardware engineers and makers",
            "platform": "Instagram",
            "tone": "Engaging",
            "content_goal": "Saves",
            "caption_length": "Medium",
            "include_hashtags": True,
            "hashtag_count": 5,
            "include_emojis": True,
            "include_seo_keywords": True,
            "format_type": "Photo post",
            "project_id": project_id
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()

    # 3. Assert envelope structure
    assert "generation_id" in data
    assert data["project_id"] == project_id
    assert "caption" in data
    caption_data = data["caption"]

    # 4. Assert structured CaptionOutput
    assert caption_data["caption"]
    assert caption_data["hook"]
    assert caption_data["body"]
    assert caption_data["call_to_action"]
    assert isinstance(caption_data["hashtags"], list)
    assert len(caption_data["hashtags"]) >= 1
    assert caption_data["platform"] == "Instagram"
    assert caption_data["character_count"] > 0
    assert len(caption_data["variants"]) >= 2
    assert all("reach_score" in v for v in caption_data["variants"])
    assert caption_data["recommend_reason"]

    # 5. Assert usage and metadata
    assert "usage" in data
    assert "latency_ms" in data["usage"]
    assert data["metadata"]["topic"]
    assert data["metadata"]["variant_count"] >= 2

    # 6. Verify Asset was created in database
    assets_resp = await client.get(
        f"/api/v1/projects/{project_id}/assets",
        headers=auth_headers
    )
    assert assets_resp.status_code == 200
    assets = assets_resp.json()
    caption_asset = next((a for a in assets if a["type"] == "caption"), None)
    assert caption_asset is not None
    assert "Caption:" in caption_asset["title"]
    assert caption_asset["meta_info"]["tool"] == "caption-assistant"

    # 7. Verify Generation was logged
    gens_resp = await client.get(
        f"/api/v1/projects/{project_id}/generations",
        headers=auth_headers
    )
    assert gens_resp.status_code == 200
    gens = gens_resp.json()
    cap_gen = next((g for g in gens if g["tool"] == "caption-assistant"), None)
    assert cap_gen is not None
    assert cap_gen["id"] == data["generation_id"]

    # 8. Verify Usage was tracked
    usage_resp = await client.get(
        "/api/v1/usage",
        headers=auth_headers
    )
    assert usage_resp.status_code == 200
    usage_data = usage_resp.json()
    assert usage_data["total_generations"] >= 1


@pytest.mark.asyncio
async def test_caption_assistant_alias_route(client: AsyncClient, auth_headers: dict):
    """
    Test 5: Verifies that the compatibility alias route works seamlessly.
    """
    resp = await client.post(
        "/api/v1/tools/caption-assistant/generate",
        headers=auth_headers,
        json={
            "topic": "Raspberry Pi Local Home Automation Edge Gateway",
            "platform": "LinkedIn",
            "tone": "Professional"
        }
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["platform"] == "LinkedIn"
    assert data["caption"]["caption"]


@pytest.mark.asyncio
async def test_caption_assistant_hook_handoff_preservation(client: AsyncClient, auth_headers: dict):
    """
    Test 6: Verifies cross-application handoff: if upstream hook is supplied,
    the metadata records hook_preserved = True.
    """
    hook_input = "Why 90% of industrial IoT deployments fail at the hardware layer."
    resp = await client.post(
        "/api/v1/tools/captions/generate",
        headers=auth_headers,
        json={
            "topic": "Industrial IoT Deployment Architecture",
            "hook": hook_input,
            "platform": "Instagram"
        }
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["metadata"]["hook_preserved"] is True


@pytest.mark.asyncio
async def test_caption_assistant_grounding_and_relevance(client: AsyncClient, auth_headers: dict):
    """
    Test 7: Verifies that the generated captions remain strictly grounded in the topic.
    """
    topic = "Autonomous Drone Pathfinding using LiDAR and ROS2"
    resp = await client.post(
        "/api/v1/tools/captions/generate",
        headers=auth_headers,
        json={
            "topic": topic,
            "platform": "Instagram"
        }
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["metadata"]["is_grounded"] is True


@pytest.mark.asyncio
async def test_caption_assistant_registry_active(client: AsyncClient):
    """
    Test 8: Verifies that Caption Assistant is listed as 'active' in the SaaS capability registry.
    """
    resp = await client.get("/api/v1/registry/applications")
    assert resp.status_code == 200
    apps = resp.json()
    cap_app = next((a for a in apps if a["id"] == "caption-assistant"), None)
    assert cap_app is not None
    assert cap_app["status"] == "active"
    assert cap_app["route"] == "/tools/caption-assistant"
