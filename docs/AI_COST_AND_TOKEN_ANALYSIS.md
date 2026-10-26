# AI Cost and Token Analysis

## Overview

A fundamental challenge in consolidating 24 disparate AI applications into a unified SaaS product is cost predictability and token efficiency. Several applications currently make redundant model calls, make independent round-trips for closely coupled generation tasks, or fail to cache shared analysis.

> [!NOTE]
> **Token usage cannot be directly determined from the repository.**
> Precise token consumption metrics (prompt tokens, completion tokens, cached tokens) depend on runtime inputs, dynamic context length, and live API responses. However, call patterns, execution topologies, and optimization opportunities can be definitively established from source code inspection.

---

## Model Calls per User Action

| Application | Calls per Action | Execution Topology | Model Tier | High Cost Risk |
|-------------|------------------|--------------------|------------|----------------|
| 01_Content_Idea_Generator | 1 | Single Synchronous | Gemini Flash | Low |
| 02_Content_Repurposer | 2 - 5 | Sequential Analysis + Parallel Platform Chains | Gemini Flash Lite | Low - Moderate |
| 03_Hook_Generator | 1 | Single Synchronous | Gemini Pro | Moderate |
| 04_Daily_Content_Planner | 0 | Deterministic / Offline | None | None |
| 05_Reel_Script_Builder | 1 | Single Synchronous | Gemini Flash | Low |
| 06_Clip_Finder | 1 | Sequential Pipeline (Whisper + Ollama) | Local Models | Low (Server compute heavy) |
| 07_Thumbnail_Ideator | 1 | Single Synchronous | Gemini Flash | Low |
| 08_Caption_Assistant | 1 - 2 | Sequential Multi-Modal (Vision + Text) | Gemini Flash / Claude Haiku | Moderate |
| 09_CTA_Generator | 1 | Single Synchronous | Claude Opus / Sonnet | High (Opus tier) |
| 10_Comment_Analyzer | `ceil(N/25)` | Sequential Batches | Gemini Flash | High on large threads |
| 11_Comment_to_Content | 2 - 4 | Multi-Stage Pipeline | Claude Sonnet 3.7 + Local Embeddings | High (Sonnet 3.7 tier) |
| 12_Creator_Research_Assistant | 1 | Single Synchronous | Gemini Flash | Low |
| 13_Voice_Replicator | 2 | Sequential (Generation + Validation) | Gemini Flash + Local Embeddings | Low - Moderate |
| 14_Podcast_Assistant | 1 | Single Synchronous (Large Transcript) | Gemini Flash | Moderate (Large context) |
| 15_Creator_Workspace | 1 | Single Synchronous | Gemini Flash Lite | Low |
| 16_Content_Recycler | 0 | Algorithmic TF-IDF | None | None |
| 17_Brand_Pitch_Builder | 2 | Sequential (Alignment + Proposal) | Gemini Flash | Low - Moderate |
| 18_AI_Content_Director | 7 | Sequential Cascading Stages | Claude 3.5 Sonnet | Critical (7 calls per run) |
| 18_AI_Content_Director_Guruvelah | 3 - 4 | Fan-out Parallel Sub-Modules | Gemini Flash Lite | Low - Moderate |
| 19_Creator_Second_Brain | 2 - 4 | Supervisor Agent Loop | Groq Llama 3.3 70B | Moderate (Fast tokens) |
| 20_AI_Screenplay_Workspace | 2 - 3 | Cyclical Continuity Graph | Gemini 1.5 Pro / GPT-4o | High (Pro / GPT-4o tier) |
| 21_Autonomous_Content_Pipeline | 6 - 9 | Plan Graph + Refine Graph Fan-out | Gemini Flash / Pro / GPT-4o | High (Multiple agents) |
| 22_AI_Creative_Producer | 0 | Unsubmitted | None | None |
| 26_Creator_Collaboration_Finder | 0 | Client-side Algorithm | None | None |

---

## Consolidation and Optimization Analysis

### 1. Feed-Forward Optimization (Single Analysis Feeding Multiple Generators)
- **Current Problem**: In branches 02, 18, 18G, and 21, separate prompts repeatedly re-analyze the core topic. For example, 18 makes 7 sequential calls where each stage sends the entire accumulated text back to Claude.
- **SaaS Solution**: Perform **one** foundational "Content Extraction & Thesis" call. Store the resulting structured thesis object in memory/DB, and pass it directly into downstream generation templates without prompting LLMs to re-evaluate the source material.

### 2. Output Caching and Deduplication
- **Current Problem**: Every time a user adjusts a parameter or clicks "Regenerate", the entire prompt is resent.
- **SaaS Solution**:
  - Implement deterministic cache keys based on `hash(project_id, topic, model, prompt_version)`.
  - Cache research dossiers (Application 12) for 24-48 hours. If multiple generation tasks require research on "SaaS Customer Retention", use the cached research dossier rather than calling Gemini again.
  - Enable **Context Caching** (supported natively by Google Gemini for prompts > 32k tokens), saving up to 75% on input costs for large documents and transcripts (Applications 06, 14, 19, 20).

### 3. Model Right-Sizing
- **Current Problem**: Application 09 defaults to `claude-opus-5` for writing simple 1-2 sentence calls-to-action! Application 18 defaults to `claude-3-5-sonnet` for all 7 stages including basic formatting.
- **SaaS Solution**:
  - Tier 1 (Lightweight / Flash): Use `gemini-2.0-flash` or `gemini-1.5-flash` for high-volume, low-complexity tasks: CTAs (09), Hooks (03), Captions (08), Idea lists (01), and Comment classification (10).
  - Tier 2 (Balanced / Reasoning): Use `gemini-2.5-flash` or `claude-3-5-haiku` for structured repurposing (02), pitch proposals (17), and podcast summaries (14).
  - Tier 3 (Deep Intelligence / Pro): Reserve flagship models (`gemini-1.5-pro`, `claude-3-7-sonnet`, `gpt-4o`) exclusively for master narrative scripting (18, 20, 21) and multi-agent supervisory routing (19).

### 4. Combining Redundant Calls
- In Application 17 (Brand Pitch Builder), Alignment Scoring and Proposal Generation can be merged into a single structured call returning both the alignment score card and the tiered proposal packages.
- In Application 02 (Content Repurposer), instead of 4 separate calls for LinkedIn, Instagram, X, and YouTube, a single multi-key structured output call can generate all four platforms in one inference pass when using large context models.

---

## Cost Optimization Matrix

| Optimization Technique | Applicable Applications | Estimated Call Reduction | Expected Latency Impact |
|------------------------|-------------------------|--------------------------|-------------------------|
| Prompt Combination | 02, 17, 18 | 40% - 60% fewer calls | 30% - 50% faster completion |
| Context Caching | 06, 14, 19, 20 | Identical calls, 70% cheaper inputs | 20% faster TTFT |
| Research Dossier Reuse | 12, 18, 21 | Eliminates redundant web calls | Instantaneous cache hits |
| Model Tier Downgrading | 09 (Opus -> Flash) | 90% cost reduction on feature | 4x faster response |
| Local Embeddings (FastEmbed/MiniLM) | 11, 13, 19, 20 | Zero embedding API cost | Zero external network latency |
