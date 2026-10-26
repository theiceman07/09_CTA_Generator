import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_batch2_research_workspace_brain_suite(client: AsyncClient, auth_headers: dict):
    # Setup test project
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Batch 2 Intelligence & Brain Project"}
    )
    assert proj_resp.status_code == 201
    project_id = proj_resp.json()["id"]

    # 1. Test Creator Research Assistant
    research_resp = await client.post(
        "/api/v1/tools/creator-research/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "topic": "Edge AI IoT Hardware Prototyping",
            "research_depth": "Comprehensive Deep-Dive",
            "target_audience": "Embedded Engineers and Hardware Hackers"
        }
    )
    assert research_resp.status_code == 200
    res_data = research_resp.json()
    assert res_data["project_id"] == project_id
    assert "executive_brief" in res_data
    assert len(res_data["technical_pillars"]) >= 1
    assert len(res_data["competitor_landscape"]) >= 1

    # 2. Test Second Brain Items (Save note)
    brain_create_resp = await client.post(
        "/api/v1/tools/second-brain/items",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "title": "ESP32 ADC Linearity Workaround",
            "content": "ESP32 ADC has non-linear response below 0.1V and above 2.8V. Use multislope curve or external I2C ADC (ADS1115).",
            "category": "framework",
            "tags": ["esp32", "adc", "hardware"]
        }
    )
    assert brain_create_resp.status_code == 201
    item_data = brain_create_resp.json()
    assert item_data["title"] == "ESP32 ADC Linearity Workaround"
    item_id = item_data["id"]

    # List items
    brain_list_resp = await client.get(
        f"/api/v1/tools/second-brain/items?project_id={project_id}",
        headers=auth_headers
    )
    assert brain_list_resp.status_code == 200
    items = brain_list_resp.json()
    assert len(items) >= 1

    # Query Second Brain
    brain_query_resp = await client.post(
        "/api/v1/tools/second-brain/query",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "query": "How do I handle ESP32 ADC non-linearity?"
        }
    )
    assert brain_query_resp.status_code == 200
    query_data = brain_query_resp.json()
    assert "direct_answer" in query_data
    assert len(query_data["connected_themes"]) >= 1

    # 3. Test Creator Workspace Overview
    ws_resp = await client.get(
        f"/api/v1/tools/workspace/projects/{project_id}/overview",
        headers=auth_headers
    )
    assert ws_resp.status_code == 200
    ws_data = ws_resp.json()
    assert ws_data["project_id"] == project_id
    assert ws_data["total_assets"] >= 2  # research asset + second brain item
    assert "second_brain_item" in ws_data["asset_types_breakdown"]

    # Test Workspace Handoff
    handoff_resp = await client.post(
        "/api/v1/tools/workspace/handoff",
        headers=auth_headers,
        json={
            "source_asset_id": item_id,
            "target_tool": "hook_generator"
        }
    )
    assert handoff_resp.status_code == 200
    handoff_data = handoff_resp.json()
    assert handoff_data["target_tool"] == "hook_generator"
    assert "ESP32" in handoff_data["prefill_content"]

    # 4. Auth & Multi-tenant checks
    unauth_resp = await client.post(
        "/api/v1/tools/creator-research/generate",
        json={"project_id": project_id, "topic": "Testing auth"}
    )
    assert unauth_resp.status_code == 401

    notfound_resp = await client.get(
        "/api/v1/tools/workspace/projects/non-existent-proj/overview",
        headers=auth_headers
    )
    assert notfound_resp.status_code == 404
