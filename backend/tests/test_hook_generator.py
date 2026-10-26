import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.mark.asyncio
async def test_hook_generator_authentication_requirement(client: AsyncClient):
    """
    Test 2: Verifies that unauthenticated requests to Hook Generator return 401 Unauthorized.
    """
    resp = await client.post(
        "/api/v1/tools/hooks/generate",
        json={"topic": "Microcontrollers & Edge AI"}
    )
    assert resp.status_code == 401

    # Also test the alias route
    resp_alias = await client.post(
        "/api/v1/tools/hook-generator/generate",
        json={"topic": "Microcontrollers & Edge AI"}
    )
    assert resp_alias.status_code == 401


@pytest.mark.asyncio
async def test_hook_generator_validation(client: AsyncClient, auth_headers: dict):
    """
    Test 4: Verifies input validation rules:
    - Empty or whitespace topic
    - Invalid tone
    - Invalid platform
    - Number of hooks out of bounds (< 1 or > 10)
    """
    # 1. Empty topic
    resp1 = await client.post(
        "/api/v1/tools/hooks/generate",
        headers=auth_headers,
        json={"topic": "   "}
    )
    assert resp1.status_code in [400, 422]

    # 2. Invalid tone
    resp2 = await client.post(
        "/api/v1/tools/hooks/generate",
        headers=auth_headers,
        json={"topic": "Edge AI Gas Detection", "tone": "invalid_tone_xyz"}
    )
    assert resp2.status_code in [400, 422]

    # 3. Invalid platform
    resp3 = await client.post(
        "/api/v1/tools/hooks/generate",
        headers=auth_headers,
        json={"topic": "Edge AI Gas Detection", "platform": "friendster"}
    )
    assert resp3.status_code in [400, 422]

    # 4. Out of bounds number_of_hooks (< 1 or > 10)
    resp4 = await client.post(
        "/api/v1/tools/hooks/generate",
        headers=auth_headers,
        json={"topic": "Edge AI Gas Detection", "number_of_hooks": 0}
    )
    assert resp4.status_code in [400, 422]

    resp5 = await client.post(
        "/api/v1/tools/hooks/generate",
        headers=auth_headers,
        json={"topic": "Edge AI Gas Detection", "number_of_hooks": 25}
    )
    assert resp5.status_code in [400, 422]


@pytest.mark.asyncio
async def test_hook_generator_project_ownership(
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
        "/api/v1/tools/hooks/generate",
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
        "/api/v1/tools/hooks/generate",
        headers=auth_headers,
        json={
            "topic": "Autonomous Robotics",
            "project_id": second_user_proj_id
        }
    )
    assert resp_403.status_code == 403


@pytest.mark.asyncio
async def test_hook_generator_execution_and_persistence(client: AsyncClient, auth_headers: dict):
    """
    Test 1, 5, 8: Valid request execution, structured output validation,
    and database persistence of AIGeneration, Project Assets, and UsageRecord.
    """
    # 1. Create a project
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={
            "name": "Hardware Hackers Hook Campaign",
            "description": "Viral hooks for maker hardware projects",
            "target_audience": "Makers and Embedded Engineers",
            "tone": "Bold"
        }
    )
    project_id = proj_resp.json()["id"]

    # 2. Generate hooks
    gen_resp = await client.post(
        "/api/v1/tools/hooks/generate",
        headers=auth_headers,
        json={
            "topic": "Building an autonomous methane monitoring system using ESP32",
            "audience": "Hardware engineers and makers",
            "platform": "all",
            "tone": "bold",
            "hook_style": "all",
            "number_of_hooks": 10,
            "project_id": project_id
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()

    # Verify response contract
    assert "generation_id" in data and data["generation_id"] is not None
    assert data["project_id"] == project_id
    assert "hooks" in data
    assert len(data["hooks"]) >= 1

    # Verify fields of every HookOutput
    for hook in data["hooks"]:
        assert "style" in hook and len(hook["style"]) > 0
        assert "hook" in hook and len(hook["hook"]) > 0
        assert "platform" in hook
        assert "rationale" in hook

    # 3. Verify Assets persisted to project
    assets_resp = await client.get(f"/api/v1/projects/{project_id}/assets", headers=auth_headers)
    assert assets_resp.status_code == 200
    assets = assets_resp.json()
    assert len(assets) == len(data["hooks"])
    assert all(a["type"] == "hook" for a in assets)

    # 4. Verify AIGeneration record persisted
    gens_resp = await client.get(f"/api/v1/projects/{project_id}/generations", headers=auth_headers)
    assert gens_resp.status_code == 200
    gens = gens_resp.json()
    assert len(gens) == 1
    assert gens[0]["tool"] == "hook-generator"
    assert gens[0]["provider"] == "gemini"
    assert gens[0]["status"] == "completed"

    # 5. Verify Usage tracking
    usage_resp = await client.get("/api/v1/usage", headers=auth_headers)
    assert usage_resp.status_code == 200
    usage = usage_resp.json()
    assert usage["total_generations"] >= 1
    assert "hook-generator" in usage["tool_breakdown"]


@pytest.mark.asyncio
async def test_hook_generator_grounding_and_relevance(client: AsyncClient, auth_headers: dict):
    """
    Test 6: Verifies strict grounding and relevance to user topic.
    Generated hooks must retain core topic keywords ("methane", "esp") and not hallucinate generic marketing advice.
    """
    gen_resp = await client.post(
        "/api/v1/tools/hooks/generate",
        headers=auth_headers,
        json={
            "topic": "methane monitoring system using esp 32",
            "audience": "IoT Developers",
            "platform": "linkedin",
            "tone": "bold",
            "number_of_hooks": 5
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    assert len(data["hooks"]) > 0

    all_text = " ".join(f"{h['hook']} {h['style']}" for h in data["hooks"]).lower()

    # Must retain specific keywords
    assert "methane" in all_text
    assert "esp" in all_text

    # Must NOT contain generic marketing slogans
    assert "transform your content creation workflow" not in all_text
    assert "generic marketing advice" not in all_text


@pytest.mark.asyncio
async def test_hook_generator_without_project_id(client: AsyncClient, auth_headers: dict):
    """
    Test 7: Verifies that ad-hoc hook generation without a project_id works smoothly.
    """
    gen_resp = await client.post(
        "/api/v1/tools/hooks/generate",
        headers=auth_headers,
        json={
            "topic": "Modular Monolith Architecture for AI SaaS",
            "platform": "x",
            "tone": "professional",
            "number_of_hooks": 5
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    assert data["project_id"] is None
    assert data["generation_id"] is None
    assert len(data["hooks"]) >= 1


@pytest.mark.asyncio
async def test_hook_generator_alias_route(client: AsyncClient, auth_headers: dict):
    """
    Verifies that the alias route /api/v1/tools/hook-generator/generate works identically.
    """
    gen_resp = await client.post(
        "/api/v1/tools/hook-generator/generate",
        headers=auth_headers,
        json={
            "topic": "Raspberry Pi Camera Enclosure in Fusion 360",
            "platform": "youtube",
            "tone": "educational"
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    assert len(data["hooks"]) >= 1


@pytest.mark.asyncio
async def test_application_registry_marks_hook_generator_active(client: AsyncClient):
    """
    Test 9: Verifies that the standardized Application Registry marks hook-generator as active.
    """
    resp = await client.get("/api/v1/registry/applications")
    assert resp.status_code == 200
    apps = resp.json()

    hook_app = next((a for a in apps if a["id"] == "hook-generator"), None)
    assert hook_app is not None
    assert hook_app["status"] == "active"
    assert hook_app["route"] == "/tools/hook-generator"
    assert hook_app["is_ai_powered"] is True
    assert hook_app["output_type"] == "list_of_hooks"
