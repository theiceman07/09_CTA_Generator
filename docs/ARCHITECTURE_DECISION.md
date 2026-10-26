# Architecture Decision Record (ADR): System Architecture Selection

## Status
**APPROVED**

## Context
We need to unify 24 student-built AI applications into a single commercial-grade SaaS product. The applications currently span multiple languages (Python, TypeScript, JavaScript), frameworks (FastAPI, Flask, Express, Next.js, Streamlit), AI providers (Google Gemini, Anthropic, Ollama, Groq), and storage backends (SQLite, MongoDB, PostgreSQL, ChromaDB, in-memory).

We must evaluate three primary architectural patterns:
- **Option A**: Modular Monolith
- **Option B**: Modular Monolith + Specialized Asynchronous Services
- **Option C**: Pure Microservices

---

## Architectural Comparison Matrix

| Evaluation Criteria | Option A: Pure Modular Monolith | Option B: Modular Monolith + Specialized Services | Option C: Pure Microservices |
|---------------------|---------------------------------|--------------------------------------------------|------------------------------|
| **Development Complexity** | Low | Low - Moderate | Very High |
| **Deployment Complexity** | Low (Single container) | Moderate (Web + Worker container) | Very High (20+ containers, K8s, service mesh) |
| **Dependency Isolation** | Poor (FFmpeg/Whisper conflicts with web) | High (Heavy media isolated to worker) | Complete |
| **Performance & Latency** | Media tasks block web event loop | Excellent (Non-blocking async worker) | Network hop overhead between services |
| **Scalability** | Scale everything together | Independent scaling of web vs GPU worker | Granular per-service scaling |
| **AI Workload Fit** | Good for API calls, bad for video | Optimal for both LLM APIs & local audio/video | Good but high operational overhead |
| **Team Size Fit** | 1 - 5 Engineers | 2 - 8 Engineers | 15+ Engineers |
| **Maintainability** | High | Very High | Low (Distributed debugging nightmare) |

---

## Decision: OPTION B (Modular Monolith + Specialized Services)

We formally select **Option B: Modular Monolith + Specialized Asynchronous Services**.

### Justification:

1. **Why NOT Pure Microservices (Option C)?**
   - Splitting 24 applications into 24 distinct microservices would require managing 24 CI/CD pipelines, inter-service gRPC/REST overhead, distributed transaction coordination (Saga pattern), distributed tracing, and massive infrastructure costs. For an MVP and early SaaS product, this would be catastrophic over-engineering.

2. **Why NOT Pure Monolith (Option A)?**
   - Application 06 (`Clip Finder`) requires system binaries (`ffmpeg`, `yt-dlp`) and machine learning models (`faster-whisper`). Bundling FFmpeg execution and heavy audio transcription into the same OS container that handles rapid HTTP requests would cause CPU starvation, request timeouts, and bloated image sizes (> 6GB).

3. **Why Option B is the Ideal Architecture:**
   - **Frontend**: **Next.js 15 LTS (React 19)** App Router application providing a unified, responsive creator workspace.
   - **Core Web Application (Modular Monolith)**: Built in **Python FastAPI**. It handles all user flows, project trees, ideation, repurposing, scriptwriting, and second-brain vector search in a cleanly organized domain module structure (`app.modules.repurposing`, `app.modules.hooks`, etc.).
   - **Authentication**: **Better Auth** (self-hosted with PostgreSQL 16 adapter) at the Next.js API layer with session token validation in FastAPI.
   - **Database**: **PostgreSQL 16 with `pgvector`** for relational data, JSONB documents, and vector embeddings.
   - **Object Storage**: **Cloudflare R2** (S3-compatible, zero egress fees).
   - **Queue & Background Jobs**: **Celery + Redis** for asynchronous job queueing.
   - **Specialized Media Worker**: A dedicated background worker running with Celery/Redis equipped with FFmpeg and Faster-Whisper. When a creator uploads a long video for clip finding or audio transcription, the core API queues a job, and the worker processes it asynchronously, posting results back to Cloudflare R2 and PostgreSQL 16.
   - **AI Orchestration**: Dual-tier architecture using the official **Google GenAI SDK** for single-turn stateless generations and **LangGraph (Python)** for multi-stage agent workflows.

---

## Architectural Guardrails
- **Zero Microservice Proliferation**: Do not create independent services for features like "Hook Generator" or "CTA Generator". They must be internal library functions or domain services within the modular monolith.
- **Single Database**: All relational data, vector embeddings (`pgvector`), and project trees reside in a single PostgreSQL database instance.
- **Unified Client SDK**: Frontend communicates exclusively with the monolithic API Gateway.
- **Asynchronous Heavy Compute**: No video rendering or audio transcription runs inside the web API process.

