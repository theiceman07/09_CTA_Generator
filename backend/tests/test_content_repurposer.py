import pytest
from httpx import AsyncClient
from app.ai.gateway import model_gateway
from app.core.config import settings

@pytest.mark.asyncio
async def test_content_repurposer_validation(client: AsyncClient, auth_headers: dict):
    # Setup: Create a project
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Repurposer Test Project"}
    )
    project_id = proj_resp.json()["id"]

    # 1. Empty content validation
    resp1 = await client.post(
        "/api/v1/tools/content-repurposer/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "content": "   ",
            "platforms": ["linkedin"],
            "tone": "professional"
        }
    )
    assert resp1.status_code == 400 or resp1.status_code == 422

    # 2. Empty platforms validation
    resp2 = await client.post(
        "/api/v1/tools/content-repurposer/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "content": "Great insights on AI systems engineering.",
            "platforms": [],
            "tone": "professional"
        }
    )
    assert resp2.status_code == 400 or resp2.status_code == 422

    # 3. Invalid platform validation
    resp3 = await client.post(
        "/api/v1/tools/content-repurposer/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "content": "Great insights on AI systems engineering.",
            "platforms": ["invalid_platform_xyz"],
            "tone": "professional"
        }
    )
    assert resp3.status_code == 400 or resp3.status_code == 422

    # 4. Invalid tone validation
    resp4 = await client.post(
        "/api/v1/tools/content-repurposer/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "content": "Great insights on AI systems engineering.",
            "platforms": ["linkedin"],
            "tone": "unsupported_tone_99"
        }
    )
    assert resp4.status_code == 400 or resp4.status_code == 422

@pytest.mark.asyncio
async def test_content_repurposer_execution_and_persistence(client: AsyncClient, auth_headers: dict):
    # 1. Create Project
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "AI Architecture Series"}
    )
    project_id = proj_resp.json()["id"]

    # 2. Generate for only LinkedIn and X (Instagram and YouTube must NOT be generated)
    gen_resp = await client.post(
        "/api/v1/tools/content-repurposer/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "content": "Here is an in-depth breakdown of how modular monolith architecture provides superior reliability for AI SaaS compared to microservices.",
            "platforms": ["linkedin", "x"],
            "tone": "educational"
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    assert "generation_id" in data
    assert data["project_id"] == project_id
    
    # Results must only contain selected platforms
    results = data["results"]
    assert "linkedin" in results
    assert "x" in results
    assert "instagram" not in results
    assert "youtube" not in results
    assert len(results["linkedin"]) > 0

    # 3. Check that Assets were saved to the project
    assets_resp = await client.get(f"/api/v1/projects/{project_id}/assets", headers=auth_headers)
    assert assets_resp.status_code == 200
    assets = assets_resp.json()
    assert len(assets) == 2
    asset_types = {a["type"] for a in assets}
    assert "linkedin" in asset_types
    assert "x" in asset_types

    # 4. Check that AIGeneration history was saved
    gens_resp = await client.get(f"/api/v1/projects/{project_id}/generations", headers=auth_headers)
    assert gens_resp.status_code == 200
    gens = gens_resp.json()
    assert len(gens) == 1
    assert gens[0]["tool"] == "content-repurposer"

    # 5. Check Usage Tracking
    usage_resp = await client.get("/api/v1/usage", headers=auth_headers)
    assert usage_resp.status_code == 200
    usage = usage_resp.json()
    assert usage["total_generations"] >= 1
    assert "content-repurposer" in usage["tool_breakdown"]

@pytest.mark.asyncio
async def test_content_repurposer_grounding_and_relevance(client: AsyncClient, auth_headers: dict):
    """
    Regression Test:
    Ensures that content repurposer generates content strictly grounded
    in the user's specific subject ("methane monitoring system using esp 32")
    and never returns generic marketing text.
    """
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Methane IoT Project"}
    )
    project_id = proj_resp.json()["id"]

    test_content = "i built an methane monitoring system using esp 32"
    gen_resp = await client.post(
        "/api/v1/tools/content-repurposer/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "content": test_content,
            "platforms": ["linkedin", "instagram", "x", "youtube"],
            "tone": "professional"
        }
    )
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    results = data["results"]

    # All 4 platforms must be present
    assert "linkedin" in results
    assert "instagram" in results
    assert "x" in results
    assert "youtube" in results

    # Verify content grounding across all platforms
    linkedin_text = results["linkedin"].lower()
    assert "methane" in linkedin_text
    assert "esp" in linkedin_text
    assert "monitoring" in linkedin_text

    # Verify that generic content strategy strings are NOT present
    assert "transform your content creation workflow" not in linkedin_text
    assert "focus on core thesis" not in linkedin_text
    assert "adapt format to audience expectation" not in linkedin_text

    # Verify YouTube output structure and grounding
    yt = results["youtube"]
    assert "title" in yt and "outline" in yt
    assert "methane" in yt["title"].lower() or "methane" in yt["description"].lower()

def test_gateway_prevents_accidental_mock_in_production():
    """
    Ensures that when not in test mode, AIModelGateway raises an error
    if Google API key is missing instead of silently using MockAIProvider.
    """
    orig_testing = settings.TESTING
    orig_key = settings.GEMINI_API_KEY
    try:
        settings.TESTING = False
        settings.GEMINI_API_KEY = None
        with pytest.raises(RuntimeError, match="Google Gemini API key is missing"):
            model_gateway.get_provider()
    finally:
        settings.TESTING = orig_testing
        settings.GEMINI_API_KEY = orig_key

@pytest.mark.asyncio
async def test_application_registry_contains_all_24_capabilities(client: AsyncClient):
    """
    Verifies that the standardized Application Registry exposes all 24 capabilities
    with full metadata, correct categories, and active Content Repurposer.
    """
    resp = await client.get("/api/v1/registry/applications")
    assert resp.status_code == 200
    apps = resp.json()
    assert len(apps) == 24
    
    app_ids = {a["id"] for a in apps}
    assert "content-repurposer" in app_ids
    assert "content-idea-generator" in app_ids
    assert "hook-generator" in app_ids
    assert "reel-script-builder" in app_ids
    assert "creator-second-brain" in app_ids
    assert "ai-content-director" in app_ids
    assert "autonomous-content-pipeline" in app_ids
    assert "ai-creative-producer" in app_ids

    # Verify active status of Content Repurposer
    repurposer = next(a for a in apps if a["id"] == "content-repurposer")
    assert repurposer["status"] == "active"
    assert repurposer["is_ai_powered"] is True

