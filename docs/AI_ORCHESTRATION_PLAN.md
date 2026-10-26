# AI Orchestration and Workflow Plan

## Orchestration Philosophy

A common architectural trap is attempting to force every separate capability into one monolithic AI chain. In a real-world SaaS, users demand speed, predictability, and modularity:
- A user generating a quick hook does not want to wait for an entire background research pipeline.
- An autonomous multi-platform campaign requires asynchronous queueing and event streaming.

Therefore, the AI Orchestration layer cleanly separates **Synchronous Stateless Calls** from **Asynchronous Multi-Agent Workflows**.

---

## Execution Primitives

| Execution Primitive | Behavior | Applications Utilizing Primitive |
|---------------------|----------|----------------------------------|
| **Direct Model Call** | Single inference, sub-second latency, zero state | `03` (Hooks), `07` (Thumbnails), `09` (CTAs), `12` (Research), `14` (Podcasts) |
| **Parallel Fan-out Chain** | Single analysis feeding parallel platform outputs | `02` (Content Repurposer), `08` (Captions) |
| **Sequential Wizard Pipeline** | Human-in-the-loop multi-stage progression | `18` (7-Stage Content Director), `17` (Brand Proposal) |
| **Supervisor Multi-Agent** | Conversational agent delegating to specialized tools | `19` (Creator Second Brain) |
| **Hierarchical State Graph** | Autonomous planner with critic loop & calendar queues | `21` (Autonomous Content Pipeline) |
| **Asynchronous Media Worker** | Non-LLM binary processing + Whisper STT | `06` (Clip Finder) |

---

## Detailed Orchestration Topologies

### 1. The Repurposing Fan-Out Topology (Synchronous)
```text
Client Request (Draft Text + Selected Platforms)
               │
               ▼
      FastAPI Repurpose Router
               │
               ▼
    Content Analysis Chain (Gemini Flash Lite)
    (Extracts: Core Thesis, Supporting Points, Target Emotion)
               │
               ├──────────────────────────┬──────────────────────────┐
               ▼                          ▼                          ▼
     LinkedIn Sub-Chain         Instagram Sub-Chain            X Thread Sub-Chain
     (Carousel Slides)           (Visual Captions)             (10-Tweet Thread)
               │                          │                          │
               └──────────────────────────┼──────────────────────────┘
                                          │
                                          ▼
                               Aggregated Response JSON
```

### 2. The Second Brain Supervisor Topology (Interactive Streaming)
```text
User Message ("Find my best takes on remote work and turn them into a reel")
               │
               ▼
     Supervisor Agent Node (Groq Llama 3.3 70B / LangGraph)
               │
       +───────┴───────────────────────+
       │ Evaluates tools:              │
       ▼                               ▼
Tool 1: Vector Search          Tool 2: Clip Editor
(Searches pgvector chunks)     (Extracts transcript timestamps)
       │                               │
       └───────┬───────────────────────┘
               │ Returns tool observations
               ▼
     Synthesizer Node (Streams text to client via SSE + renders specialist card)
```

### 3. The Autonomous Campaign Topology (LangGraph Asynchronous Runner)
```text
Seed Topic Input (e.g. "Future of Agentic AI")
               │
               ▼
        Plan State Graph
               │
               ├─► Node 1: Web Research (DuckDuckGo Search Scrape)
               ├─► Node 2: Master YouTube Script Generator (Gemini Flash)
               └─► Node 3: Critic Node (Evaluates script pacing & authority)
                     │
                     ├── [Fails Quality Threshold] ──► Loop back to Node 2
                     └── [Passes Threshold]
                              │
                              ▼
                      Refine State Graph
                              │
               +──────────────┼──────────────+
               ▼              ▼              ▼
          Reels Node    LinkedIn Node    X Thread Node
          (3x Scripts)   (Post Text)     (Full Thread)
               │              │              │
               +──────────────┼──────────────+
                              │
                              ▼
                     Scheduling Node (Calendar Queue Insertion)
```
