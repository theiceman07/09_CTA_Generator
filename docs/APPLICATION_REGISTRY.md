# Creator AI SaaS — Standardized Application Registry

This document lists all **24 application capabilities** derived from the repository audit, categorized into the unified SaaS platform.

| # | Application Name | Module ID | Category | Status | Tech / Processing |
|---|---|---|---|---|---|
| 1 | Content Idea Generator | `content-idea-generator` | Content Creation | **Live** | Gemini + LangChain |
| 2 | Content Repurposer | `content-repurposer` | Repurposing & Optimization | **Live** | Gemini + LangChain |
| 3 | Hook Generator | `hook-generator` | Content Creation | **Live** | Gemini + LangChain |
| 4 | Daily Content Planner | `daily-content-planner` | Repurposing & Optimization | Planned | Gemini + LangChain |
| 5 | Reel Script Builder | `reel-script-builder` | Content Creation | **Live** | Gemini + LangChain |
| 6 | Clip Finder | `clip-finder` | Audio & Video Media | Planned | Gemini + FFmpeg + Faster-Whisper |
| 7 | Thumbnail Ideator | `thumbnail-ideator` | Audio & Video Media | Planned | Gemini + Layout Engine |
| 8 | Caption Assistant | `caption-assistant` | Content Creation | **Live** | Gemini + LangChain |
| 9 | CTA Generator | `cta-generator` | Content Creation | Planned | Gemini + LangChain |
| 10 | Comment Analyzer | `comment-analyzer` | Repurposing & Optimization | Planned | Gemini + LangChain |
| 11 | Comment to Content | `comment-to-content` | Repurposing & Optimization | Planned | Gemini + LangChain |
| 12 | Creator Research Assistant | `creator-research-assistant` | Research & Strategy | Planned | Gemini + Web Search |
| 13 | Voice Replicator | `voice-replicator` | Audio & Video Media | Planned | Audio Transcoding + Synthesis |
| 14 | Podcast Assistant | `podcast-assistant` | Audio & Video Media | Planned | Faster-Whisper + Gemini |
| 15 | Creator Workspace | `creator-workspace` | Workflows & Pipelines | Planned | Unified Studio UI + Editor |
| 16 | Content Recycler | `content-recycler` | Repurposing & Optimization | Planned | Gemini + LangChain |
| 17 | Brand Pitch Builder | `brand-pitch-builder` | Research & Strategy | Planned | Gemini + LangChain |
| 18 | AI Content Director | `ai-content-director` | Workflows & Pipelines | Planned | LangChain / LangGraph |
| 19 | AI Content Director — Guruvelah | `ai-content-director-guruvelah` | Workflows & Pipelines | Planned | LangChain Narrative Chain |
| 20 | Creator Second Brain | `creator-second-brain` | Research & Strategy | Planned | PostgreSQL + pgvector + Gemini |
| 21 | AI Screenplay Workspace | `screenplay-workspace` | Content Creation | Planned | LangChain Screenplay Chains |
| 22 | Autonomous Content Pipeline | `autonomous-content-pipeline` | Workflows & Pipelines | Planned | LangGraph Multi-Stage State |
| 23 | AI Creative Producer | `ai-creative-producer` | Workflows & Pipelines | Planned | Gemini Budget & Schedule Engine |
| 24 | Creator Collaboration Finder | `collaboration-finder` | Research & Strategy | Planned | Audience Overlap Matcher |

---

## Shared Application Contract
All 24 tools share:
1. **Project Centricity**: Every asset generated belongs to an authenticated project (`project_id`).
2. **Centralized Gemini Service**: All LLM queries flow through `app.ai.gemini.service`.
3. **Structured Outputs**: Outputs conform to Pydantic schemas before persistence.
4. **Usage Records**: Audit trail created in `usage_records` and `ai_generations`.
5. **Direct Workflow Handoffs**: Formats are compatible for chaining (Idea -> Hook -> Script -> Repurpose).
