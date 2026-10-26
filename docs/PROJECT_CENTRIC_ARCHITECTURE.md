# Project-Centric SaaS Architecture

## Conceptual Rationale

A fundamental insight from analyzing the student applications is that content creation is not an isolated series of ephemeral prompts; it is an organized, hierarchical workflow. A creator does not generate a hook in a vacuum; they generate a hook **for** a specific video, which belongs to a specific topic or campaign, under a specific brand or channel persona.

Therefore, **PROJECT** must be the central organizing entity of the unified SaaS platform.

---

## The Entity Hierarchy

```text
User (Creator / Agency Account)
 │
 ├── Organization / Workspace (Multi-tenant boundary)
 │    │
 │    ├── Brand Profile & Voice Vault (Stylistic fingerprint, historical post embeddings)
 │    │
 │    └── PROJECTS (e.g. "Q4 SaaS Growth Campaign", "Weekly Podcast Ep 42", "How to Build AI Apps")
 │         │
 │         ├── Research Dossier (Facts, angles, competitor benchmarks, web citations)
 │         │
 │         ├── Ideation Pool (Target concepts, titles, content gap insights)
 │         │
 │         ├── Primary Master Asset (YouTube script, long-form essay, or uploaded podcast/video)
 │         │
 │         ├── Modular Content Assets
 │         │    ├── Hooks (10 psychological angles)
 │         │    ├── Short-form Scripts (30-60s Reels/TikToks)
 │         │    ├── Video Clips (Extracted MP4 segments with timestamps)
 │         │    ├── Visual Concepts & Thumbnails (Cover designs, prompt cards)
 │         │    ├── Platform Adaptations (LinkedIn carousel, X thread, IG captions)
 │         │    └── Conversion CTAs (Goal-driven action buttons & text)
 │         │
 │         ├── Generation History & Iterations (Prompts, versions, model used, feedback)
 │         │
 │         ├── Publishing Calendar Entries (Scheduled release date, status)
 │         │
 │         └── Post-Publish Analytics (Views, likes, shares, decay curve, evergreen rating)
```

---

## Core Domain Entities

### 1. `User`
- Represents the authenticated creator or team member.
- Owns billing subscriptions, global API quotas, and organization memberships.

### 2. `Project`
- The central aggregation boundary.
- Holds metadata: name, description, target audience, tone, primary goal (reach, conversion, education), default platforms, creation date, status (Drafting, In Review, Scheduled, Published, Archived).

### 3. `Content`
- Represents a discrete piece of content produced within a project.
- Attributes: format (`reel_script`, `linkedin_post`, `x_thread`, `youtube_script`, `thumbnail_concept`), title, body, status, platform.

### 4. `Generation`
- Represents an immutable record of an AI inference event.
- Tracks: prompt text, system prompt version, model name (`gemini-2.0-flash`, `claude-3-5-sonnet`), token count, latency ms, cost, parent project ID, output JSON, user feedback rating.

### 5. `Asset`
- Stores binary or rich media items associated with the project.
- Types: raw video upload, audio transcript, extracted clip (.mp4), thumbnail preview (.png), proposal export (.pdf).

### 6. `Workflow`
- Represents a stateful multi-step pipeline execution (e.g. Autonomous Content Pipeline, 7-Stage Production Director).
- Tracks: current step, execution graph, run logs, error states.

### 7. `Analytics`
- Tracks the lifecycle performance of published content.
- Attributes: views, engagement rate, save count, decay rate, evergreen score, recommended recycling action.

### 8. `Usage`
- Tracks metering per user / project for billing enforcement.
- Metrics: input tokens, output tokens, Whisper audio minutes, FFmpeg video rendering seconds, storage bytes.
