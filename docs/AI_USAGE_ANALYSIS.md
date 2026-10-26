# AI Architecture and Usage Analysis

This document provides a rigorous architectural evaluation of how Artificial Intelligence is implemented across the 24 application branches. It details the workflow diagrams, model providers, execution patterns (sequential vs. parallel), prompt architectures, structured output enforcement, validation, memory, RAG, and multi-agent coordination.

---

## Architectural Classification of AI Mechanisms

To avoid imprecise industry jargon, all AI implementations are categorized into one of seven technical execution primitives:

1. **Direct LLM Call**: Single API invocation sending an input prompt and returning unstructured text or raw completion.
2. **Chain**: Deterministic sequence of prompt template, model invocation, and output parser (e.g. LCEL: `prompt | model | parser`).
3. **Workflow**: Multi-stage state machine where intermediate outputs feed subsequent domain tasks with conditional branching.
4. **Router**: Model or programmatic logic directing incoming user requests to distinct downstream handlers.
5. **Tool**: Deterministic function or external API made available for an LLM to call during execution.
6. **Agent**: Loop where an LLM dynamically evaluates context, selects tools, inspects tool observations, and iterates until completion.
7. **Background Job**: Asynchronous worker performing batch embeddings, transcript ingestion, or video rendering detached from the HTTP request cycle.

---

## Application-by-Application AI Workflow Analysis

### 01. Content Idea Generator (`01_Content_Idea_Generator`)
- **Primitive**: Chain (LangChain LCEL)
- **Workflow Diagram**:
  ```text
  User Input (Topic + Audience)
          ↓
  ChatPromptTemplate (YouTube Creator Prompt)
          ↓
  ChatGoogleGenerativeAI (Google Gemini)
          ↓
  Structured Output Parser (Zod Schema)
          ↓
  JSON Response (10 YouTube Ideas)
  ```
- **Number of LLM Calls**: Exactly 1 call per generation.
- **Call Pattern**: Single synchronous invocation.
- **Model**: Google Gemini.
- **Structured Output**: Strictly enforced via Zod schema (`IdeaSchema.array()`).
- **Validation**: Schema-level type checking; fails gracefully if schema is violated.
- **Memory / RAG / Embeddings**: None.

---

### 02. Content Repurposer (`02_Content_Repurposer`)
- **Primitive**: Hybrid Chain + Parallel Workflow
- **Workflow Diagram**:
  ```text
                     User Long-Form Content Input
                                  ↓
                     Content Analysis Chain (Gemini)
                     (Core Thesis, Key Takeaways, Tone)
                                  ↓
         +------------------------+------------------------+
         |                        |                        |
         v                        v                        v
  LinkedIn Chain           Instagram Chain              X Chain
     (Gemini)                 (Gemini)                 (Gemini)
         |                        |                        |
         +------------------------+------------------------+
                                  |
                                  v
                         YouTube Script Chain
                               (Gemini)
                                  ↓
                        Consolidated Response
  ```
- **Number of LLM Calls**: 1 sequential analysis call + N parallel platform calls (up to 5 calls total per request).
- **Call Pattern**: Sequential stage 1 (Content Analysis) feeding parallel stage 2 (Platform generation chains via `asyncio.gather`).
- **Model**: `gemini-3.1-flash-lite`.
- **Structured Output**: Enforced via Pydantic models (`ContentAnalysis`, `LinkedInPost`, `InstagramCarousel`, `XThread`, `YouTubeScript`).
- **Validation**: Strict Pydantic parsing with error sanitization.
- **Observability**: LangSmith tracing integrated.
- **Memory / RAG / Embeddings**: None.

---

### 03. Hook Generator (`03_Hook_Generator`)
- **Primitive**: Chain with Prompt Guardrails
- **Workflow Diagram**:
  ```text
  User Input (Topic, Platform, Tone, Audience)
          ↓
  LangChain Prompt Template + Statistical Safety Guardrails
          ↓
  ChatGoogleGenerativeAI (gemini-2.5-pro)
          ↓
  Structured Output Parser (Zod Schema with 10 exact styles)
          ↓
  10 Platform-Optimized Hook Cards
  ```
- **Number of LLM Calls**: 1 call per request.
- **Call Pattern**: Synchronous single call.
- **Model**: `gemini-2.5-pro` (with fallback logic).
- **Prompt Architecture**: Strict statistical safety instructions preventing hallucination of fake percentages or study figures.
- **Structured Output**: Enforced via Zod (`HookListSchema` requiring exactly 10 hooks).
- **Validation**: Server-side validation with user-friendly error fallbacks.
- **Memory / RAG / Embeddings**: None.

---

### 04. Daily Content Planner (`04_Daily_Content_Planner`)
- **Primitive**: Deterministic Heuristic Engine (Non-LLM)
- **Workflow Diagram**:
  ```text
  User Input (Niche, Goal, Time, Tone, Platform)
          ↓
  Client-side State Processing
          ↓
  Local Heuristic Template Engine (Broken imports in repo)
          ↓
  Daily Content Card
  ```
- **Number of LLM Calls**: 0.
- **Status**: The branch attempted to use client-side rule templates, but omitted the engine files from git commit.

---

### 05. Reel Script Builder (`05_Reel_Script_Builder`)
- **Primitive**: Traced Chain
- **Workflow Diagram**:
  ```text
  User Input (Topic, Tone)
          ↓
  LangChain Prompt (30-60s Script Structure)
          ↓
  ChatGoogleGenerativeAI (gemini-3.8-flash)
  [Traced via LangSmith]
          ↓
  JSON Parsing & Hook/Body/CTA Formatting
          ↓
  Frontend Script Timeline
  ```
- **Number of LLM Calls**: 1 call per request.
- **Call Pattern**: Single synchronous call.
- **Model**: `gemini-3.8-flash`.
- **Observability**: Built-in `@traceable` decorator sending run metadata to LangSmith.
- **Structured Output**: Regular expression / JSON extraction.
- **Memory / RAG / Embeddings**: None.

---

### 06. Clip Finder (`06_Clip_Finder`)
- **Primitive**: Multi-Modal Media Pipeline + LLM Analysis
- **Workflow Diagram**:
  ```text
  Video Upload / YouTube URL
          ↓
  yt-dlp Video Download (if URL)
          ↓
  FFmpeg Audio Extraction (.wav)
          ↓
  Faster-Whisper Local Transcription (Timestamped Chunks)
          ↓
  Ollama / Llama 3.2 Transcript Evaluation Prompt
  (Identify High-Virality Moments with Start/End Timestamps)
          ↓
  FFmpeg Video Segment Slicing
          ↓
  SQLite Database Record & Streamlit Video Playback
  ```
- **Number of LLM Calls**: 1 per video transcript.
- **Call Pattern**: Sequential pipeline (Download -> Extract -> Transcribe -> Analyze -> Slice).
- **Models**: `faster-whisper` (Speech-to-text), `llama3.2` via Ollama (Analysis).
- **Tools**: FFmpeg CLI, yt-dlp CLI.
- **Structured Output**: JSON schema with timestamps (`start_time`, `end_time`, `virality_score`, `reason`).
- **Memory / RAG / Embeddings**: None.

---

### 07. Thumbnail Ideator (`07_Thumbnail_Ideator`)
- **Primitive**: Direct LLM Call with JSON Schema
- **Workflow Diagram**:
  ```text
  User Input (Title, Topic, Format)
          ↓
  System Prompt (Instagram & YouTube Visual Director)
          ↓
  GoogleGenAI (gemini-2.5-flash) with response_mime_type="application/json"
          ↓
  Zod Schema Validation
          ↓
  Client-Side Visual Thumbnail Card Preview & Canvas Export
  ```
- **Number of LLM Calls**: 1 call.
- **Model**: `gemini-2.5-flash`.
- **Structured Output**: Native Gemini JSON schema mode validated via Zod.
- **Memory / RAG / Embeddings**: None.

---

### 08. Caption Assistant (`08_Caption_Assistant`)
- **Primitive**: Multi-Modal Sequential Chain
- **Workflow Diagram**:
  ```text
  User Photo Upload (Optional) + Text Topic
          ↓
  Vision LLM (Gemini Vision / Gemma3:4b / Claude)
  (Generates Detailed Scene & Aesthetic Description)
          ↓
  Text Generation LCEL Chain (Prompt | Model | Parser)
          ↓
  PydanticOutputParser (4 Structured Captions: Punchy, Story, Educational, Engaging)
          ↓
  Studio UI Output with Hashtags & Character Counter
  ```
- **Number of LLM Calls**: 1 call (if text only) or 2 sequential calls (Vision description -> Caption generation).
- **Call Pattern**: Sequential multi-modal chaining.
- **Models**: `gemini-3.8-flash` (default), local `gemma3`, or `claude-3-5-haiku`.
- **Structured Output**: Pydantic validated output parser.
- **Memory / RAG / Embeddings**: None.

---

### 09. CTA Generator (`09_CTA_Generator`)
- **Primitive**: Direct SDK with Rate Limiting & Heuristic Fallback
- **Workflow Diagram**:
  ```text
  User Input (Goal, Platform, Context, Tone)
          ↓
  In-Memory Rate Limiter Check (10/min, 80/day)
          ↓
  Anthropic Claude SDK (claude-opus-5 / claude-sonnet-5)
  (Or fallback to offline rule matrix if no key)
          ↓
  Structured Output Parsing (Zod)
          ↓
  Three.js Dynamic Shader UI
  ```
- **Number of LLM Calls**: 1 call per generation (or 0 if running in offline mode).
- **Call Pattern**: Synchronous single call.
- **Model**: `claude-opus-5` / `claude-sonnet-5`.
- **Structured Output**: Zod schema.
- **Memory / RAG / Embeddings**: None.

---

### 10. Comment Analyzer (`10_Comment_Analyzer`)
- **Primitive**: Batch Classification Workflow
- **Workflow Diagram**:
  ```text
  Instagram Post URL / Comment List
          ↓
  Meta Graph API Fetch / JSON Parser
          ↓
  Spam Filtering Regex
          ↓
  Batch Chunker (25 comments per batch)
          ↓
  Google Gemini Batch Classification Prompt
  (Classify each comment into Theme, Question, Complaint, Opportunity)
          ↓
  SQLite Database Storage & Metrics Aggregation
          ↓
  Dashboard Visualizations
  ```
- **Number of LLM Calls**: `ceil(N / 25)` calls (e.g. 100 comments = 4 batch LLM calls).
- **Call Pattern**: Sequential batching with rate-limiting sleeps.
- **Model**: Google Gemini.
- **Structured Output**: Array of JSON objects mapping comment ID to category and subcategory.
- **Memory / RAG / Embeddings**: None.

---

### 11. Comment-to-Content (`11_Comment_to_Content`)
- **Primitive**: End-to-End NLP + ML + LLM Pipeline
- **Workflow Diagram**:
  ```text
  Raw Comment Dataset
          ↓
  1. Regex & Emoji Spam Cleaner (`clean.py`)
          ↓
  2. Intent Classifier (`intent.py` - Request, Question, Pain Point, Confusion)
          ↓
  3. SentenceTransformer Embeddings + KMeans/HDBSCAN Clustering (`cluster.py`)
          ↓
  4. Intent Weighted Demand Scoring (`score.py`)
          ↓
  5. Content Gap Cosine Similarity against Past Posts (`gap.py`)
          ↓
  6. Claude 3.7 Idea Generation for Top Clusters (`ideas.py`)
          ↓
  7. Claude Automated Creator Reply Drafting (`replies.py`)
          ↓
  SQLite Database (`comidea.db`) & Next.js Analytics Dashboard
  ```
- **Number of LLM Calls**: 2 to 4 LLM calls per pipeline run (Intent classification, Cluster naming, Idea generation, Reply drafting), combined with local ML embedding inferences.
- **Call Pattern**: Linear multi-stage pipeline.
- **Models**: `claude-3-7-sonnet-20250219`, `paraphrase-multilingual-MiniLM-L12-v2`.
- **RAG / Embeddings**: Local embeddings generated via `sentence-transformers` for semantic clustering and cosine similarity gap analysis.
- **Structured Output**: Pydantic schema validation across all pipeline stages.

---

### 12. Creator Research Assistant (`12_Creator_Research_Assistant`)
- **Primitive**: Direct LLM Call with Context Expansion
- **Workflow Diagram**:
  ```text
  Topic + Target Audience + Depth
          ↓
  Acronym Expansion & Query Refinement
          ↓
  Gemini 2.5 Flash Deep Fact Extraction Prompt
          ↓
  Structured Response Parsing (Key Facts, Contrarian Angles, Sources, Misconceptions)
          ↓
  Research Dossier UI
  ```
- **Number of LLM Calls**: 1 call.
- **Model**: `gemini-2.5-flash`.
- **Structured Output**: JSON schema with typed research nodes.
- **Memory / RAG / Embeddings**: None.

---

### 13. Voice Replicator (`13_Voice_Replicator`)
- **Primitive**: Multi-Modal Vector RAG + Style Profiling + Evaluator Chain
- **Workflow Diagram**:
  ```text
  Historical Instagram Posts (Captions + Images)
          ↓
  EasyOCR Image Text Extraction + spaCy NLP Tokenization
          ↓
  SentenceTransformers (`all-MiniLM-L6-v2`) Embedding Generation
          ↓
  PostgreSQL `pgvector` Storage & Vector Indexing
          ↓
  Style Profiler (Formality, Humor, Emoji Ratio, Vocabulary Richness)
          ↓
  Draft Generation Prompt (Style Profile + Retrieved Few-Shot Historical Posts)
          ↓
  Gemini 2.5 Flash Generation
          ↓
  Evaluator LLM Call (Calculates Voice Adherence Score & Style Drift)
          ↓
  Validated Creator Draft
  ```
- **Number of LLM Calls**: 2 calls per draft generation (1 for Generation conditioned on few-shot profile, 1 for Validation & Scoring).
- **Call Pattern**: Sequential (Generation -> Validation).
- **Models**: `gemini-2.5-flash`, `all-MiniLM-L6-v2` (Embeddings), spaCy English model.
- **RAG / Embeddings**: True RAG implementation using PostgreSQL `pgvector` for similarity matching against creator's historical catalogue.
- **Structured Output**: Pydantic schemas for style metrics and draft payloads.

---

### 14. Podcast Assistant (`14_Podcast_Assistant`)
- **Primitive**: Direct Structured LLM Call
- **Workflow Diagram**:
  ```text
  Podcast Transcript
          ↓
  Transcript Pre-validation & Truncation Check
          ↓
  Gemini 1.5/3.8 Flash Generation Prompt
          ↓
  Structured Output Parsing (Title, Description, Chapters, Highlights)
          ↓
  Podcast Production Dashboard
  ```
- **Number of LLM Calls**: 1 call.
- **Model**: `gemini-1.5-flash` / `gemini-3.8-flash`.
- **Structured Output**: Native JSON output validation.
- **Memory / RAG / Embeddings**: None.

---

### 15. Creator Workspace (`15_Creator_Workspace`)
- **Primitive**: Contextual Stage Generation Chain
- **Workflow Diagram**:
  ```text
  Kanban Stage Selection (Idea / Research / Script / Draft) + Input Prompt
          ↓
  Stage-Specific System Prompt
          ↓
  Google Gemini 3.5 Flash Lite (`@google/generative-ai`)
          ↓
  Text Formatting & Stage Card Creation
          ↓
  Kanban Board Update
  ```
- **Number of LLM Calls**: 1 call per stage action or refinement.
- **Model**: `gemini-3.5-flash-lite`.
- **Structured Output**: Unstructured text placed into stage state.
- **Memory / RAG / Embeddings**: None.

---

### 16. Content Recycler (`16_Content_Recycler`)
- **Primitive**: Algorithmic NLP & Mathematical Scoring (Non-LLM)
- **Workflow Diagram**:
  ```text
  Historical Instagram Post Dataset
          ↓
  Evergreen Keyword Matching (Heuristic dictionary)
          ↓
  Time Decay Curve Calculation (`exp(-lambda * t)`)
          ↓
  Engagement Rate Baseline Comparison
          ↓
  TF-IDF Vector Space Construction & Cosine Similarity Deduplication
          ↓
  Tactical Categorization (Repost, Rework, Repurpose, Archive)
          ↓
  Recycling Calendar
  ```
- **Number of LLM Calls**: 0.
- **AI / Algorithm Type**: Deterministic mathematical modeling and TF-IDF NLP vector analysis.

---

### 17. Brand Pitch Builder (`17_Brand_Pitch_Builder`)
- **Primitive**: Multi-Stage LangChain Proposal Chain
- **Workflow Diagram**:
  ```text
  Creator Media Profile + Brand Campaign Goals
          ↓
  Alignment Analysis Chain (Gemini via `@langchain/google-genai`)
  (Computes Alignment Score 0-100 & Strategic Synergy)
          ↓
  Proposal Generation Chain
  (Generates Tiered Packages, Deliverables, Email Pitches)
          ↓
  SQLite Database Record & Client PDF Export
  ```
- **Number of LLM Calls**: 2 calls (1 for alignment scoring, 1 for comprehensive proposal synthesis).
- **Call Pattern**: Sequential chaining.
- **Model**: Google Gemini.
- **Framework**: LangChain (`@langchain/google-genai`).
- **Structured Output**: Zod / JSON parsing.
- **Memory / RAG / Embeddings**: None.

---

### 18. AI Content Director (`18_AI_Content_Director`)
- **Primitive**: 7-Stage Cascading Production Pipeline
- **Workflow Diagram**:
  ```text
  Seed Topic
      ↓
  Stage 1: Research (Claude 3.5 Sonnet) ───┐
      ↓                                    │
  Stage 2: Angles (Claude 3.5 Sonnet) ─────┤
      ↓                                    │ Context
  Stage 3: Narrative (Claude 3.5 Sonnet) ──┤ Passed
      ↓                                    │ Downward
  Stage 4: Script (Claude 3.5 Sonnet) ─────┤
      ↓                                    │
  Stage 5: Visuals (Claude 3.5 Sonnet) ────┤
      ↓                                    │
  Stage 6: Shot List (Claude 3.5 Sonnet) ──┤
      ↓                                    │
  Stage 7: Publishing (Claude 3.5 Sonnet) ─┘
      ↓
  Comprehensive Production Bible
  ```
- **Number of LLM Calls**: 7 sequential calls for a full pipeline run.
- **Call Pattern**: Strictly sequential cascading pipeline where each stage depends on the cumulative context of preceding stages.
- **Model**: `claude-3-5-sonnet-20241022` (with high-fidelity mock fallback).
- **Structured Output**: Zod validation schemas for all 7 stages.
- **Memory / RAG / Embeddings**: Context window passing across stages.

---

### 18G. AI Content Director (Guruvelah Edition) (`18_AI_Content_Director_Guruvelah`)
- **Primitive**: Production Monolith with Trend Ingestion & Regeneration Routers
- **Workflow Diagram**:
  ```text
  External YouTube / Social Trend Scraper (Cron / On-Demand)
          ↓
  Supabase Trend Storage
          ↓
  User Selection + Prompt Settings
          ↓
  Creator Memory Aggregation (`aggregateCreatorMemory`)
          ↓
  Orchestrator Module (`generateContentPackage`)
  (Gemini 3.5 Flash Lite / 1.5 Pro)
          ↓
  Parallel Sub-Modules:
  - HookGeneratorModule
  - ScriptGeneratorModule
  - CaptionGeneratorModule
  - ShotListDerivation (Domain Logic)
          ↓
  Audit Log (`logAICall`) + Quota Deduction (`recordUsageEvent`)
          ↓
  PostgreSQL (Supabase) Database Storage
  ```
- **Number of LLM Calls**: 3 to 4 parallel model calls per content generation package; 1 call per single regeneration.
- **Call Pattern**: Fan-out / Fan-in parallel generation governed by domain orchestrator.
- **Models**: `gemini-3.5-flash-lite`, `gemini-1.5-pro`, `gemini-2.0-flash`.
- **Framework**: `@google/genai` with Zod validation.
- **Memory**: Database-backed creator feedback and past generation history retrieval.
- **Observability**: Custom PostgreSQL AI logging service (`ai-log-service.ts`) tracking latency, tokens, and errors.

---

### 19. Creator Second Brain (`19_Creator_Second_Brain`)
- **Primitive**: Multi-Agent Supervisor Architecture with Vector RAG
- **Workflow Diagram**:
  ```text
  YouTube Channel / Video Ingestion
          ↓
  Transcript Fetcher (`youtube-transcript-api`) + Audio Transcription
          ↓
  Chunking + FastEmbed Vector Generation
          ↓
  PostgreSQL `pgvector` Storage
          ↓
  User Chat Interface (SSE Stream)
          ↓
  Supervisor Agent (LangGraph / LangChain Groq)
          ├── Tool Call 1: Researcher Specialist
          ├── Tool Call 2: Clip Editor Specialist
          ├── Tool Call 3: Drift Analyst Specialist
          ├── Tool Call 4: Connections Specialist
          └── Tool Call 5: Promise Auditor Specialist
          ↓
  Tool Observation & Specialist Card Synthesis
          ↓
  Streaming Output + Force Graph Update
  ```
- **Number of LLM Calls**: Dynamic (1 supervisor routing call + 1 to 3 specialist agent executions per turn).
- **Call Pattern**: Dynamic agent loop with tool reflection.
- **Model**: `llama-3.3-70b-versatile` via Groq Cloud (`langchain-groq`).
- **Framework**: LangChain + LangGraph (`langgraph ==1.2.12`, `langgraph-checkpoint-sqlite`).
- **Tools**: Vector search (`tools/search.py`), library introspection (`tools/library.py`), draft composer (`tools/compose.py`).
- **Memory / State**: LangGraph SQLite checkpointer managing multi-turn agent thread states.

---

### 20. AI Screenplay Workspace (`20_AI_Screenplay_Workspace`)
- **Primitive**: LangGraph Agent with Vector Memory
- **Workflow Diagram**:
  ```text
  Screenplay PDF Upload / Text
          ↓
  RecursiveCharacterTextSplitter Chunking
          ↓
  GoogleGenerativeAIEmbeddings
          ↓
  ChromaDB Vector Store Ingestion
          ↓
  User Scene Request
          ↓
  LangGraph Continuity Graph:
  - Retrieve Character Rules & Location Context
  - Check Scene Continuity against Prior Acts
  - Generate Screenplay Action & Dialogue
          ↓
  Screenplay Document Preview
  ```
- **Number of LLM Calls**: 2 to 3 calls per scene generation.
- **Call Pattern**: LangGraph cyclical graph.
- **Models**: `gemini-1.5-pro-latest` / `gpt-4o`.
- **Framework**: LangChain + LangGraph + ChromaDB.
- **RAG / Embeddings**: Local ChromaDB storing script chunks and character bible entries.

---

### 21. Autonomous Content Pipeline (`21_Autonomous_Content_Pipeline`)
- **Primitive**: Distributed LangGraph Multi-Agent Architecture
- **Workflow Diagram**:
  ```text
  Seed Topic
      ↓
  Fastify Agent Service (`apps/agent`)
      ↓
  LangGraph Plan Graph (`src/graphs/plan/index.ts`):
      ├── 1. Research Node (DuckDuckGo web scrape via `duck-duck-scrape`)
      ├── 2. Master YouTube Script Generation (Gemini 3.8 Flash)
      ├── 3. Critic & Evaluation Node (Self-Correction Loop)
      └── 4. State Checkpoint (`checkpointer.ts`)
      ↓
  LangGraph Refine Graph (`src/graphs/refine/index.ts`):
      ├── 5. 3x Viral Reel Generator (Parallel Fan-out)
      ├── 6. LinkedIn Thought Leadership Post Generator
      ├── 7. X (Twitter) Thread Generator
      └── 8. Hashtag & Caption Synchronizer
      ↓
  Scheduling Engine (`@contentyou/scheduling`)
      ↓
  MongoDB Storage (`@contentyou/db`)
      ↓
  Real-Time SSE Event Stream to Web Frontend (`apps/web`)
  ```
- **Number of LLM Calls**: 6 to 9 calls per complete pipeline run.
- **Call Pattern**: Hierarchical state graphs (Sequential Plan Graph with Critic Loop -> Parallel Refine Graph Fan-out).
- **Models**: `gemini-3.8-flash`, `gemini-3.1-pro`, `gpt-4o`.
- **Framework**: `@langchain/langgraph ^1.4.18`, `@langchain/core`, `@google/genai`, `openai`.
- **Tools**: Web search scraper (`duck-duck-scrape`).
- **Memory / State**: Checkpointed LangGraph state persistence with MongoDB backing.

---

### 22. AI Creative Producer (`22_AI_Creative_Producer`)
- **Primitive**: Unsubmitted / Pending (0 LLM Calls).

---

### 26. Creator Collaboration Finder (`26_Creator_Collaboration_Finder`)
- **Primitive**: Deterministic Heuristic Algorithm (Non-LLM, 0 LLM Calls).
- **Mechanism**: Jaccard similarity index across skills and niches, combined with audience size ratio weighting and platform compatibility matrices in pure JavaScript (`engine.js`).

---

## AI Architecture Summary Matrix

| Application | AI Provider | Exact Model | Framework | Architecture Primitive | Calls / Action | Structured Output |
|-------------|-------------|-------------|-----------|------------------------|----------------|-------------------|
| 01 | Google | Gemini | LangChain | Chain | 1 (Sync) | Zod Schema |
| 02 | Google | `gemini-3.1-flash-lite` | LangChain | Parallel Chaining | 2-5 (Seq + Par) | Pydantic Models |
| 03 | Google | `gemini-2.5-pro` | LangChain | Chain with Guardrails | 1 (Sync) | Zod Schema (10 items) |
| 04 | None | None | None | Offline Templates | 0 | None |
| 05 | Google | `gemini-3.8-flash` | LangChain + LangSmith | Traced Chain | 1 (Sync) | JSON Extraction |
| 06 | Local / Ollama | `llama3.2` + Whisper | Direct REST | Multi-Modal Pipeline | 1 (Seq Pipeline) | JSON Schema |
| 07 | Google | `gemini-2.5-flash` | Google GenAI SDK | Direct LLM Call | 1 (Sync) | Zod Schema |
| 08 | Multi | `gemini-3.8-flash` / Local | LangChain Core | Multi-Modal Chaining | 1-2 (Sequential) | Pydantic Parser |
| 09 | Anthropic | `claude-opus-5` | Anthropic SDK | Direct LLM Call | 1 (Sync) | Zod Schema |
| 10 | Google | Gemini | `@google/genai` | Batch Workflow | `ceil(N/25)` (Seq) | Array of JSON Objects |
| 11 | Anthropic | `claude-3-7-sonnet` | Anthropic SDK | NLP + Clustering Pipeline | 2-4 (Pipeline) | Pydantic Schemas |
| 12 | Google | `gemini-2.5-flash` | Google GenAI SDK | Direct LLM Call | 1 (Sync) | JSON Typing |
| 13 | Google | `gemini-2.5-flash` | Google GenAI SDK | Vector RAG + Evaluator | 2 (Seq + Scoring) | Pydantic Models |
| 14 | Google | `gemini-1.5-flash` | Direct Gemini Fetch | Direct LLM Call | 1 (Sync) | JSON Parsing |
| 15 | Google | `gemini-3.5-flash-lite` | `@google/generative-ai` | Stage Chaining | 1 (Sync) | Unstructured Text |
| 16 | None | None | Algorithmic NLP | Mathematical Scoring | 0 | JSON Models |
| 17 | Google | Gemini | LangChain | Chaining | 2 (Sequential) | Zod Schemas |
| 18 | Anthropic | `claude-3-5-sonnet` | Anthropic SDK | 7-Stage Cascading Pipeline | 7 (Sequential) | Zod Schemas |
| 18G | Google | `gemini-3.5-flash-lite` | Google GenAI SDK | Orchestrated Modular App | 3-4 (Parallel) | Zod Schemas |
| 19 | Groq | `llama-3.3-70b-versatile` | LangChain + LangGraph | Supervisor Multi-Agent | 2-4 (Agent Loop) | Tool Output Cards |
| 20 | Google / OpenAI | `gemini-1.5-pro` / `gpt-4o` | LangChain + LangGraph | Vector Continuity Graph | 2-3 (Cyclical) | Pydantic / JSON |
| 21 | Google / OpenAI | `gemini-3.8-flash` / `gpt-4o` | LangGraph | Distributed Multi-Agent | 6-9 (Plan + Refine) | Zod Schemas |
| 22 | None | None | None | Unsubmitted | 0 | None |
| 26 | None | None | Deterministic Math | Jaccard Algorithm | 0 | JSON Objects |
