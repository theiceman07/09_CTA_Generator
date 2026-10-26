# Dependency Conflicts and Resolution Matrix

A comprehensive analysis of `package.json`, `requirements.txt`, and `pyproject.toml` across all 24 branches revealed critical package conflicts, version fractures, and ecosystem incompatibilities.

---

## Master Dependency Conflict Table

| Application | Dependency | Current Version | Conflicting Branch & Version | Severity | Proposed Unified Solution |
|-------------|------------|-----------------|------------------------------|----------|---------------------------|
| `04`, `07`, `14`, `18` | `react` / `react-dom` | `^18.3.1` | `02`, `03`, `11`, `12`, `13`, `16`, `19`, `20`, `21` use `^19.0.0` or `^19.2.8` | **HIGH** | Upgrade all UI components to React 19. React 19 is fully compatible with Next.js 15/16. |
| `04`, `07`, `14`, `18` | `next` | `^14.2.15` / `^14.2.23` | `03`, `09` use `^15.2.1`; `11`, `12`, `13`, `19`, `20`, `21` use `16.3.6` | **CRITICAL** | Standardize on Next.js 15.x LTS for stability. Next.js 16 is in canary/pre-release in several branches. |
| `07`, `10`, `18G`, `21` | Google GenAI SDK | `@google/genai ^0.14.0` / `^2.24.0` | `15` uses legacy `@google/generative-ai ^0.24.0` | **HIGH** | Deprecate `@google/generative-ai`. Standardize on official `@google/genai` (v2.x) and `langchain-google-genai`. |
| `01`, `03`, `17` | `@langchain/core` | `^0.3.28` | `03`, `17`, `21` use `^1.2.13` (LangChain v1.x) | **HIGH** | Standardize on LangChain v1.x (`@langchain/core ^1.2.x`, `@langchain/google-genai ^2.x`). |
| `02`, `05`, `20` | `langchain` (Python) | `langchain` unpinned | `19` pins `langchain==1.4.3`, `langgraph==1.2.12` | **HIGH** | Pin Python LangChain to `langchain>=1.4.0` and `langgraph>=1.2.0`. |
| `19` | `groq` | `groq==0.37.1` | `langchain-groq==1.1.3` requires `groq<1.0` | **MODERATE** | Maintain `groq~=0.37.1` in requirements to prevent breaking `langchain-groq`. |
| `13` | `numpy` | `numpy>=1.26.4` | `19` pins `numpy==2.5.3` (NumPy 2.x breaking change) | **CRITICAL** | Pin `numpy<2.0.0` (e.g. `1.26.4`). NumPy 2.x breaks `scikit-learn 1.4` and `opencv-python`! |
| `16`, `21` | MongoDB Driver | `mongoose` (Node) vs `mongodb ^7.6.0` | `20` uses `motor` (Python async MongoDB) | **HIGH** | Eliminate MongoDB. Migrate all relational and document state into PostgreSQL 16 JSONB. |
| `06`, `10`, `11`, `13`, `17` | SQLite | `better-sqlite3`, `node:sqlite`, Python `sqlite3` | `13`, `19` use PostgreSQL `pgvector` | **HIGH** | Consolidate all local SQLite databases into unified PostgreSQL 16. |
| `06` | Media Engine | `faster-whisper`, `ffmpeg` | Other branches have zero media dependencies | **CRITICAL** | Isolate FFmpeg and Whisper into an asynchronous Celery worker; do not bundle into web API container. |
| `16`, `18G`, `21` | Authentication | Custom JWT, Supabase Auth, Better Auth | Fragmented auth systems across branches | **HIGH** | Standardize on Better Auth with PostgreSQL 16 adapter. |

---

## Detailed Conflict Analysis

### 1. The React & Next.js Version Fracture
- 4 applications (`04`, `07`, `14`, `18`) were built on Next.js 14 and React 18.
- 2 applications (`03`, `09`) were built on Next.js 15 and React 19.
- 6 applications (`11`, `12`, `13`, `19`, `20`, `21`) specify `next: "16.3.6"` with `react: "19.2.8"`.
- **Resolution**: Next.js 16 is an unstable canary release branch in npm. The unified frontend must standardize on **Next.js 15 LTS with React 19**. All React 18 components in branches 04, 07, 14, 18 are straightforward to upgrade.

### 2. The NumPy 2.0 Incompatibility (Python)
- Branch `19` pins `numpy==2.5.3` (NumPy 2.x).
- Branches `11` and `13` rely on `scikit-learn >=1.4.1`, `spacy`, and `opencv-python-headless`.
- **Risk**: NumPy 2.0 introduced ABI breaking changes. Installing NumPy 2.x causes C-extension segmentation faults in `opencv` and `scikit-learn` binaries.
- **Resolution**: Pin `numpy>=1.26.0,<2.0.0` in the master Python environment.

### 3. Database Fragmentation (5 Different Storage Systems)
- Current state: SQLite (apps 06, 10, 11, 13, 17), MongoDB (apps 16, 20, 21), PostgreSQL (apps 13, 18G, 19), ChromaDB (app 20), LocalStorage (apps 04, 26).
- **Resolution**: Unify 100% of data into **PostgreSQL 16 with `pgvector`**. PostgreSQL handles structured relational data, vector search, and schemaless JSONB documents, rendering standalone MongoDB and SQLite obsolete.
