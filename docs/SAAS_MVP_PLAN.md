# SaaS Minimum Viable Product (MVP) Plan

## Strategy: The Core Creator Engine

Attempting to merge all 24 applications simultaneously would result in project failure due to dependency conflicts, scattered UX, and excessive integration complexity.

Instead, the MVP focuses on delivering the **highest-leverage, coherent, closed-loop creator workflow**:

```text
IDEA  ──►  RESEARCH  ──►  HOOK  ──►  SCRIPT  ──►  REPURPOSE  ──►  CAPTION  ──►  CTA
(01)         (12)         (03)       (05)          (02)           (08)        (09)
```

This sequence solves the primary daily friction point for content creators: turning a vague seed idea into an actionable, multi-platform publishing package in under 60 seconds.

---

## MVP Applications (Detailed Evaluation)

### 1. `01_Content_Idea_Generator` (Ideation Engine)
- **Why it is included**: Initiates the creator lifecycle. Solves creator block by transforming a high-level topic and audience into 10 structured YouTube video concepts with psychological angles (Tutorial, Myth Buster, Case Study).
- **What it depends on**: User topic and target audience inputs; zero upstream application dependencies.
- **What shared infrastructure it requires**: API Gateway, Model Gateway (Google Gemini Flash), and Project-centric database session.
- **Direct integration vs Refactoring**: **Needs refactoring**. The original is a simple Express.js server using LangChain JS. Its prompt template and Zod validation schema will be ported into a FastAPI domain router (`app.modules.ideation`) using Pydantic.

### 2. `12_Creator_Research_Assistant` (Empirical Fact Finder)
- **Why it is included**: Bridges the gap between a raw concept and high-credibility content. Provides factual grounding, acronym definitions, and counter-intuitive angles to eliminate superficial AI hallucinations.
- **What it depends on**: The selected concept/title from Application 01 (or direct user query).
- **What shared infrastructure it requires**: Model Gateway (Gemini Flash) and Project contextual store.
- **Direct integration vs Refactoring**: **Needs refactoring**. The original is a Next.js server route using `@google/genai`. Its research prompt and structured extraction logic will be ported into `app.modules.research` in FastAPI.

### 3. `03_Hook_Generator` (Psychological Hook Engine)
- **Why it is included**: Hooks determine > 80% of content retention and click-through rates. Provides 10 battle-tested psychological angles (Curiosity, Contrarian, Negative Twist, Proof-Based) with statistical anti-hallucination guardrails.
- **What it depends on**: The researched idea from Applications 01 and 12.
- **What shared infrastructure it requires**: Model Gateway (Gemini Flash/Pro) and Hook schema definitions.
- **Direct integration vs Refactoring**: **Needs refactoring**. Original is a Next.js 15 route handler using LangChain JS. Its prompt template and 10-style safety guardrails will be ported into `app.modules.hooks` in FastAPI.

### 4. `05_Reel_Script_Builder` (Short-Form Video Scripting)
- **Why it is included**: Turns the idea and hook into an actionable, production-ready vertical video script with timed beats (0-3s Hook, 3-15s Setup, 15-45s Core Value, 45-60s Climax/CTA) and visual cues.
- **What it depends on**: Selected idea (01) and chosen hook (03).
- **What shared infrastructure it requires**: Model Gateway (Gemini Flash), Project script storage in PostgreSQL.
- **Direct integration vs Refactoring**: **Direct integration (Minimal refactoring)**. Already written in FastAPI and Python. Its timeline generation logic can be ported directly into `app.modules.scripting` with minimal adaptation to import the shared Model Gateway.

### 5. `02_Content_Repurposer` (Multi-Platform Transformation)
- **Why it is included**: The fundamental economic value multiplier of the SaaS. Transforms the master script or draft simultaneously into 4 platform-optimized assets: LinkedIn post, Instagram carousel copy, X thread, and YouTube description.
- **What it depends on**: Master script from Application 05 or user-pasted long-form text.
- **What shared infrastructure it requires**: Model Gateway (Gemini Flash Lite), PostgreSQL content items table, LangSmith tracing.
- **Direct integration vs Refactoring**: **Direct integration**. Already built in FastAPI with structured Pydantic models (`LinkedInPost`, `InstagramCarousel`, `XThread`, `YouTubeScript`) and parallel `asyncio.gather` execution. Forms the core foundation of `app.modules.repurposing`.

### 6. `08_Caption_Assistant` (Publishing Copy & Tags)
- **Why it is included**: Generates platform-compliant captions, engagement questions, and algorithmic hashtags tailored for social discoverability across each repurposed post.
- **What it depends on**: Repurposed platform posts from Application 02.
- **What shared infrastructure it requires**: Model Gateway (Gemini Flash).
- **Direct integration vs Refactoring**: **Needs refactoring**. Original is written in Flask (Python). Its LCEL prompt logic will be ported into `app.modules.captions` in FastAPI, standardizing its multi-modal vision and text routing.

### 7. `09_CTA_Generator` (Conversion Engine)
- **Why it is included**: Closes the creator funnel by generating high-converting calls-to-action categorized by creator objective (Followers, Newsletter signups, Direct Messages, Product sales).
- **What it depends on**: Post context from Application 02 and creator goal.
- **What shared infrastructure it requires**: Model Gateway (Gemini Flash - replacing expensive Opus default).
- **Direct integration vs Refactoring**: **Needs refactoring**. Original is a Next.js server route using the Anthropic SDK. Its goal-oriented heuristic rules and prompt schemas will be ported into `app.modules.cta` in FastAPI.

---

## Phased Rollout Plan

### PHASE 1: The Core Creation Engine (MVP)
- **Focus**: The 7 applications detailed above.
- **Infrastructure Established**:
  - Unified Next.js 15 frontend with shared design system.
  - Python FastAPI modular monolith backend.
  - PostgreSQL 16 database for users, projects, and content items.
  - Better Auth session layer with PostgreSQL adapter.
  - Model Gateway for Google Gemini (`gemini-2.0-flash`).
  - LangSmith tracing integration.
- **Dependencies**: `fastapi`, `uvicorn`, `pydantic`, `sqlalchemy`, `next ^15`, `react ^19`, `google-genai`.

---

### PHASE 2: Production & Trend Intelligence
- **Applications Integrated**:
  1. `18_AI_Content_Director_Guruvelah` (Trend ingestion & generation history)
  2. `07_Thumbnail_Ideator` (Cover concepts & visual direction)
  3. `14_Podcast_Assistant` (Transcript chaptering & highlights)
  4. `15_Creator_Workspace` (Kanban production board)
  5. `17_Brand_Pitch_Builder` (Sponsorship proposals & rate cards)
- **Infrastructure Added**:
  - Trend scraping background cron job.
  - PDF generation engine for pitch proposals (`reportlab`).
  - Canvas preview rendering for thumbnails.

---

### PHASE 3: Audience Intelligence & The Second Brain
- **Applications Integrated**:
  1. `10_Comment_Analyzer` (Sentiment & brand sponsorship detection)
  2. `11_Comment_to_Content` (Semantic clustering & demand scoring)
  3. `13_Voice_Replicator` (Creator voice fingerprint & draft validation)
  4. `19_Creator_Second_Brain` (Channel ingestion & multi-agent supervisor chat)
  5. `16_Content_Recycler` (Decay analysis & evergreen scheduler)
- **Infrastructure Added**:
  - PostgreSQL `pgvector` vector database.
  - `fastembed` local embedding generation.
  - Meta Instagram Graph API and YouTube Data API connectors.

---

### PHASE 4: Autonomous Pipelines & Media Studio
- **Applications Integrated**:
  1. `21_Autonomous_Content_Pipeline` (LangGraph autonomous campaign runner)
  2. `06_Clip_Finder` (FFmpeg + Faster-Whisper automated clip cutting)
  3. `20_AI_Screenplay_Workspace` (Long-form narrative screenplays)
  4. `26_Creator_Collaboration_Finder` (Deterministic creator matchmaking)
- **Infrastructure Added**:
  - Dedicated Celery / Redis asynchronous worker queue with GPU/CPU instances.
  - System binaries (`ffmpeg`, `yt-dlp`) and Faster-Whisper speech models.
  - Cloudflare R2 direct video upload pipelines.
