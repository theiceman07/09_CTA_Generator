# Unified SaaS Technical Architecture (Standardized)

## Conceptual Topology

```text
                             CREATOR CLIENT
                    (Next.js 15 LTS + React 19 UI)
                                  │
                                  ▼ HTTPS / REST
                       API GATEWAY & AUTH LAYER
                    (FastAPI Modular Monolith)
                                  │
         +────────────────────────┼────────────────────────+
         │                                                 │
         ▼                                                 ▼
CORE REST APPLICATION MODULES                   MEDIA PROCESSING WORKER
(24 Standardized Capabilities)                  (Async Celery / FFmpeg Worker)
  ├── Content Repurposer (Active)                 ├── Audio Extraction
  ├── Ideation & Hooks (Planned)                  ├── Faster-Whisper Transcription
  ├── Scripting, Captions, CTAs                   ├── Clip Slicing & Encoding
  ├── Second Brain (pgvector)                     └── Image Generation Pipelines
  └── Director & Screenplay                                │
         │                                                 │
         ├─────────────────────────────────────────────────┤
         ▼                                                 ▼
   LANGCHAIN APPLICATION LAYER                   STORAGE & ASSET LAYER
(Specialized Chains & Workflows)              (S3 / Cloudflare R2 Buckets)
  ├── Repurposing Chain (Active)                           │
  ├── Ideation & Hook Chains                               │
  ├── Screenplay & Story Chains                            │
  └── LangGraph ONLY where stateful                        │
         │                                                 │
         ▼                                                 │
   CENTRALIZED GEMINI SERVICE                              │
  (app.ai.gemini.service)                                  │
         │                                                 │
         ▼                                                 │
   GOOGLE GEMINI API ONLY                                  │
  (gemini-3.1-flash-lite)                                  │
         │                                                 │
         ├────────────────────────┬────────────────────────┤
         ▼                        ▼                        ▼
PRIMARY POSTGRESQL 16           REDIS                  LANGSMITH
(Relational, pgvector, JSONB)   (Cache, Celery Queue)  (Observability & Traces)
```

---

## System Layer Specifications

### Layer 1: Frontend Client
- **Framework**: Next.js 15 LTS (App Router) + React 19 + TypeScript.
- **Styling**: Tailwind CSS + curated dark theme tokens.
- **State Management**: TanStack Query for server state; local React state for editor workflows.
- **Application Registry**: Standardized `frontend/lib/registry.ts` defining all 24 creator capabilities.

### Layer 2: API Gateway & Authentication
- **Authentication**: Centralized JWT authentication with Better Auth integration; server-side token validation via FastAPI `get_current_user` dependency.
- **Authorization**: Strict project-level tenant isolation enforced on every protected endpoint.
- **Protocol**: RESTful HTTP/2 JSON APIs.

### Layer 3: Application Services (Modular Monolith)
- **Primary Backend**: Python **FastAPI** modular monolith.
- **Module Structure**:
  ```text
  modules/
  ├── content_repurposer/
  ├── content_idea_generator/
  ├── hook_generator/
  ├── reel_script_builder/
  └── ... (24 total modules)
  ```

### Layer 4: AI Architecture (Hard Standard: Gemini Only)
- **LLM Provider**: **Google Gemini API ONLY**. No OpenAI, Anthropic, local LLMs, or multi-provider switching abstractions.
- **Standardized Model**: **`gemini-3.1-flash-lite`** across all applications.
- **Service Access**: Centralized singleton `CentralGeminiService` (`app.ai.gemini.service`).
- **AI Framework**: **LangChain** for application-level specialized chains and structured output generation.
- **LangGraph Rule**: LangGraph is restricted ONLY to workflows with genuine state, loops, or multi-stage autonomous branching (e.g., Autonomous Content Pipeline).
- **Observability**: **LangSmith** tracing active for prompts, latency, token usage, and regression evaluation.

### Layer 5: Data & Media Layer
- **Relational Database**: **PostgreSQL 16**.
- **Vector Search**: **pgvector** extension on PostgreSQL for semantic search (Creator Second Brain).
- **Cache & Queue**: **Redis 7** message broker with **Celery** workers for asynchronous media transcoding.
- **Object Storage**: S3-compatible / Cloudflare R2 bucket for video and media assets.
