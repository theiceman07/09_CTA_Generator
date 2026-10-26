# Unified Creator AI SaaS — Phase 1 Implementation Document

## 1. Executive Summary

Phase 1 of the Unified Creator AI SaaS successfully establishes the foundational architecture and delivers the first complete vertical slice: **Content Repurposer**. 

Instead of treating original student projects as isolated applications, this implementation unifies them into a cohesive, project-centric Creator SaaS platform built with modern production standards: Next.js 15 LTS, React 19, TypeScript, Tailwind CSS, FastAPI Modular Monolith, PostgreSQL 16 (pgvector-ready), and a centralized AI Model Gateway with LangSmith tracing.

---

## 2. Git Branch & Repository Integrity

- **Active Branch**: `saas/unified-creator-ai`
- **Fork Remote (`origin`)**: `https://github.com/jaishanthlenin-123/2_Content_Repurposer`
- **Upstream Remote (`upstream`)**: `https://github.com/Rishi-ZAiFi/ASADI_Protosem01`
- **Branch Protection**: All student branches (including `02_Content_Repurposer`, `main`, etc.) remain completely untouched. No code was copied blindly. No pull requests or upstream pushes were made.

---

## 3. High-Level Architecture

```
                                  CREATOR CLIENT
                    Next.js 15 LTS + React 19 + Tailwind CSS
                         (App Router: /dashboard, /projects,
                           /projects/[id], /tools/content-repurposer)
                                        │
                                        │ HTTPS / JSON / Bearer JWT
                                        ▼
                                  FASTAPI MONOLITH
                              (app/api/v1/router.py)
                    ┌───────────────────┬───────────────────┐
                    ▼                   ▼                   ▼
               Auth & User          Projects &          AI Tool: Content
                 Module            Assets Module           Repurposer
                    │                   │                   │
                    │                   ▼                   ▼
                    │            POSTGRESQL 16      AI MODEL GATEWAY
                    │         (Alembic Migrations) (app/ai/gateway.py)
                    │         - users               ├── Google Gemini
                    │         - projects            ├── Mock Provider (Tests)
                    │         - assets              └── LangSmith Tracing
                    │         - ai_generations
                    │         - usage_records
                    ▼
         SECURITY & RBAC (Project Ownership Isolation)
```

---

## 4. Frontend Architecture

The frontend is built inside `frontend/` utilizing the Next.js 15 App Router with full React 19 support, strict TypeScript, and a unified dark-mode creator UI design system.

### Directory Structure
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx           # Authentication login
│   │   └── register/page.tsx        # New creator registration
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx       # Creator dashboard, metrics, quick actions
│   │   ├── projects/
│   │   │   ├── page.tsx             # Project listing & management
│   │   │   └── [id]/page.tsx        # Project workspace (Tabs: Repurposer, Assets, History, AI Modules)
│   ├── tools/
│   │   └── content-repurposer/
│   │       └── page.tsx             # Direct studio route
│   ├── globals.css                  # Global styles, variables, sleek scrollbars
│   ├── layout.tsx                   # Root HTML shell & AuthProvider
│   └── page.tsx                     # Smart redirect to dashboard or login
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx              # Sidebar navigation with module status
│   │   ├── header.tsx               # Breadcrumbs and global actions
│   │   └── dashboard-layout.tsx     # Auth-protected shell
│   ├── projects/
│   │   └── create-project-modal.tsx # Modal dialog for creating projects
│   └── tools/
│       └── content-repurposer-studio.tsx # Complete interactive repurposing studio
├── lib/
│   ├── api/
│   │   └── client.ts                # Centralized, typed API client
│   ├── auth/
│   │   └── auth-context.tsx         # JWT state management and session hooks
│   └── utils.ts                     # Formatting and Tailwind clsx helper
└── types/
    └── index.ts                     # TypeScript interfaces
```

### Key UI Features
- **Project-Centric**: Every repurposing generation is bound to a specific project.
- **Dynamic Platform Chips**: Creators can select any combination of LinkedIn, Instagram, X (Twitter), and YouTube.
- **Controlled Generation Display**: Outputs are formatted per platform (e.g. YouTube provides Title, Description, Tags, and Video Outline; LinkedIn & X format post copy).
- **Copy to Clipboard & Status Indicators**: Visual feedback for copying content and confirmation of auto-saving to project assets.

---

## 5. Backend Architecture

The backend is built inside `backend/` as a clean **Modular Monolith** adhering to domain-driven design, Pydantic data validation, and SQLAlchemy 2.0 async ORM.

### Directory Structure
```
backend/
├── app/
│   ├── main.py                      # FastAPI factory, CORS, exception handlers, health
│   ├── core/
│   │   ├── config.py                # Pydantic BaseSettings environment loader
│   │   ├── logging.py               # Structured log formatting
│   │   └── security.py              # Direct bcrypt hashing & PyJWT token handling
│   ├── api/
│   │   └── router.py                # Aggregator for all v1 domain routers
│   ├── db/
│   │   ├── session.py               # Async engine & sessionmaker (PostgreSQL / SQLite fallback)
│   │   ├── migrations/              # Alembic environment and versions
│   │   └── models/                  # Declarative SQLAlchemy models:
│   │       ├── user.py              # User entity
│   │       ├── project.py           # Project entity
│   │       ├── asset.py             # Generated content assets with JSONB metadata
│   │       ├── generation.py        # AI generation audit log
│   │       └── usage.py             # Token usage records
│   ├── modules/
│   │   ├── auth/                    # Register, login, me endpoints
│   │   ├── projects/                # Project CRUD & ownership verification
│   │   ├── assets/                  # Project asset retrieval
│   │   ├── generations/             # Project AI generation log retrieval
│   │   ├── usage/                   # Token usage aggregation
│   │   └── content_repurposer/      # First integrated AI module
│   └── ai/
│       ├── gateway.py               # Centralized AI Model Gateway
│       ├── schemas.py               # Structured Pydantic LLM output contracts
│       └── providers/
│           ├── base.py              # Abstract BaseAIProvider
│           ├── google.py            # Google Gemini adapter with LangChain & LangSmith
│           └── mock.py              # Deterministic mock provider for unit testing
```

---

## 6. AI Model Gateway & Content Repurposer Flow

The Content Repurposer does **not** hardcode a single provider. All generation routes through `AIModelGateway`:

```
Client Request
      │
      ▼
Content Repurposer Service (backend/app/modules/content_repurposer/service.py)
      │
      ├─ 1. Content Analysis (Executed once per request: topic, audience, summary)
      │
      ├─ 2. Platform Generation (Generated ONLY for selected platforms concurrently)
      │      - LinkedIn Post
      │      - Instagram Caption
      │      - X Tweet / Thread
      │      - YouTube Title, Description, Tags, and Video Outline
      │
      ▼
AI Model Gateway (backend/app/ai/gateway.py)
      │
      ├─ Dispatches to Provider Adapter (Google Gemini / Mock)
      ├─ Wraps call in LangSmith tracing (if LANGSMITH_TRACING=true)
      └─ Enforces structured Pydantic schema validation
      │
      ▼
Persistence & Side Effects
      ├─ Saves AIGeneration history record to DB
      ├─ Saves individual platform outputs as Project Assets
      ├─ Records token usage in UsageRecord
      └─ Returns structured, validated response to client
```

---

## 7. Database Schema & Migrations

All models use UUID primary keys and proper indexes.

- **`users`**: `id`, `email` (unique), `password_hash`, `name`, `created_at`, `updated_at`.
- **`projects`**: `id`, `user_id` (FK to `users`), `name`, `description`, `created_at`, `updated_at`.
- **`assets`**: `id`, `project_id` (FK to `projects`), `user_id` (FK to `users`), `type` (`linkedin`, `instagram`, `x`, `youtube`), `title`, `content`, `storage_ref`, `metadata_json` (`JSONB`), timestamps.
- **`ai_generations`**: `id`, `project_id` (FK to `projects`), `user_id`, `tool`, `provider`, `model`, `input_metadata` (`JSONB`), `output_metadata` (`JSONB`), `token_usage` (`JSONB`), `status`, `created_at`.
- **`usage_records`**: `id`, `user_id`, `project_id`, `generation_id`, `tool`, `provider`, `model`, `input_tokens`, `output_tokens`, `total_tokens`, `created_at`.

Alembic migration is located in `backend/app/db/migrations/versions/001_initial_schema.py`.

---

## 8. Security & Access Control

1. **Password Security**: Direct `bcrypt` hashing with salt (no plaintext passwords, eliminates legacy passlib compatibility bugs).
2. **JWT Sessions**: Signed using `BETTER_AUTH_SECRET` (HS256) with expiration validation.
3. **CORS Configuration**: Restricts access explicitly to trusted `FRONTEND_URL` (`http://localhost:3000`). Never allows wildcard `*` with credentials.
4. **Ownership Verification**: All project operations verify that `project.user_id == current_user.id`. Tampering with project IDs returns HTTP 404/403.
5. **Secret Protection**: `.env` is ignored by Git; `.env.example` provides sanitized placeholders.

---

## 9. Local Development Setup

### Prerequisites
- Node.js >= 18 (Tested on v24.14.1)
- Python >= 3.10 (Tested on 3.11.9)
- PostgreSQL 16 & Redis (via Docker Compose or local installation)

### 1. Start Database & Redis
```bash
docker compose up -d
```

### 2. Start FastAPI Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt   # or installed packages
uvicorn app.main:app --reload --port 8000
```
Backend API will be accessible at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

### 3. Start Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be accessible at `http://localhost:3000`.

---

## 10. Automated Testing

### Backend Test Suite (Pytest)
Run with:
```bash
cd backend
pytest tests/ -v
```
**Results: 7 passed in 2.52s**
- `test_root_health`: Health check validation.
- `test_api_v1_health`: Versioned health check validation.
- `test_auth_register_and_login`: User registration, JWT issuance, and login.
- `test_auth_invalid_credentials`: Rejection of incorrect passwords.
- `test_project_crud_and_ownership`: Project creation, listing, retrieval, cross-user isolation.
- `test_content_repurposer_validation`: Input validation (empty content, empty platforms, invalid platform, invalid tone).
- `test_content_repurposer_execution_and_persistence`: AI Model Gateway execution, partial platform generation, Asset saving, Generation audit recording, Usage tracking.

### Frontend Test Suite (Vitest)
Run with:
```bash
cd frontend
npm test
```
**Results: 5 passed in 2.00s**
- `LoginPage`: Branding, input fields, and submission validation.
- `CreateProjectModal`: Form rendering, input handling, and API integration.
- `ContentRepurposerStudio`: Platform chips, tone controls, sample text loading.
- `ContentRepurposerStudio`: Controlled error state handling on gateway timeouts.
- `ContentRepurposerStudio`: Successful multi-platform output rendering and clipboard copying.

### Production Build
```bash
cd frontend
npm run build
```
**Result: All 9 Next.js App Router routes compiled successfully with 0 errors.**

---

## 11. Known Limitations & Phase 2 Roadmap

### Limitations in Phase 1 (By Design)
1. **Billing & Stripe**: Billing tables and checkout workflows are deliberately deferred to Phase 2 to focus on core platform stability.
2. **Autonomous Agents**: Complex LangGraph multi-agent pipelines are omitted in Phase 1 in favor of reliable, single-pass orchestration.
3. **Heavy Media Pipeline**: FFmpeg and Whisper video slicing will be introduced in subsequent phases with Celery and Redis workers.

### Next MVP Modules to Integrate
According to `docs/SAAS_MVP_PLAN.md`, the integration priority for Phase 2 is:
1. **01 Content Idea Generator** (Topic ideation & keyword expansion)
2. **03 Hook Generator** (Viral video and post hooks)
3. **05 Reel Script Builder** (Short-form video scripts)
4. **12 Creator Research Assistant** (Competitor intelligence)
5. **08 Caption Assistant**
6. **09 CTA Generator**
