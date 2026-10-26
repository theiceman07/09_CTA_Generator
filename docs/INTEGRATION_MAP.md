# Master Application Integration Map

Detailed technical integration specifications for all 24 applications in the repository.

---

### Application 01: Content Idea Generator
- **Branch**: `01_Content_Idea_Generator`
- **Purpose**: Generates 10 structured YouTube video concepts based on topic and target audience.
- **Category**: CATEGORY B — SHARED AI SERVICE
- **Frontend**: Vanilla HTML/CSS/JS (`index.html`, `app.js`)
- **Backend**: Node.js Express (`server/index.js`)
- **Language**: JavaScript
- **AI Model**: Google Gemini (`ChatGoogleGenerativeAI`)
- **AI Framework**: LangChain (`@langchain/google-genai`, `@langchain/core`, `zod`)
- **Database**: None
- **Storage**: In-Memory
- **Authentication**: None
- **API**: `POST /api/generate`
- **LLM Calls**: 1 synchronous call
- **Dependencies**: `@langchain/google-genai`, `express`, `zod`, `cors`, `dotenv`
- **Module or Service**: Shared AI Service
- **Integration Difficulty**: Low (Simple prompt and schema port)
- **Dependencies on Other Apps**: None
- **Recommended Integration Method**: Migrate prompt and Zod schema into core Ideation domain service (`POST /api/v1/ideation/ideas`).
- **MVP Phase**: Phase 1

---

### Application 02: Content Repurposer
- **Branch**: `02_Content_Repurposer`
- **Purpose**: Converts one content draft into platform-optimized posts for LinkedIn, Instagram, X, and YouTube.
- **Category**: CATEGORY A — CORE MODULE
- **Frontend**: React 19 (Vite)
- **Backend**: FastAPI (Python)
- **Language**: Python, JavaScript
- **AI Model**: `gemini-3.1-flash-lite`
- **AI Framework**: LangChain (`langchain-google-genai`, `langchain-core`)
- **Database**: None
- **Storage**: In-Memory
- **Authentication**: None
- **API**: `POST /api/generate`
- **LLM Calls**: 2 to 5 calls (Sequential analysis + Parallel platform fan-out)
- **Dependencies**: `fastapi`, `uvicorn`, `pydantic`, `langchain-google-genai`
- **Module or Service**: Core Module
- **Integration Difficulty**: Very Low (Already built on FastAPI & Pydantic)
- **Dependencies on Other Apps**: Acts as core receiver for Apps 01, 11, 12, 14
- **Recommended Integration Method**: Direct foundation of the backend Repurposing domain (`POST /api/v1/repurpose`).
- **MVP Phase**: Phase 1 (First application integrated)

---

### Application 03: Hook Generator
- **Branch**: `03_Hook_Generator`
- **Purpose**: Generates 10 psychological scroll-stopping hooks with strict statistical safety rules.
- **Category**: CATEGORY B — SHARED AI SERVICE
- **Frontend**: Next.js 15 (React 19, TSX)
- **Backend**: Next.js Server Route (`src/app/api/generate-hooks/route.ts`)
- **Language**: TypeScript
- **AI Model**: `gemini-2.5-pro`
- **AI Framework**: LangChain (`@langchain/google-genai`, `@langchain/core`)
- **Database**: None
- **Storage**: In-Memory
- **Authentication**: None
- **API**: `POST /api/generate-hooks`
- **LLM Calls**: 1 synchronous call
- **Dependencies**: `next`, `react`, `@langchain/google-genai`, `@langchain/core`, `lucide-react`
- **Module or Service**: Shared AI Service
- **Integration Difficulty**: Low
- **Dependencies on Other Apps**: None
- **Recommended Integration Method**: Port prompt template and Zod schema into Studio Hook Service (`POST /api/v1/studio/hooks`).
- **MVP Phase**: Phase 1

---

### Application 04: Daily Content Planner
- **Branch**: `04_Daily_Content_Planner`
- **Purpose**: Formulates daily content plans based on niche, daily goal, and available time.
- **Category**: CATEGORY D — WORKSPACE / PLATFORM FEATURE
- **Frontend**: Next.js 14 (React 18, Framer Motion, Three.js)
- **Backend**: Client-side Next.js
- **Language**: TypeScript
- **AI Model**: None (Rule templates)
- **AI Framework**: None
- **Database**: None (LocalStorage)
- **Storage**: LocalStorage
- **Authentication**: None
- **API**: Client-side routes
- **LLM Calls**: 0
- **Dependencies**: `next`, `react`, `framer-motion`, `@react-three/fiber`
- **Module or Service**: Workspace Feature
- **Integration Difficulty**: Moderate (Missing source files require rewriting template engine)
- **Dependencies on Other Apps**: Connects with App 16 and 21 for calendar scheduling
- **Recommended Integration Method**: Rebuild calendar UI and connect to PostgreSQL publishing schedule table.
- **MVP Phase**: Phase 2

---

### Application 05: Reel Script Builder
- **Branch**: `05_Reel_Script_Builder`
- **Purpose**: Creates 30-60 second short-form reel scripts with visual timeline cues and narration.
- **Category**: CATEGORY A — CORE MODULE
- **Frontend**: Vanilla HTML/JS
- **Backend**: FastAPI (Python)
- **Language**: Python, HTML
- **AI Model**: `gemini-3.8-flash`
- **AI Framework**: LangChain + LangSmith (`langchain-core`, `langchain-google-genai`, `langsmith`)
- **Database**: None
- **Storage**: In-Memory
- **Authentication**: None
- **API**: `POST /api/generate-script`
- **LLM Calls**: 1 synchronous call
- **Dependencies**: `fastapi`, `uvicorn`, `pydantic`, `langchain-core`, `langchain-google-genai`, `langsmith`
- **Module or Service**: Core Module
- **Integration Difficulty**: Very Low
- **Dependencies on Other Apps**: Can consume hooks from App 03 and CTAs from App 09
- **Recommended Integration Method**: Incorporate into Scripting Suite (`POST /api/v1/studio/reels`).
- **MVP Phase**: Phase 1

---

### Application 06: Clip Finder
- **Branch**: `06_Clip_Finder`
- **Purpose**: Extracts viral short clips from long videos using Whisper audio transcription, LLM analysis, and FFmpeg slicing.
- **Category**: CATEGORY C — SPECIALIZED SERVICE
- **Frontend**: Streamlit
- **Backend**: FastAPI / Python CLI
- **Language**: Python
- **AI Model**: `llama3.2` (Ollama) + `faster-whisper`
- **AI Framework**: Direct REST to Ollama + Faster-Whisper
- **Database**: SQLite (`app/db.py`)
- **Storage**: Local filesystem (`data/uploads`, `data/clips`)
- **Authentication**: None
- **API**: Streamlit interface
- **LLM Calls**: 1 per video transcript
- **Dependencies**: `faster-whisper`, `ffmpeg`, `yt-dlp`, `fastapi`, `streamlit`
- **Module or Service**: Specialized Asynchronous Worker Service
- **Integration Difficulty**: High (Requires system FFmpeg binary and background queue)
- **Dependencies on Other Apps**: Ingests transcripts for App 14 and App 19
- **Recommended Integration Method**: Isolate as a Celery/Redis worker reading from S3/R2 presigned uploads.
- **MVP Phase**: Phase 4

---

### Application 07: Thumbnail Ideator
- **Branch**: `07_Thumbnail_Ideator`
- **Purpose**: Generates high-impact visual thumbnail and cover concepts for YouTube and Reels.
- **Category**: CATEGORY B — SHARED AI SERVICE
- **Frontend**: Next.js 14 (React 18, Tailwind, `html-to-image`)
- **Backend**: Next.js Server Route
- **Language**: TypeScript
- **AI Model**: `gemini-2.5-flash`
- **AI Framework**: Google GenAI SDK (`@google/genai`) + Zod
- **Database**: None
- **Storage**: In-Memory / Client Canvas
- **Authentication**: None
- **API**: `POST /api/generate`
- **LLM Calls**: 1 synchronous call
- **Dependencies**: `@google/genai`, `html-to-image`, `next`, `react`, `zod`
- **Module or Service**: Shared AI Service
- **Integration Difficulty**: Low
- **Dependencies on Other Apps**: Consumes video titles from Apps 01, 02, 05
- **Recommended Integration Method**: Integrate into Production Studio (`POST /api/v1/studio/thumbnails`).
- **MVP Phase**: Phase 2

---

### Application 08: Caption Assistant
- **Branch**: `08_Caption_Assistant`
- **Purpose**: Generates 4 styles of platform captions from text or uploaded photos (using Vision LLM).
- **Category**: CATEGORY B — SHARED AI SERVICE
- **Frontend**: Vanilla HTML/JS/CSS
- **Backend**: Flask (Python)
- **Language**: Python, JavaScript
- **AI Model**: `gemini-3.8-flash` / Ollama / Claude
- **AI Framework**: LangChain Core (LCEL, `PydanticOutputParser`)
- **Database**: None
- **Storage**: Local temporary cache
- **Authentication**: None
- **API**: `POST /api/generate-captions`
- **LLM Calls**: 1 to 2 calls (Vision description -> Caption generation)
- **Dependencies**: `flask`, `requests`, `python-dotenv`, `langchain-core`, `pydantic`
- **Module or Service**: Shared AI Service
- **Integration Difficulty**: Low
- **Dependencies on Other Apps**: Supports App 02 and 21
- **Recommended Integration Method**: Port LCEL chain into FastAPI Studio router (`POST /api/v1/studio/captions`).
- **MVP Phase**: Phase 1

---

### Application 09: CTA Generator
- **Branch**: `09_CTA_Generator`
- **Purpose**: Generates contextual, goal-aligned calls-to-action with urgency levels and framework types.
- **Category**: CATEGORY B — SHARED AI SERVICE
- **Frontend**: Next.js 15 (React 19, Three.js shaders)
- **Backend**: Next.js Server Route
- **Language**: TypeScript
- **AI Model**: `claude-opus-5` / `claude-sonnet-5` (with rule fallback)
- **AI Framework**: Anthropic SDK + Zod + Rate limiter
- **Database**: None (IndexedDB on client)
- **Storage**: Client IndexedDB
- **Authentication**: None
- **API**: `POST /api/generate`
- **LLM Calls**: 1 call
- **Dependencies**: `@anthropic-ai/sdk`, `next`, `react`, `zod`, `@react-three/fiber`
- **Module or Service**: Shared AI Service
- **Integration Difficulty**: Low
- **Dependencies on Other Apps**: Consumed by Apps 02, 05, 21
- **Recommended Integration Method**: Port prompt logic to Gemini Flash for cost efficiency (`POST /api/v1/studio/ctas`).
- **MVP Phase**: Phase 1

---

### Application 10: Comment Analyzer
- **Branch**: `10_Comment_Analyzer`
- **Purpose**: Ingests Instagram comments and categorizes them into Themes, Questions, Complaints, and Opportunities.
- **Category**: CATEGORY A — CORE MODULE
- **Frontend**: Vanilla HTML/JS
- **Backend**: Express (Node.js)
- **Language**: JavaScript
- **AI Model**: Gemini via `@google/genai`
- **AI Framework**: `@google/genai`
- **Database**: SQLite (`better-sqlite3`)
- **Storage**: Local SQLite file
- **Authentication**: None
- **API**: `POST /api/analyze-post`
- **LLM Calls**: `ceil(N/25)` batch calls
- **Dependencies**: `@google/genai`, `better-sqlite3`, `express`
- **Module or Service**: Core Module
- **Integration Difficulty**: Moderate
- **Dependencies on Other Apps**: Feeds audience intelligence into App 11 and App 01
- **Recommended Integration Method**: Port batch classification into Audience Intelligence domain (`POST /api/v1/audience/analyze`).
- **MVP Phase**: Phase 3

---

### Application 11: Comment-to-Content
- **Branch**: `11_Comment_to_Content`
- **Purpose**: Full NLP & ML pipeline converting audience comments into clustered themes, demand scores, gap analysis, and content ideas.
- **Category**: CATEGORY E — ORCHESTRATOR / AUTOMATION
- **Frontend**: Next.js 16 (React 19, Recharts)
- **Backend**: FastAPI (Python)
- **Language**: Python, TypeScript
- **AI Model**: `claude-3-7-sonnet` + `sentence-transformers`
- **AI Framework**: Anthropic SDK + Scikit-Learn / HDBSCAN
- **Database**: SQLite (`comidea.db`)
- **Storage**: Local SQLite file
- **Authentication**: None
- **API**: `POST /api/pipeline/run`, `GET /api/ideas`, `GET /api/clusters`
- **LLM Calls**: 2 to 4 calls per pipeline run
- **Dependencies**: `fastapi`, `sqlalchemy`, `anthropic`, `sentence-transformers`, `scikit-learn`, `hdbscan`
- **Module or Service**: Orchestrator Pipeline
- **Integration Difficulty**: Moderate
- **Dependencies on Other Apps**: Consumes comments from App 10; feeds ideas to App 01 & 02
- **Recommended Integration Method**: Migrate SQLite tables to PostgreSQL and integrate pipeline into Ideation Hub.
- **MVP Phase**: Phase 3

---

### Application 12: Creator Research Assistant
- **Branch**: `12_Creator_Research_Assistant`
- **Purpose**: Researches topics into verified facts, contrarian angles, statistics, and sources.
- **Category**: CATEGORY B — SHARED AI SERVICE
- **Frontend**: Next.js 16 (React 19)
- **Backend**: Next.js Server Route
- **Language**: TypeScript
- **AI Model**: `gemini-2.5-flash`
- **AI Framework**: Google GenAI SDK
- **Database**: None
- **Storage**: Client state
- **Authentication**: None
- **API**: `POST /api/research`
- **LLM Calls**: 1 synchronous call
- **Dependencies**: `next`, `react`, `lucide-react`
- **Module or Service**: Shared AI Service
- **Integration Difficulty**: Very Low
- **Dependencies on Other Apps**: Feeds facts into Apps 01, 02, 18, 21
- **Recommended Integration Method**: Embed into Ideation & Studio as Research Dossier service (`POST /api/v1/ideation/research`).
- **MVP Phase**: Phase 1

---

### Application 13: Voice Replicator
- **Branch**: `13_Voice_Replicator`
- **Purpose**: Extracts stylistic fingerprint from creator history (text + image OCR) and validates generated drafts against voice vectors.
- **Category**: CATEGORY D — WORKSPACE / PLATFORM FEATURE
- **Frontend**: Next.js 16 (React 19)
- **Backend**: FastAPI (Python)
- **Language**: Python, TypeScript
- **AI Model**: `gemini-2.5-flash` + `all-MiniLM-L6-v2`
- **AI Framework**: Google GenAI SDK, spaCy, Scikit-Learn, EasyOCR
- **Database**: PostgreSQL with `pgvector` (SQLite fallback)
- **Storage**: Local DB & images
- **Authentication**: None
- **API**: `POST /api/analysis/style`, `POST /api/generation/draft`, `POST /api/validation/evaluate`
- **LLM Calls**: 2 calls per draft (Generation + Validation)
- **Dependencies**: `fastapi`, `sqlalchemy`, `alembic`, `pgvector`, `google-genai`, `easyocr`, `sentence-transformers`
- **Module or Service**: Workspace Platform Feature
- **Integration Difficulty**: Moderate - High
- **Dependencies on Other Apps**: Provides style prompt conditioning for Apps 02, 05, 08, 18, 21
- **Recommended Integration Method**: Incorporate into central Creator Voice Vault connected to PostgreSQL `pgvector`.
- **MVP Phase**: Phase 3

---

### Application 14: Podcast Assistant
- **Branch**: `14_Podcast_Assistant`
- **Purpose**: Generates titles, SEO descriptions, timestamped chapters, and highlights from transcripts.
- **Category**: CATEGORY A — CORE MODULE
- **Frontend**: Next.js 14 (React 18)
- **Backend**: Next.js Server Route
- **Language**: TypeScript
- **AI Model**: `gemini-1.5-flash` / `gemini-3.8-flash`
- **AI Framework**: Direct Gemini JSON schema fetch
- **Database**: None
- **Storage**: In-Memory
- **Authentication**: None
- **API**: `POST /api/analyze`
- **LLM Calls**: 1 synchronous call
- **Dependencies**: `next`, `react`, `lucide-react`
- **Module or Service**: Core Module
- **Integration Difficulty**: Very Low
- **Dependencies on Other Apps**: Can receive transcripts from App 06
- **Recommended Integration Method**: Port to Audio/Podcast domain module (`POST /api/v1/audio/analyze-podcast`).
- **MVP Phase**: Phase 2

---

### Application 15: Creator Workspace
- **Branch**: `15_Creator_Workspace`
- **Purpose**: Interactive Kanban production board organizing content stages (Idea -> Research -> Script -> Published).
- **Category**: CATEGORY D — WORKSPACE / PLATFORM FEATURE
- **Frontend**: React 18 (Vite, React Router)
- **Backend**: Express (Node.js)
- **Language**: JavaScript
- **AI Model**: `gemini-3.5-flash-lite`
- **AI Framework**: `@google/generative-ai`
- **Database**: None (in-memory mock)
- **Storage**: None
- **Authentication**: None
- **API**: `POST /api/gemini/generate`
- **LLM Calls**: 1 call per stage action
- **Dependencies**: `express`, `@google/generative-ai`, `react`, `react-router-dom`
- **Module or Service**: Workspace Feature
- **Integration Difficulty**: Low
- **Dependencies on Other Apps**: Organizes assets from Apps 01, 02, 05, 08
- **Recommended Integration Method**: Port Kanban UI into the unified project dashboard connected to `content_items` table.
- **MVP Phase**: Phase 2

---

### Application 16: Content Recycler
- **Branch**: `16_Content_Recycler`
- **Purpose**: Evaluates engagement decay on historical posts and categorizes them into Repost, Rework, Repurpose, or Archive.
- **Category**: CATEGORY A — CORE MODULE
- **Frontend**: React 19 (Vite, Recharts)
- **Backend**: Express (Node.js)
- **Language**: JavaScript
- **AI Model**: None (Algorithmic decay & TF-IDF similarity)
- **AI Framework**: Custom algorithmic engine
- **Database**: MongoDB (In-memory fallback)
- **Storage**: MongoDB / Memory
- **Authentication**: JWT Auth (`jsonwebtoken`, `bcryptjs`)
- **API**: `GET /api/recommendations`, `POST /api/similarity`
- **LLM Calls**: 0
- **Dependencies**: `express`, `mongoose`, `jsonwebtoken`, `react`, `recharts`
- **Module or Service**: Core Module
- **Integration Difficulty**: Low - Moderate (Port math logic from JS to Python)
- **Dependencies on Other Apps**: Feeds reworked content back into App 02
- **Recommended Integration Method**: Migrate decay math to Python backend and store metrics in `post_analytics` table.
- **MVP Phase**: Phase 3

---

### Application 17: Brand Pitch Builder
- **Branch**: `17_Brand_Pitch_Builder`
- **Purpose**: Builds personalized sponsorship proposals, calculates brand alignment scores, and exports PDF pitches.
- **Category**: CATEGORY A — CORE MODULE
- **Frontend**: React 18 (Vite, `html2pdf.js`, Canvas Confetti)
- **Backend**: Express (Node.js)
- **Language**: JavaScript
- **AI Model**: Google Gemini
- **AI Framework**: LangChain (`@langchain/google-genai`, `@langchain/core`)
- **Database**: SQLite (`node:sqlite`)
- **Storage**: Local SQLite file
- **Authentication**: None
- **API**: `POST /api/ai/analyze-alignment`, `POST /api/ai/generate-proposal`
- **LLM Calls**: 2 sequential calls
- **Dependencies**: `@langchain/google-genai`, `express`, `react`, `html2pdf.js`
- **Module or Service**: Core Module
- **Integration Difficulty**: Low
- **Dependencies on Other Apps**: Uses creator analytics from App 16 and profile from App 13
- **Recommended Integration Method**: Integrate into Growth & Monetization hub (`POST /api/v1/growth/brand-proposal`).
- **MVP Phase**: Phase 2

---

### Application 18: AI Content Director
- **Branch**: `18_AI_Content_Director`
- **Purpose**: Cascading 7-stage production pipeline from research to shot list and publishing copy.
- **Category**: CATEGORY E — ORCHESTRATOR / AUTOMATION
- **Frontend**: Next.js 14 (React 18, Tailwind)
- **Backend**: Next.js Server Route
- **Language**: TypeScript
- **AI Model**: `claude-3-5-sonnet-20241022`
- **AI Framework**: Anthropic SDK (`@anthropic-ai/sdk`) + Zod
- **Database**: None
- **Storage**: In-Memory
- **Authentication**: None
- **API**: `POST /api/pipeline/generate`
- **LLM Calls**: 7 sequential calls
- **Dependencies**: `@anthropic-ai/sdk`, `next`, `react`, `zod`
- **Module or Service**: Orchestrator Workflow
- **Integration Difficulty**: Moderate
- **Dependencies on Other Apps**: Merges with 18G and 21
- **Recommended Integration Method**: Implement as a guided multi-step wizard in Production Studio with Gemini Flash optimization.
- **MVP Phase**: Phase 2

---

### Application 18G: AI Content Director (Guruvelah Edition)
- **Branch**: `18_AI_Content_Director_Guruvelah`
- **Purpose**: Full-stack SaaS application with trend ingestion, quota management, generation history, duplicate, and regenerate.
- **Category**: CATEGORY A — CORE MODULE
- **Frontend**: Next.js 15 (React 19, Tailwind, Radix UI)
- **Backend**: Next.js Server Routes
- **Language**: TypeScript
- **AI Model**: `gemini-3.5-flash-lite`, `gemini-1.5-pro`
- **AI Framework**: Google GenAI SDK (`@google/genai`)
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **API**: `POST /api/generate-content`, `GET /api/generations`, `POST /api/generations/:id/regenerate`
- **LLM Calls**: 3 to 4 parallel calls
- **Dependencies**: `@google/genai`, `@supabase/supabase-js`, `@supabase/ssr`, `next`, `react`, `zod`
- **Module or Service**: Core Module
- **Integration Difficulty**: Low (Clean production code patterns)
- **Dependencies on Other Apps**: Feeds into App 02 and 15
- **Recommended Integration Method**: Adopt its schema and router structure as the blueprint for the unified SaaS backend.
- **MVP Phase**: Phase 2

---

### Application 19: Creator Second Brain
- **Branch**: `19_Creator_Second_Brain`
- **Purpose**: Knowledge vault ingesting entire YouTube channels, deploying a Supervisor Agent routing queries to 5 specialists over SSE chat with knowledge graph visualization.
- **Category**: CATEGORY D — WORKSPACE / PLATFORM FEATURE
- **Frontend**: Next.js 16 (React 19, `react-force-graph-2d`, Recharts)
- **Backend**: FastAPI (Python)
- **Language**: Python, TypeScript
- **AI Model**: `llama-3.3-70b-versatile` (Groq)
- **AI Framework**: LangChain + LangGraph (`langchain`, `langchain-groq`, `langgraph`, `fastembed`)
- **Database**: PostgreSQL + `pgvector` + SQLite
- **Storage**: PostgreSQL + Vector DB
- **Authentication**: None
- **API**: `POST /api/channels/{id}/agent/chat` (SSE), `GET /api/graph`
- **LLM Calls**: 2 to 4 calls per turn
- **Dependencies**: `fastapi`, `SQLAlchemy`, `pgvector`, `langchain-groq`, `langgraph`, `fastembed`
- **Module or Service**: Workspace Feature & Agent Service
- **Integration Difficulty**: Moderate - High
- **Dependencies on Other Apps**: Provides semantic recall for all studio creation modules
- **Recommended Integration Method**: Integrate into Creator Knowledge Vault with pgvector.
- **MVP Phase**: Phase 3

---

### Application 20: AI Screenplay Workspace
- **Branch**: `20_AI_Screenplay_Workspace`
- **Purpose**: Screenplay writing workspace maintaining character bible and scene continuity across acts using vector memory.
- **Category**: CATEGORY A — CORE MODULE
- **Frontend**: Next.js 16 (React 19)
- **Backend**: FastAPI (Python)
- **Language**: Python, TypeScript
- **AI Model**: `gemini-1.5-pro-latest` / `gpt-4o`
- **AI Framework**: LangChain + LangGraph + ChromaDB
- **Database**: ChromaDB + MongoDB (`motor`) + Neo4j driver
- **Storage**: ChromaDB + Local files
- **Authentication**: None
- **API**: `POST /api/upload-script`, `POST /api/generate-scene`
- **LLM Calls**: 2 to 3 calls per scene
- **Dependencies**: `fastapi`, `langchain`, `langgraph`, `chromadb`, `motor`
- **Module or Service**: Core Module
- **Integration Difficulty**: Moderate
- **Dependencies on Other Apps**: Connects with App 19 for knowledge retrieval
- **Recommended Integration Method**: Migrate ChromaDB vector store into unified PostgreSQL `pgvector`.
- **MVP Phase**: Phase 4

---

### Application 21: Autonomous Content Pipeline
- **Branch**: `21_Autonomous_Content_Pipeline`
- **Purpose**: Monorepo orchestrating end-to-end campaigns: Seed Idea -> Web Research -> YouTube Script -> 3 Reels -> LinkedIn -> X -> Publishing Calendar.
- **Category**: CATEGORY E — ORCHESTRATOR / AUTOMATION
- **Frontend**: Next.js 16 (React 19, Radix UI, Framer Motion)
- **Backend**: Fastify (Node.js) running LangGraph
- **Language**: TypeScript
- **AI Model**: `gemini-3.8-flash`, `gpt-4o`
- **AI Framework**: LangGraph (`@langchain/langgraph`, `@langchain/core`)
- **Database**: MongoDB (`mongodb`, `@better-auth/mongo-adapter`)
- **Storage**: MongoDB
- **Authentication**: Better Auth (`better-auth`)
- **API**: `POST /api/runs`, `GET /api/runs/:runId/events` (SSE)
- **LLM Calls**: 6 to 9 calls per run
- **Dependencies**: `@langchain/langgraph`, `@google/genai`, `openai`, `mongodb`, `better-auth`
- **Module or Service**: Orchestrator
- **Integration Difficulty**: Moderate - High
- **Dependencies on Other Apps**: Integrates capabilities of Apps 01, 02, 03, 05, 08, 09, 12
- **Recommended Integration Method**: Serve as the flagship Autonomous Campaign Runner engine in the SaaS platform.
- **MVP Phase**: Phase 4

---

### Application 22: AI Creative Producer
- **Branch**: `22_AI_Creative_Producer`
- **Purpose**: Challenge description: 30-day strategy and daily content adaptation based on performance data.
- **Category**: CATEGORY E — ORCHESTRATOR / AUTOMATION
- **Frontend**: None (Starter repo only)
- **Backend**: None (Starter repo only)
- **Language**: None
- **AI Model**: None
- **AI Framework**: None
- **Database**: None
- **Storage**: None
- **Authentication**: None
- **API**: None
- **LLM Calls**: 0
- **Dependencies**: None
- **Module or Service**: Orchestrator (Synthesized)
- **Integration Difficulty**: N/A (Unsubmitted)
- **Dependencies on Other Apps**: Fulfilled via combination of 04, 16, 18G, 21
- **Recommended Integration Method**: Realize the challenge goal by synthesizing Application 04 (Daily Planner), 16 (Recycler), 18G (Trend Engine), and 21 (Autonomous Pipeline).
- **MVP Phase**: Phase 4

---

### Application 26: Creator Collaboration Finder
- **Branch**: `26_Creator_Collaboration_Finder`
- **Purpose**: Client-side creator matchmaking engine calculating 100-point synergy scores and drafting outreach messages.
- **Category**: CATEGORY D — WORKSPACE / PLATFORM FEATURE
- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Backend**: None (Pure Client-side)
- **Language**: JavaScript, HTML, CSS
- **AI Model**: None (Deterministic Jaccard algorithm)
- **AI Framework**: None
- **Database**: None (LocalStorage)
- **Storage**: LocalStorage
- **Authentication**: None
- **API**: None (DOM events)
- **LLM Calls**: 0
- **Dependencies**: None
- **Module or Service**: Workspace Feature
- **Integration Difficulty**: Very Low
- **Dependencies on Other Apps**: None
- **Recommended Integration Method**: Port JavaScript matching engine into Growth & Networking hub.
- **MVP Phase**: Phase 4
