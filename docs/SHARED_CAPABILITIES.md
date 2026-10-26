# Shared Capabilities and Infrastructure

Across the 24 application branches, multiple independent implementations of identical foundational infrastructure were discovered. This document inventories every duplicated capability, identifies which applications implement it, assesses current technical approaches, and defines the unified architecture solution.

---

## Duplicated Infrastructure Matrix

### 1. Capability: Google Gemini API Initialization & Client Management
- **Applications Using It**: `01`, `02`, `03`, `05`, `07`, `08`, `10`, `12`, `13`, `14`, `15`, `17`, `18G`, `20`, `21`.
- **Current Implementations**:
  - `01`, `03`, `17`: Use `@langchain/google-genai` in Node.js.
  - `02`, `05`, `20`: Use `langchain-google-genai` in Python.
  - `07`, `10`, `18G`, `21`: Use new `@google/genai` (v0.14 - v2.24) in Node.js.
  - `13`: Uses `google-genai` in Python.
  - `15`: Uses legacy `@google/generative-ai` in Node.js.
  - `08`: Direct HTTP requests to `generativelanguage.googleapis.com`.
  - `14`: Direct fetch call to REST API.
- **Recommended Shared Solution**: Unified Model Gateway service (`ModelClient`) with automatic connection pooling, exponential backoff, rate limiting, and fallback routing.
- **Reason**: 5 different libraries and 2 raw HTTP implementations currently exist across the codebase. Unifying into one client eliminates conflicting SDKs and centralizes API key management.

---

### 2. Capability: Environment Variable & API Key Handling
- **Applications Using It**: All 24 branches.
- **Current Implementations**:
  - Python applications use `python-dotenv` with varying variable names (`GEMINI_API_KEY`, `GOOGLE_API_KEY`, `LLM_API_KEY`, `ANTHROPIC_API_KEY`).
  - Next.js applications access `process.env.GEMINI_API_KEY`.
  - Node.js Express applications use `dotenv.config()`.
  - Security vulnerability: Potential secret leaks discovered in source files on branches 12, 17, 18, 20.
- **Recommended Shared Solution**: Centralized, schema-validated configuration module using Pydantic Settings (Python) or Zod (TypeScript) reading from a single root `.env` or cloud secret manager, strictly enforcing redaction in logs and error responses.
- **Reason**: Prevents credential leaks, ensures uniform variable naming, and guarantees that client-side bundles never expose secrets.

---

### 3. Capability: CORS Middleware & Security Headers
- **Applications Using It**: `01`, `02`, `05`, `06`, `08`, `10`, `11`, `13`, `15`, `16`, `17`, `19`, `20`, `21`.
- **Current Implementations**:
  - Permissive wildcards (`allow_origins=["*"]`) hardcoded in `02`, `05`, `13`, `15`, `17`, `20`.
  - Express `cors()` default permissive middleware in `01`, `10`, `16`.
- **Recommended Shared Solution**: Central API Gateway / reverse proxy with environment-controlled origin whitelisting (`ALLOWED_ORIGINS=https://app.creatorsaas.com`).
- **Reason**: Current implementations are vulnerable to cross-origin abuse and credential theft.

---

### 4. Capability: AI Output Validation & Schema Enforcement
- **Applications Using It**: `01`, `02`, `03`, `05`, `07`, `08`, `09`, `11`, `13`, `14`, `17`, `18`, `18G`, `21`.
- **Current Implementations**:
  - TypeScript branches use Zod (`01`, `03`, `07`, `09`, `18`, `18G`, `21`).
  - Python branches use Pydantic v2 (`02`, `05`, `08`, `11`, `13`).
  - Other branches use fragile regex parsing or raw JSON parse (`06`, `10`, `14`, `15`).
- **Recommended Shared Solution**: Shared TypeScript schema package (`@saas/schemas`) for frontend and Node services; parallel Pydantic schema module (`app.schemas`) for Python services, generated from a single OpenAPI / JSON Schema definition.
- **Reason**: Eliminates fragile regex parsing, prevents frontend UI crashes from malformed LLM responses, and guarantees contract alignment across frontend and backend.

---

### 5. Capability: Vector Storage & Semantic Search (Embeddings)
- **Applications Using It**: `11`, `13`, `19`, `20`.
- **Current Implementations**:
  - `11`: Local `sentence-transformers` in memory (`paraphrase-multilingual-MiniLM-L12-v2`).
  - `13`: PostgreSQL `pgvector` with Alembic migrations + `sentence-transformers` (`all-MiniLM-L6-v2`).
  - `19`: PostgreSQL `pgvector` + `fastembed` local ONNX runtime.
  - `20`: ChromaDB vector database.
- **Recommended Shared Solution**: Standardize on **PostgreSQL with `pgvector`** as the single unified vector store, integrated with `fastembed` or hosted embeddings.
- **Reason**: Eliminates ChromaDB, SQLite, and in-memory fragmented stores. PostgreSQL already houses relational data; adding `pgvector` provides unified ACID transactions, relational joins with creator projects, and zero extra database infrastructure overhead.

---

### 6. Capability: Authentication & User Session Management
- **Applications Using It**: `16`, `18G`, `21`.
- **Current Implementations**:
  - `16`: Custom JWT with bcrypt passwords in Express/MongoDB.
  - `18G`: Supabase Auth with SSR middleware and session callbacks in Next.js.
  - `21`: Better Auth (`better-auth ^1.7.6`) with MongoDB adapter in Next.js.
  - Other 21 applications: No authentication.
- **Recommended Shared Solution**: Standalone enterprise Auth Layer using **Better Auth** or **Supabase Auth / Auth.js**, issuing signed JWTs verified by the backend API layer.
- **Reason**: Single sign-on across the entire unified product; protects creator data and establishes multi-tenant project isolation.

---

### 7. Capability: File Upload, Video Extraction & Audio Transcription
- **Applications Using It**: `06` (Clip Finder), `08` (Caption Vision), `13` (OCR on Instagram Images), `14` (Podcast Audio/Transcripts), `19` (YouTube Transcript Ingestion).
- **Current Implementations**:
  - `06`: `faster-whisper` + FFmpeg CLI + `yt-dlp`.
  - `08`: Flask multipart upload to local disk.
  - `13`: OpenCV + EasyOCR image text extraction.
  - `14`: Client text area paste.
  - `19`: `youtube-transcript-api` python package.
- **Recommended Shared Solution**: Dedicated **Media Processing Service (Worker)** equipped with FFmpeg, Whisper speech-to-text, and S3-compatible object storage (MinIO/R2/S3).
- **Reason**: Video and audio processing are CPU- and GPU-intensive long-running jobs that block standard web workers. Isolating media extraction prevents web server starvation.

---

### 8. Capability: Observability, Tracing & Logging
- **Applications Using It**: `02`, `05`, `18G`.
- **Current Implementations**:
  - `02`: LangSmith tracing via LangChain callbacks.
  - `05`: LangSmith `@traceable` decorator.
  - `18G`: Custom database logging table (`ai_logs`) recording user ID, prompt, duration, and status.
  - Other applications: Raw `console.log` or Python `logging.basicConfig`.
- **Recommended Shared Solution**: Unified Observability Pipeline combining **LangSmith / OpenTelemetry** for LLM span tracing with structured JSON application logging (correlation IDs, user ID, latency, token count, cost).
- **Reason**: Essential for tracking production errors, model latency spikes, and usage billing.
