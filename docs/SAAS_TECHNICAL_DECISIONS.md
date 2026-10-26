# SaaS Technical Decisions

## 1. Single LLM Provider: Google Gemini API Only
- **Decision**: Standardize 100% of LLM capabilities on the Google Gemini API.
- **Rationale**: Eliminates multi-provider abstraction overhead, dependency conflicts, conflicting API keys, and disparate latency profiles. Gemini provides fast multi-modal, structured output, and high-throughput capabilities.
- **Enforcement**: No OpenAI, Anthropic, Claude, local models, or Ollama are allowed. Provider switching is strictly forbidden in application modules.

## 2. Standardized Model: gemini-3.1-flash-lite
- **Decision**: Use `gemini-3.1-flash-lite` across all 24 application capabilities.
- **Rationale**: Provides exceptional inference latency, generous rate limits, reliable structured outputs via LangChain, and zero 503 high-demand degradation compared to larger preview variants.
- **Configuration**: Managed centrally in `backend/app/core/config.py` via `settings.GEMINI_MODEL`.

## 3. LangChain as Standard Application Framework
- **Decision**: All application-level AI workflows use LangChain prompt templates, message composition, and structured outputs.
- **Rationale**: Provides unified prompt composition, standardized LangSmith callbacks, and robust Pydantic structured output validation.
- **Boundary**: Does not mean "agents everywhere". Deterministic chains (Hook Generator, CTA Generator, Repurposer) use standard LCEL chains.

## 4. LangGraph Usage Boundary
- **Decision**: LangGraph is strictly reserved for stateful, looping, or multi-step autonomous pipelines.
- **Candidates**: Autonomous Content Pipeline, Creator Second Brain (agentic memory search), AI Content Director.
- **Anti-Pattern**: Do NOT use LangGraph for standard single-turn or fan-out generation tasks.

## 5. PostgreSQL 16 & pgvector for All Persistence
- **Decision**: Single unified relational database with `pgvector` extension.
- **Rationale**: Eliminates disparate SQLite files, MongoDB instances, and standalone vector databases. Provides unified transactional guarantees across users, projects, assets, and generation logs.

## 6. Next.js 15 LTS + Tailwind CSS
- **Decision**: One unified frontend codebase using Next.js 15 App Router, React 19, and Tailwind CSS.
- **Rationale**: High performance, unified authentication context, shared project selector, and consistent design language across all 24 creator capabilities.
