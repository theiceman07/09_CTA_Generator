# LangChain & LangGraph Architecture

## Role of LangChain
LangChain serves as the standard orchestration framework for application workflows across the SaaS.

### Specialized Chains vs. One Generic Chain
Each application defines its own specialized LangChain chains:
- **Content Repurposer**: `ContentAnalysisChain`, `LinkedInChain`, `InstagramChain`, `XThreadChain`, `YouTubeChain`
- **Hook Generator**: `HookVariationChain` (psychological angle framing)
- **Reel Script Builder**: `ScriptPacingChain` (hooks + beats + visual directions)
- **Caption Assistant**: `CaptionClusteringChain`
- **Research Assistant**: `QueryDecompositionChain`, `SynthesisChain`

### Shared LangChain Infrastructure (`app/ai/shared/`)
- `prompts/`: Standardized grounding directives (`STRICT_GROUNDING_DIRECTIVE`), tone guides.
- `schemas/`: Shared output schemas (`BaseGeneratedContent`, `ModelUsageMetadata`).
- `validators/`: Grounding validation functions ensuring source keywords are preserved.
- `tracing/`: Centralized LangSmith configuration and run callbacks.

## LangGraph Decision Matrix
LangGraph is NOT used everywhere. It is strictly reserved for workflows requiring:
1. Stateful branching
2. Feedback loops (e.g. self-critique and revision)
3. Multi-stage human approval

| Workflow | Framework | Justification |
|---|---|---|
| Content Repurposer | Standard LangChain | Deterministic fan-out after single analysis |
| Hook Generator | Standard LangChain | Single-turn prompt to structured output |
| Reel Script Builder | Standard LangChain | Single-turn structured output |
| Autonomous Content Pipeline | **LangGraph** | Multi-stage state machine with human-in-the-loop review |
| Creator Second Brain | **LangGraph** | Multi-hop RAG with query refinement loop |
| AI Content Director | **LangGraph** | Iterative editorial calendar generation with review steps |
