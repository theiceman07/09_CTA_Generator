import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_batch4_stateful_workflows_suite(client: AsyncClient, auth_headers: dict):
    # Setup test project
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Batch 4 Stateful Workflows Project"}
    )
    assert proj_resp.status_code == 201
    project_id = proj_resp.json()["id"]

    # 1. Test AI Content Director (LangGraph)
    director_resp = await client.post(
        "/api/v1/tools/ai-content-director/direct",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "topic": "Edge Anomaly Detection in IoT Hardware",
            "target_platform": "Instagram",
            "campaign_goal": "Saves & Thought Leadership"
        }
    )
    assert director_resp.status_code == 200
    dir_data = director_resp.json()
    assert dir_data["project_id"] == project_id
    assert "directed_package" in dir_data
    assert len(dir_data["workflow_steps_executed"]) >= 3
    assert dir_data["production_readiness_score"] >= 90

    # 2. Test AI Content Director — Guruvelah
    guru_resp = await client.post(
        "/api/v1/tools/ai-content-director-guruvelah/direct",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "topic": "The Illusion of Cloud Reliability: The Case for Local Computing",
            "philosophical_angle": "First-Principles Technical Clarity",
            "target_platform": "LinkedIn / Substack"
        }
    )
    assert guru_resp.status_code == 200
    guru_data = guru_resp.json()
    assert guru_data["project_id"] == project_id
    assert len(guru_data["guruvelah_principles"]) >= 1

    # 3. Test AI Screenplay Workspace
    screenplay_resp = await client.post(
        "/api/v1/tools/screenplay-workspace/develop",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "premise": "An electrical engineer detects an anomalous underground telemetry signal while testing agricultural IoT sensors in rural Kansas.",
            "genre": "Sci-Fi / Tech Thriller",
            "target_format": "Short Film (10-15 mins)",
            "tone": "Suspenseful & Realist"
        }
    )
    assert screenplay_resp.status_code == 200
    screenplay_data = screenplay_resp.json()
    assert screenplay_data["project_id"] == project_id
    assert len(screenplay_data["character_profiles"]) >= 1
    assert len(screenplay_data["beat_sheet"]) >= 1
    assert "SCENE 1" in screenplay_data["scene_script"]

    # 4. Test Autonomous Content Pipeline (LangGraph)
    pipeline_resp = await client.post(
        "/api/v1/tools/autonomous-content-pipeline/run",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "source_input": "Full research notes on ultrasonic gas leak detection and battery current optimization for remote nodes.",
            "target_platforms": ["Instagram", "LinkedIn", "YouTube"],
            "automation_depth": "Full Production Pass"
        }
    )
    assert pipeline_resp.status_code == 200
    pipe_data = pipeline_resp.json()
    assert pipe_data["project_id"] == project_id
    assert pipe_data["status"] == "completed"
    assert len(pipe_data["stages_completed"]) >= 3
    assert "audit_verdict" in pipe_data

    # 5. Test AI Creative Producer
    producer_resp = await client.post(
        "/api/v1/tools/ai-creative-producer/produce",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "creative_concept": "Documentary teardown of a catastrophic hardware failure and the 48-hour sprint to rebuild it.",
            "aesthetic_vibe": "Cinematic Industrial Documentary",
            "primary_deliverable": "Hero YouTube Video + Vertical Reels"
        }
    )
    assert producer_resp.status_code == 200
    prod_data = producer_resp.json()
    assert prod_data["project_id"] == project_id
    assert len(prod_data["shot_list"]) >= 1
    assert "visual_style_guide" in prod_data

    # 6. Auth verification
    unauth = await client.post(
        "/api/v1/tools/ai-content-director/direct",
        json={"project_id": project_id, "topic": "Testing"}
    )
    assert unauth.status_code == 401

    notfound = await client.post(
        "/api/v1/tools/autonomous-content-pipeline/run",
        headers=auth_headers,
        json={"project_id": "non-existent-proj", "source_input": "Sample input"}
    )
    assert notfound.status_code == 404
