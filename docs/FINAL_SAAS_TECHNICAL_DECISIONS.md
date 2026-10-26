# Final SaaS Technical Decisions

## Frontend
Decision: Next.js 15 LTS (App Router) with React 19, TypeScript, and Vanilla CSS Design Tokens augmented with Tailwind CSS.
Reason: Next.js is already the chosen framework across 13 student branches (`03`, `04`, `07`, `09`, `11`, `12`, `13`, `14`, `18`, `18G`, `19`, `20`, `21`). Next.js 15 provides production LTS stability with React 19 support, avoiding the unstable canary branch of Next.js 16 found in branches 11, 12, 13, 19, 20, and 21. Standardizing on React 19 allows direct reuse of UI components from branches 02, 03, 11, 12, 13, 16, 18G, 19, 20, and 21 without conversion overhead.

## Backend
Decision: Python FastAPI Modular Monolith.
Reason: 7 branches (`02`, `05`, `06`, `11`, `13`, `19`, `20`) rely heavily on Python-native data science and ML libraries: `pgvector`, `sentence-transformers`, `fastembed`, `spacy`, `faster-whisper`, `scikit-learn`, `SQLAlchemy`, and `pydantic`. Node.js backends cannot natively execute these libraries without fragile subprocess calls. FastAPI provides high-throughput asynchronous execution, native OpenAPI documentation, and strict Pydantic contract validation.

## Database
Decision: PostgreSQL 16 with `pgvector` extension (SQLAlchemy ORM + Alembic migrations).
Reason: Unifies 5 fragmented storage engines (SQLite in 06, 10, 11, 17; MongoDB in 16, 20, 21; ChromaDB in 20; LocalStorage in 04, 26; PostgreSQL in 13, 18G, 19) into one ACID-compliant database. PostgreSQL handles relational user/project/team data, vector embeddings via `pgvector` (cosine similarity for Second Brain App 19 and Voice Replicator App 13), and semi-structured document payloads via JSONB (rendering MongoDB unnecessary).

## Authentication
Decision: Better Auth (self-hosted with PostgreSQL 16 adapter) at the Next.js API layer, issuing cryptographically signed JWTs validated by FastAPI via shared secret / JWKS.
Reason: Better Auth (successfully implemented in branch 21) avoids proprietary BaaS vendor lock-in (unlike Supabase Auth in 18G), stores authentication tables directly inside our primary PostgreSQL database, natively supports email/password, social OAuth (Google, GitHub), multi-factor auth, and organization/workspace multi-tenancy.

## Object Storage
Decision: Cloudflare R2 (S3-compatible API via `boto3` in Python and `@aws-sdk/client-s3` in Next.js).
Reason: Zero egress bandwidth fees are critical for a creator SaaS that ingests long videos (App 06), audio files (App 14), and serves high-resolution thumbnail images (App 07) and video clips. Standard S3 API compatibility ensures seamless integration with zero vendor lock-in.

## AI Model Strategy
Decision: Tri-Tier Model Hierarchy:
- Tier 1 (High-Speed / Utility): Google Gemini 2.0 Flash (`gemini-2.0-flash`) for ideation (01), hooks (03), captions (08), CTAs (09), research extraction (12), and comment sentiment (10).
- Tier 2 (Long-Context / Reasoning): Google Gemini 1.5 Pro / Claude 3.5 Haiku for long-form transcript chaptering (14), complex repurposing (02), and proposal creation (17). Native Gemini Context Caching enabled for inputs > 32k tokens.
- Tier 3 (Deep Creative / Multi-Turn): Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`) / GPT-4o reserved for master narrative scripting (18, 20) and high-stakes autonomous campaigns (21).
Reason: Prevents severe cost overruns identified in branches 09 (defaulting to expensive Opus for simple CTAs) and 18 (making 7 sequential Sonnet calls). Optimizes latency and token expenditure across high-volume vs high-complexity tasks.

## AI Framework Strategy
Decision: Dual AI Stack:
- Stateless / Single-Turn Generations: Direct Official Google GenAI SDK (`google-genai`) with Pydantic structured output.
- Stateful / Cyclical / Agentic Pipelines: LangGraph (Python) for multi-stage workflows (App 19, 20, 21).
Reason: Eliminates bloated LangChain wrapper abstractions and version breaking changes on simple one-shot prompts while retaining LangGraph's state machine, checkpointing, and human-in-the-loop validation for multi-step agent pipelines.

## AI Orchestration
Decision: Unified Internal Model Gateway (`app.ai.gateway`) with LangGraph State Machines.
Reason: Centralizes model routing, API key management, fallback retry logic, prompt versioning, structured output validation, and LangSmith tracing. LangGraph handles complex branching, supervisor routing (Second Brain), and self-correcting critic loops (Autonomous Pipeline).

## Media Processing
Decision: Dedicated Python Worker Container with FFmpeg (system binary) + `faster-whisper` (GPU/CPU accelerated).
Reason: Isolates C-binary execution and heavy video transcoding away from the web API event loop. Web requests never stall waiting for video rendering or speech transcription.

## Background Jobs
Decision: Celery + Redis.
Reason: Native Python asynchronous task queue perfectly suited for FastAPI backend, managing video clip extraction (06), podcast audio ingestion (14), social comment batch fetching (10, 11), and embedding generation (19).

## Observability
Decision: LangSmith for LLM Tracing + OpenTelemetry / Prometheus for HTTP & System Metrics.
Reason: LangSmith is already proven and partially implemented in branches 02 and 05. It provides token tracing, latency per chain node, input/output inspection, and error debugging. OpenTelemetry provides standard distributed tracing across the API gateway and background worker.

## Usage Tracking
Decision: Stripe Billing with Tiered Credits & Redis Token Bucket Metering.
Reason: Allows tracking exact LLM token and compute costs per user action, converting raw LLM consumption into unified "Creator Credits" stored in PostgreSQL with Redis atomic decrementing (`INCRBY` / `DECRBY`).

## MVP
Decision: Phase 1: The Core Creator Engine (7 Applications: 01, 12, 03, 05, 02, 08, 09).
Reason: Establishes an end-to-end, high-retention creator workflow: Idea (01) -> Research (12) -> Hook (03) -> Script (05) -> Repurpose (02) -> Caption (08) -> CTA (09). Solves the core daily friction for creators in under 60 seconds without requiring complex video rendering or external OAuth integrations on day one.

## Architecture
Decision: Option B: Modular Monolith + Specialized Asynchronous Services.
Reason: Delivers the optimal balance between rapid engineering velocity, low operational complexity, single unified database integrity, and complete isolation of heavy media-processing workloads. Avoids the catastrophic over-engineering of 24 microservices while preventing web API starvation.
