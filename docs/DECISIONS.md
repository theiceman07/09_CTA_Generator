# Architecture Decisions Log

This document records the major architectural decisions for ContentYou, including their rationale, consequences, and conditions for reconsideration.

## Status Key

- **Accepted** — The decision is currently in effect.
- **Deferred** — The decision is postponed.
- **Superseded** — A newer decision has replaced it.

---

## ADR-001 — TypeScript End-to-End for the Agent Runtime

**Status:** Accepted  
**Date:** 2026-09-28

### Decision

Use TypeScript throughout the application. The `apps/agent` service uses Node.js, Fastify, and LangGraph.js.

### Rationale

- Share Zod schemas across packages.
- Avoid maintaining duplicate TypeScript and Python contracts.
- Use one primary toolchain for development, testing, and deployment.

### Consequences

- Python-only LangGraph capabilities may require waiting or reimplementation.
- Python-specific data science libraries are not directly available in the agent runtime.

### Revisit If

The project requires a Python-only capability that cannot reasonably be reimplemented, or substantial machine-learning workloads are introduced.

---

## ADR-002 — Gemini First, OpenAI Optional

**Status:** Accepted  
**Date:** 2026-09-28

### Decision

Use `packages/ai` as the provider abstraction, with Gemini as the default provider and OpenAI available as an alternative. Configure model IDs through environment variables.

### Rationale

- Support low-cost development where provider free-tier access is available.
- Use search grounding and citations where supported.
- Keep provider selection replaceable without changing the rest of the application.

### Consequences

- Provider rate limits and availability affect execution.
- The application must handle rate limiting, retries, and provider errors.
- Model capabilities and costs should be validated against current provider documentation.

### Revisit If

The project obtains a funded API budget or evaluation results show that another provider is a better fit.

---

## ADR-003 — Separate Agent Worker

**Status:** Accepted  
**Date:** 2026-09-28

### Decision

Separate the web application from the long-running agent runtime. The web application enqueues work and presents progress; the agent service executes workflows and AI calls.

Use MongoDB-backed job coordination if it is implemented and validated in the application.

### Rationale

- Long-running workflows may exceed serverless execution limits.
- A persistent worker can manage sequencing and rate limits.
- Durable checkpoints can support recovery after interruptions.

### Consequences

- The application has separate deployment targets.
- Job claiming, retries, stale-job recovery, and checkpoint resumption require testing.
- Hosting limits and database costs must be evaluated.

### Alternatives Considered

Workflow platforms such as Inngest or Trigger.dev may be appropriate if the application later needs orchestration across multiple independent services.

### Revisit If

The workflow becomes short-lived or the deployment environment provides suitable durable execution.

---

## ADR-004 — Manual Export Before Automated Publishing

**Status:** Accepted  
**Date:** 2026-09-28

### Decision

Define a `PublishingPort` interface and implement manual export first. The export should provide the content assets, caption, calendar entry, and reminder where supported.

Defer Instagram Graph API publishing until the necessary account setup, permissions, and approvals are available.

### Rationale

- External platform approval can delay delivery.
- Manual export provides value without depending on publishing API access.
- The core content workflow can be tested independently.

### Consequences

- The interface must not imply that content has been automatically published.
- Publishing integrations require separate permission and error handling.

### Revisit If

The required platform permissions and approvals are obtained and the integration is tested.

---

## ADR-005 — Contract-First Parallel Development

**Status:** Accepted  
**Date:** 2026-09-28

### Decision

Use three practices for parallel implementation:

1. Define shared schemas and interfaces before implementing dependent components.
2. Assign explicit file ownership to each development stage.
3. Integrate work in planned waves, with verification gates between them.

### Rationale

- Stable interfaces reduce coordination overhead.
- Mocks enable independent development and testing.
- Explicit file ownership reduces merge conflicts.

### Consequences

- Shared contracts require careful review.
- Integration testing remains mandatory; passing mock tests alone is insufficient.

### Revisit If

Development becomes strictly sequential and the coordination overhead outweighs the benefits.

---

## ADR-006 — Separate Brand Accents from Light-Theme Neutrals

**Status:** Accepted  
**Date:** 2026-09-28

### Decision

Use the dark palette specified in `PS.md` as the dark-theme foundation. Preserve the specified crimson, pink, and navy colors as brand accents and visualization colors.

Derive neutral backgrounds, surfaces, and borders for light mode, and document the contrast results.

### Rationale

- The supplied accent colors do not provide a complete light-theme neutral palette.
- Text and background combinations must meet applicable accessibility contrast requirements.
- Preserving the supplied colors as accents maintains the intended visual identity.

### Consequences

- Light mode requires additional neutral colors.
- Theme contrast and readability must be validated.
- The design rationale should be documented in `CLAUDE.md`.

### Revisit If

The product owner requests a predominantly crimson light theme and suitable accessible color variants can be established.