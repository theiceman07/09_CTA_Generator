# AI Framework Strategy: LangChain, LangGraph, and Direct SDKs

## Context
Across the 24 application branches, multiple approaches to AI orchestration are currently in use:
- **LangChain / LangChain Core**: Used in `01`, `02`, `03`, `05`, `08`, `17`, `19`, `20`.
- **LangGraph**: Used in `19`, `20`, `21`.
- **Google GenAI SDK (`@google/genai` / `google-genai`)**: Used in `07`, `10`, `13`, `18G`, `21`.
- **Anthropic SDK**: Used in `09`, `11`, `18`.
- **Direct HTTP Fetch**: Used in `08`, `14`.

We must determine whether the unified SaaS platform should standardize on LangChain/LangGraph or adopt direct provider SDKs.

---

## Comparative Evaluation

| Evaluation Criteria | Direct Provider SDKs | LangChain (LCEL) | LangGraph |
|---------------------|----------------------|------------------|-----------|
| **Prompt Reusability** | Manual string formatting | High (Prompt Templates) | High (Shared Nodes) |
| **Structured Output** | Provider-dependent | Standardized (Pydantic/Zod) | Standardized Schemas |
| **Model Abstraction** | None (Vendor lock-in) | Excellent (Switch Gemini/Claude/Groq) | Excellent |
| **Stateful Workflows** | Manual DB state logic | Poor (Chains are linear DAGs) | Outstanding (State machines, loops, checkpoints) |
| **Observability** | Manual logging code | Native LangSmith integration | Native LangSmith tracing |
| **Token Overhead** | Minimal | Low | Low - Moderate |
| **Learning Curve** | Low | Moderate | High |

---

## Strategic Recommendation: 2-Tier Framework Architecture

We recommend a **pragmatic 2-tier standardization strategy**:

### Tier 1: Direct SDKs with Pydantic / Zod for Single-Turn Features
- For simple, stateless, high-throughput features (Hooks `03`, CTAs `09`, Captions `08`, Thumbnail concepts `07`, Ideas `01`, Research `12`):
  - Use official **Google GenAI SDK** (`@google/genai` / `google-genai`) and **Anthropic SDK**.
  - **Rationale**: Direct SDK calls are faster, have zero abstraction bloat, support streaming natively, and directly leverage provider innovations (e.g. Gemini 2.0 native multimodal live API, Context Caching).

### Tier 2: LangGraph for Complex Multi-Step & Agentic Pipelines
- For multi-step, stateful, self-correcting workflows (`18` Content Director, `19` Second Brain Supervisor, `21` Autonomous Content Pipeline):
  - Standardize on **LangGraph**.
  - **Rationale**:
    - LangGraph provides cyclical state execution, human-in-the-loop approvals, and checkpoint persistence out-of-the-box.
    - Branch 21 demonstrates how LangGraph cleanly separates planning, research, scripting, and parallel fan-out into maintainable state nodes.
    - Branch 19 demonstrates how LangGraph manages multi-agent routing between supervisor and specialists.

### Observability Standardization
- Standardize on **LangSmith** across all AI invocations (both Direct SDK calls and LangGraph workflows).
- LangSmith provides full span tracing, latency monitoring, token accounting, and cost tracking under a single dashboard.
