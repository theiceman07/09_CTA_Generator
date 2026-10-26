import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_batch3_media_tools_suite(client: AsyncClient, auth_headers: dict):
    # Setup test project
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Batch 3 Media & Audio Project"}
    )
    assert proj_resp.status_code == 201
    project_id = proj_resp.json()["id"]

    # 1. Test Voice Replicator
    sample_writings = """
    Most engineers overcomplicate hardware telemetry. They spend weeks tuning cloud APIs
    when all they needed was a robust local watchdog loop and proper ADC grounding.
    Here is the exact blueprint I use on every single production build.
    """
    voice_resp = await client.post(
        "/api/v1/tools/voice-replicator/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "sample_writings": sample_writings,
            "topic": "Power Harvesting with Micro Solar Cells",
            "platform": "LinkedIn",
            "tone": "Direct & Pragmatic"
        }
    )
    assert voice_resp.status_code == 200
    voice_data = voice_resp.json()
    assert voice_data["project_id"] == project_id
    assert "style_profile" in voice_data
    assert "generated_content" in voice_data
    assert voice_data["style_alignment_score"] >= 80

    # 2. Test Podcast Assistant
    podcast_resp = await client.post(
        "/api/v1/tools/podcast-assistant/plan",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "episode_concept": "The Reality of Launching an Open Source IoT Hardware Startup in 2026",
            "target_duration_minutes": 45,
            "guest_name_or_archetype": "Lead Firmware Architect",
            "tone": "Deep-Dive & Candid"
        }
    )
    assert podcast_resp.status_code == 200
    pod_data = podcast_resp.json()
    assert pod_data["project_id"] == project_id
    assert len(pod_data["episode_title_options"]) >= 1
    assert len(pod_data["timed_segments"]) >= 1
    assert "show_notes_markdown" in pod_data

    # 3. Test Clip Finder
    sample_transcript = """
    [00:01] Welcome back everyone. Today we are talking about sensor reliability.
    [02:15] I watched ten different teams try to deploy methane monitoring networks, and nine of them made the exact same fatal mistake.
    [02:35] They assumed their analog ADC pins would stay calibrated over varying ambient temperatures. Within forty-eight hours, false alerts spiked by 800 percent.
    [03:05] If you don't implement local temperature compensation curves in firmware, your sensors are practically useless.
    [10:00] Now let's look at the battery sleep current measurements.
    """
    clip_resp = await client.post(
        "/api/v1/tools/clip-finder/extract",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "transcript_text": sample_transcript,
            "video_topic": "Sensor Calibration Pitfalls",
            "target_platform": "TikTok / Reels"
        }
    )
    assert clip_resp.status_code == 200
    clip_data = clip_resp.json()
    assert clip_data["project_id"] == project_id
    assert len(clip_data["clips"]) >= 1
    assert "recommended_clip" in clip_data
    assert clip_data["recommended_clip"]["viral_potential_score"] >= 80

    # 4. Security checks
    unauth = await client.post(
        "/api/v1/tools/clip-finder/extract",
        json={"project_id": project_id, "transcript_text": "sample text"}
    )
    assert unauth.status_code == 401

    notfound = await client.post(
        "/api/v1/tools/podcast-assistant/plan",
        headers=auth_headers,
        json={"project_id": "non-existent-id", "episode_concept": "Concept here"}
    )
    assert notfound.status_code == 404
