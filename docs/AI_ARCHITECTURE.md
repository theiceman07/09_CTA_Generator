# Centralized AI Architecture

## Overview
The unified Creator AI SaaS standardizes 100% of LLM capabilities on **Google Gemini API** (`gemini-3.1-flash-lite`).

```text
Application Request
        ↓
FastAPI Module Service
        ↓
LangChain Specialized Chain (Prompt + Validation)
        ↓
Centralized Gemini Service (app.ai.gemini.service)
        ↓
Google Gemini API (gemini-3.1-flash-lite)
        ↓
Pydantic Structured Output Validation
        ↓
PostgreSQL Persistence (Assets, Generations, Usage)
```

## Architectural Rules
1. **Google Gemini ONLY**: Multi-provider abstractions (OpenAI, Anthropic, Claude, local models) are strictly prohibited.
2. **Centralized Service Singleton**: Modules must NEVER instantiate raw Gemini clients independently. All requests must pass through `CentralGeminiService`.
3. **Structured Outputs**: All generations must parse into strongly typed Pydantic models before being returned or stored.
4. **Source Grounding**: Prompts must contain strict non-hallucination directives preventing the model from inventing unstated specs, metrics, or marketing claims.
5. **Deterministic Testing**: `MockAIProvider` is strictly reserved for automated CI/unit tests via `settings.TESTING = True`.
