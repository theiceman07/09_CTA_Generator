# Standardized API Integration Plan

This document establishes the unified RESTful API specification for the SaaS platform. All capabilities currently scattered across disparate ad-hoc routes are consolidated into structured endpoints authenticated via Bearer JWT and scoped to an active `project_id`.

---

## Global Request & Response Standards

### Authentication Header
```http
Authorization: Bearer <user_jwt_token>
```

### Standard Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "usage": {
    "tokens_consumed": 420,
    "credits_deducted": 1,
    "remaining_credits": 149
  },
  "error": null
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "QUOTA_EXCEEDED",
    "message": "Monthly generation token limit reached. Please upgrade your plan.",
    "details": null
  }
}
```

---

## Master API Endpoint Registry

### 1. Projects & Workspaces
- `GET /api/v1/projects` — List user's creator projects.
- `POST /api/v1/projects` — Create new project workspace.
  - **Input**: `{ "name": "AI Product Launch", "target_audience": "Tech Founders", "tone": "Bold", "primary_goal": "Conversion" }`
- `GET /api/v1/projects/:id` — Retrieve full project tree (ideas, scripts, assets, analytics).

### 2. Ideation & Research
- `POST /api/v1/ideation/ideas` (Integrates App 01)
  - **Input**: `{ "project_id": "proj_123", "topic": "AI Automation", "audience": "Freelancers", "count": 10 }`
  - **Output**: `{ "ideas": Array<{ "type": string, "title": string, "hook": string, "rationale": string }> }`
- `POST /api/v1/ideation/research` (Integrates App 12)
  - **Input**: `{ "project_id": "proj_123", "topic": "AI Agents in 2026", "depth": "deep" }`
  - **Output**: `{ "summary": string, "key_facts": string[], "contrarian_angles": string[], "sources": string[] }`
- `GET /api/v1/ideation/trends` (Integrates App 18G)
  - **Input**: `?region=GLOBAL&category=Technology`
  - **Output**: `{ "trends": Array<{ "id": string, "keyword": string, "velocity_score": number, "sample_hooks": string[] }> }`

### 3. Production Studio (Scripts, Hooks, CTAs, Covers)
- `POST /api/v1/studio/hooks` (Integrates App 03)
  - **Input**: `{ "project_id": "proj_123", "topic": "Cold Outreach", "platform": "LinkedIn", "tone": "Bold" }`
  - **Output**: `{ "hooks": Array<{ "style": string, "hook": string, "angle_explanation": string }> }`
- `POST /api/v1/studio/reels` (Integrates App 05)
  - **Input**: `{ "project_id": "proj_123", "topic": "How to Automate Emails", "tone": "Educational" }`
  - **Output**: `{ "hook": string, "body": Array<{ "timestamp": string, "visual": string, "narration": string, "text_overlay": string }>, "cta": string }`
- `POST /api/v1/studio/captions` (Integrates App 08)
  - **Input**: Multipart Form: `{ "project_id": "proj_123", "image"?: File, "topic"?: string, "platform": "Instagram" }`
  - **Output**: `{ "captions": Array<{ "style": string, "text": string, "hashtags": string[], "character_count": number }> }`
- `POST /api/v1/studio/ctas` (Integrates App 09)
  - **Input**: `{ "project_id": "proj_123", "goal": "Lead Generation", "platform": "X", "context": "Free Notion Template" }`
  - **Output**: `{ "ctas": Array<{ "cta_text": string, "placement": string, "urgency_level": string }> }`
- `POST /api/v1/studio/thumbnails` (Integrates App 07)
  - **Input**: `{ "project_id": "proj_123", "title": "I Replaced My Team with AI", "format": "YouTube Thumbnail" }`
  - **Output**: `{ "concepts": Array<{ "visual_hook": string, "expression": string, "overlay_text": string, "color_palette": string[] }> }`

### 4. Content Repurposing & Audio
- `POST /api/v1/repurpose` (Integrates App 02)
  - **Input**: `{ "project_id": "proj_123", "content": "Full blog or transcript text...", "target_platforms": ["linkedin", "instagram", "x", "youtube"] }`
  - **Output**: `{ "thesis": string, "linkedin": { ... }, "instagram": { ... }, "x": { ... }, "youtube": { ... } }`
- `POST /api/v1/audio/analyze-podcast` (Integrates App 14)
  - **Input**: `{ "project_id": "proj_123", "transcript": "Full episode transcript..." }`
  - **Output**: `{ "title": string, "alternative_titles": string[], "description": string, "chapters": Array<{ "timestamp": string, "title": string }>, "highlights": string[] }`

### 5. Media Processing (Specialized Async Queue)
- `POST /api/v1/media/clips/jobs` (Integrates App 06)
  - **Input**: Multipart upload or `{ "youtube_url": string, "max_duration": 60 }`
  - **Output**: `{ "job_id": "job_998", "status": "QUEUED" }`
- `GET /api/v1/media/clips/jobs/:id`
  - **Output**: `{ "status": "COMPLETED", "clips": Array<{ "clip_url": string, "virality_score": number, "transcript": string, "start_time": number, "end_time": number }> }`

### 6. Knowledge Vault & Voice Engine
- `POST /api/v1/voice/profile` (Integrates App 13)
  - **Input**: Historical post texts or sample uploads.
  - **Output**: `{ "formality_score": 0.65, "humor_index": 0.40, "vocabulary_tier": "Advanced", "top_phrases": string[] }`
- `POST /api/v1/second-brain/chat` (Integrates App 19)
  - **Input**: `{ "channel_id": "chan_456", "message": "What did I say about pricing in June?" }`
  - **Output**: SSE Stream with text chunks and tool cards.

### 7. Monetization & Growth
- `POST /api/v1/growth/recycler` (Integrates App 16)
  - **Input**: `{ "project_id": "proj_123", "posts": Array<{ "id": string, "metrics": object }> }`
  - **Output**: `{ "recommendations": Array<{ "post_id": string, "action": "REPOST"|"REWORK"|"REPURPOSE"|"ARCHIVE", "evergreen_score": number }> }`
- `POST /api/v1/growth/brand-proposal` (Integrates App 17)
  - **Input**: `{ "project_id": "proj_123", "brand_name": "Nike", "budget": 5000, "campaign_goals": "Gen Z Awareness" }`
  - **Output**: `{ "alignment_score": 88, "tiered_packages": object, "email_pitch": string, "pdf_download_url": string }`
