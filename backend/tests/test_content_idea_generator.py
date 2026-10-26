import pytest
from httpx import AsyncClient
from app.core.config import settings
from app.ai.gemini.service import gemini_service

@pytest.mark.asyncio
async def test_content_idea_generator_authentication_requirement(client: AsyncClient):
    """
    Test 2: Verifies that unauthenticated requests to the endpoint return 401 Unauthorized.
    """
    resp = await client.post(
        "/api/v1/tools/content-ideas/generate",
        json={"topic": "AI SaaS Architecture"}
    )
    assert resp.status_code == 401

    # Also test the alias route
    resp_alias = await client.post(
        "/api/v1/tools/content-idea-generator/generate",
        json={"topic": "AI SaaS Architecture"}
    )
    assert resp_alias.status_code == 401


@pytest.mark.asyncio
async def test_content_idea_generator_validation(client: AsyncClient, auth_headers: dict):
    """
    Test 4: Verifies input validation rules:
    - Empty or whitespace topic
    - Invalid tone
    - Invalid platform
    - Number of ideas out of bounds
    """
    # 1. Empty topic
    resp1 = await client.post(
        "/api/v1/tools/content-ideas/generate",
        headers=auth_headers,
        json={"topic": "   "}
    )
    assert resp1.status_code in [400, 422]

    # 2. Invalid tone
    resp2 = await client.post(
        "/api/v1/tools/content-ideas/generate",
        headers=auth_headers,
        json={"topic": "Robotics with ROS2", "tone": "invalid_tone_123"}
    )
    assert resp2.status_code in [400, 422]

    # 3. Invalid platform
    resp3 = await client.post(
        "/api/v1/tools/content-ideas/generate",
        headers=auth_headers,
        json={"topic": "Robotics with ROS2", "platform": "myspace"}
    )
    assert resp3.status_code in [400, 422]

    # 4. Number of ideas out of bounds (< 1 or > 10)
    resp4 = await client.post(
        "/api/v1/tools/content-ideas/generate",
        headers=auth_headers,
        json={"topic": "Robotics with ROS2", "number_of_ideas": 0}
    )
    assert resp4.status_code in [400, 422]

    resp5 = await client.post(
        "/api/v1/tools/content-ideas/generate",
        headers=auth_headers,
        json={"topic": "Robotics with ROS2", "number_of_ideas": 15}
    )
    assert resp5.status_code in [400, 422]


@pytest.mark.asyncio
async def test_content_idea_generator_project_ownership(
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
        "/api/v1/tools/content-ideas/generate",
        headers=auth_headers,
        json={
            "topic": "Edge AI Systems",
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
        "/api/v1/tools/content-ideas/generate",
        headers=auth_headers,
        json={
            "topic": "Edge AI Systems",
            "project_id": second_user_proj_id
        }
    )
    assert resp_403.status_code == 403


@pytest.mark.asyncio
async def test_content_idea_generator_execution_and_persistence(client: AsyncClient, auth_headers: dict):
    """
    Test 1, 5, 9: Valid request execution, structured output contract,
    and database persistence of AIGeneration, Project Assets, and UsageRecord.
    """
    # 1. Create a project
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={
            "name": "Hardware Innovator Series",
            "description": "Content series covering embedded IoT builds",
            "target_audience": "Makers and Hardware Engineers",
            "tone": "Engaging"
        }
    )
    project_id = proj_resp.json()["id"]

    # 2. Generate ideas
    gen_resp = await client.post(
        "/api/v1/tools/content-ideas/generate",
        headers=auth_headers,
        json={
            "topic": "Building a low-cost methane sensor with ESP32",
            "niche": "Embedded Systems & IoT",
            "target_audience": "Makers and Hardware Engineers",
            "content_goal": "Engagement & Authority",
            "platform": "all",
            "tone": "engaging",
            "number_of_ideas": 3,
            "project_id": project_id
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()

    # Verify response structure
    assert "generation_id" in data and data["generation_id"] is not None
    assert data["project_id"] == project_id
    assert "ideas" in data
    assert len(data["ideas"]) >= 1

    # Verify structured fields in each IdeaOutput
    for idea in data["ideas"]:
        assert "title" in idea and len(idea["title"]) > 0
        assert "idea" in idea and len(idea["idea"]) > 0
        assert "hook" in idea and len(idea["hook"]) > 0
        assert "description" in idea and len(idea["description"]) > 0
        assert "target_audience" in idea and len(idea["target_audience"]) > 0
        assert "platform" in idea and len(idea["platform"]) > 0
        assert "rationale" in idea and len(idea["rationale"]) > 0

    # 3. Verify Assets persisted to project
    assets_resp = await client.get(f"/api/v1/projects/{project_id}/assets", headers=auth_headers)
    assert assets_resp.status_code == 200
    assets = assets_resp.json()
    assert len(assets) == len(data["ideas"])
    assert all(a["type"] == "content-idea" for a in assets)

    # 4. Verify AIGeneration record persisted
    gens_resp = await client.get(f"/api/v1/projects/{project_id}/generations", headers=auth_headers)
    assert gens_resp.status_code == 200
    gens = gens_resp.json()
    assert len(gens) == 1
    assert gens[0]["tool"] == "content-idea-generator"
    assert gens[0]["provider"] == "gemini"
    assert gens[0]["status"] == "completed"

    # 5. Verify Usage tracking
    usage_resp = await client.get("/api/v1/usage", headers=auth_headers)
    assert usage_resp.status_code == 200
    usage = usage_resp.json()
    assert usage["total_generations"] >= 1
    assert "content-idea-generator" in usage["tool_breakdown"]


@pytest.mark.asyncio
async def test_content_idea_generator_grounding_and_relevance(client: AsyncClient, auth_headers: dict):
    """
    Test 6: Verifies strict grounding and relevance to creator input.
    Generated ideas must retain core keywords ("methane", "esp 32") and not hallucinate generic advice.
    """
    gen_resp = await client.post(
        "/api/v1/tools/content-ideas/generate",
        headers=auth_headers,
        json={
            "topic": "methane monitoring system using esp 32",
            "niche": "IoT Hardware",
            "tone": "engaging",
            "number_of_ideas": 3
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    assert len(data["ideas"]) > 0

    all_text = " ".join(
        f"{i['title']} {i['idea']} {i['hook']} {i['description']}" for i in data["ideas"]
    ).lower()

    # Must contain specific keywords from prompt
    assert "methane" in all_text
    assert "esp" in all_text

    # Must not contain generic content repurposer slogans
    assert "transform your content creation workflow" not in all_text
    assert "generic marketing advice" not in all_text


@pytest.mark.asyncio
async def test_content_idea_generator_without_project_id(client: AsyncClient, auth_headers: dict):
    """
    Verifies that generation without a project_id works smoothly
    (e.g., ad-hoc brainstorming before assigning to a project).
    """
    gen_resp = await client.post(
        "/api/v1/tools/content-ideas/generate",
        headers=auth_headers,
        json={
            "topic": "Raspberry Pi Camera Enclosure in Fusion 360",
            "niche": "3D Printing & CAD",
            "tone": "educational",
            "number_of_ideas": 3
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    assert data["project_id"] is None
    assert data["generation_id"] is None
    assert len(data["ideas"]) >= 1
    assert "fusion" in data["ideas"][0]["title"].lower() or "raspberry" in data["ideas"][0]["title"].lower()


@pytest.mark.asyncio
async def test_content_idea_generator_alias_route(client: AsyncClient, auth_headers: dict):
    """
    Verifies that the alias route /api/v1/tools/content-idea-generator/generate works identically.
    """
    gen_resp = await client.post(
        "/api/v1/tools/content-idea-generator/generate",
        headers=auth_headers,
        json={
            "topic": "Modular Monolith Architecture for AI SaaS",
            "niche": "Software Architecture",
            "tone": "professional"
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    assert len(data["ideas"]) >= 1


@pytest.mark.asyncio
async def test_application_registry_marks_content_idea_generator_active(client: AsyncClient):
    """
    Test 8: Verifies that the standardized Application Registry marks content-idea-generator as active.
    """
    resp = await client.get("/api/v1/registry/applications")
    assert resp.status_code == 200
    apps = resp.json()
    
    idea_gen = next((a for a in apps if a["id"] == "content-idea-generator"), None)
    assert idea_gen is not None
    assert idea_gen["status"] == "active"
    assert idea_gen["route"] == "/tools/content-idea-generator"
    assert idea_gen["is_ai_powered"] is True
    assert idea_gen["output_type"] == "list_of_ideas"
