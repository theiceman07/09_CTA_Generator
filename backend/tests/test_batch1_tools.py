import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_batch1_text_tools_suite(client: AsyncClient, auth_headers: dict):
    # Setup test project
    proj_resp = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"name": "Batch 1 Verification Project"}
    )
    assert proj_resp.status_code == 201
    project_id = proj_resp.json()["id"]

    # 1. Test CTA Generator
    cta_resp = await client.post(
        "/api/v1/tools/ctas/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "content": "Building an autonomous methane monitoring system using ESP32",
            "platform": "Instagram",
            "goal": "Engagement & Comments",
            "count": 3
        }
    )
    assert cta_resp.status_code == 200
    cta_data = cta_resp.json()
    assert len(cta_data["ctas"]) >= 1
    assert "recommended_cta" in cta_data
    assert cta_data["project_id"] == project_id

    # 2. Test Comment Analyzer
    comment_resp = await client.post(
        "/api/v1/tools/comments/analyze",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "comments": [
                "Does this ESP32 methane sensor work with 3.3V battery power?",
                "Can you share the wiring schematic and CAD files?",
                "Great project! What detection threshold does it trigger at?"
            ],
            "platform": "YouTube",
            "content_context": "ESP32 Methane Sensor Build"
        }
    )
    assert comment_resp.status_code == 200
    comm_data = comment_resp.json()
    assert comm_data["total_comments_analyzed"] == 3
    assert len(comm_data["top_questions"]) >= 1
    assert "overall_sentiment" in comm_data

    # 3. Test Comment to Content
    c2c_resp = await client.post(
        "/api/v1/tools/comment-to-content/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "comment": "How do you calibrate the analog sensor without expensive gas canisters?",
            "platform": "Instagram",
            "format_type": "Short-form Video"
        }
    )
    assert c2c_resp.status_code == 200
    c2c_data = c2c_resp.json()
    assert len(c2c_data["ideas"]) >= 1
    assert "recommended_idea" in c2c_data

    # 4. Test Content Recycler
    recycler_resp = await client.post(
        "/api/v1/tools/content-recycler/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "past_content": "We built a low-cost IoT methane detection station using an ESP32 and edge AI. Here is what we learned from 30 days in the field.",
            "original_platform": "LinkedIn",
            "refresh_goal": "Modernize & Expand"
        }
    )
    assert recycler_resp.status_code == 200
    rec_data = recycler_resp.json()
    assert len(rec_data["variations"]) >= 1
    assert "recommended_variation" in rec_data

    # 5. Test Brand Pitch Builder
    pitch_resp = await client.post(
        "/api/v1/tools/brand-pitch/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "creator_name": "Alex Rivers",
            "creator_niche": "Hardware Engineering & IoT",
            "primary_platform": "YouTube",
            "brand_name": "Espressif Systems",
            "brand_product": "ESP32-S3 Microcontroller"
        }
    )
    assert pitch_resp.status_code == 200
    pitch_data = pitch_resp.json()
    assert len(pitch_data["email_subject_lines"]) >= 1
    assert len(pitch_data["outreach_email_body"]) > 20

    # 6. Test Creator Collaboration Finder
    collab_resp = await client.post(
        "/api/v1/tools/collaboration-finder/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "creator_niche": "Embedded Systems & IoT Hardware",
            "primary_platform": "YouTube",
            "collaboration_goal": "Audience Growth"
        }
    )
    assert collab_resp.status_code == 200
    collab_data = collab_resp.json()
    assert len(collab_data["partner_archetypes"]) >= 1
    assert len(collab_data["collaboration_ideas"]) >= 1

    # 7. Test Daily Content Planner
    planner_resp = await client.post(
        "/api/v1/tools/daily-content-planner/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "core_topics": "IoT Hardware, ESP32 Tutorials, 3D Printed Enclosures",
            "platforms": ["LinkedIn", "Instagram", "X"],
            "days_count": 7
        }
    )
    assert planner_resp.status_code == 200
    planner_data = planner_resp.json()
    assert len(planner_data["schedule"]) == 7

    # 8. Test Thumbnail Ideator
    thumb_resp = await client.post(
        "/api/v1/tools/thumbnail-ideator/generate",
        headers=auth_headers,
        json={
            "project_id": project_id,
            "video_title_or_concept": "I Built a $5 Methane Detection Station",
            "platform": "YouTube"
        }
    )
    assert thumb_resp.status_code == 200
    thumb_data = thumb_resp.json()
    assert len(thumb_data["concepts"]) >= 1
    assert "recommended_concept" in thumb_data

    # Verify that project assets and generations accumulated properly
    assets_resp = await client.get(f"/api/v1/projects/{project_id}/assets", headers=auth_headers)
    assert assets_resp.status_code == 200
    assets = assets_resp.json()
    assert len(assets) >= 8  # At least 1 asset generated per tool
