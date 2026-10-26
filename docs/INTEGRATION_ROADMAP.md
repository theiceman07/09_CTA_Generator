# Application Integration Roadmap

Applications are sequenced based on architectural dependency hierarchy, code maturity, reusability, and risk profile.

---

## Integration Priority Matrix

```text
Priority 1: Foundational Utilities (Fast, Stateless, High Value)
   ├── App 02: Content Repurposer (Highest utility, clean FastAPI backend)
   ├── App 03: Hook Generator (Clean prompt guardrails & Zod schemas)
   ├── App 09: CTA Generator (High utility conversion tool)
   ├── App 01: Content Idea Generator (Core ideation input)
   └── App 08: Caption Assistant (Multi-modal caption generator)

Priority 2: Structured Production (Core Creation Modules)
   ├── App 05: Reel Script Builder (Proven LangSmith tracing)
   ├── App 12: Creator Research Assistant (Deep context injection)
   ├── App 07: Thumbnail Ideator (Visual cover ideation)
   ├── App 14: Podcast Assistant (Long-form audio summarizer)
   └── App 18G: Content Director Guruvelah (Production SaaS patterns)

Priority 3: Memory, Voice & Audience (Data-Driven Personalization)
   ├── App 13: Voice Replicator (pgvector style profile)
   ├── App 10: Comment Analyzer (Instagram Graph connector)
   ├── App 11: Comment-to-Content (Demand scoring & clustering)
   ├── App 16: Content Recycler (Evergreen decay math)
   └── App 17: Brand Pitch Builder (Sponsorship proposals)

Priority 4: Autonomous Agents & Heavy Media (Advanced Infrastructure)
   ├── App 19: Creator Second Brain (Supervisor multi-agent)
   ├── App 21: Autonomous Content Pipeline (LangGraph orchestrator)
   ├── App 20: AI Screenplay Workspace (Narrative workspace)
   ├── App 26: Collaboration Finder (Syndicate matchmaking)
   └── App 06: Clip Finder (FFmpeg + Whisper video worker)
```

---

## Detailed Sequence Justification

### Why Application 02 (`Content Repurposer`) Must Be First:
1. **Architectural Purity**: Built cleanly in FastAPI with Pydantic schemas and LangChain orchestration.
2. **Immediate Value**: Solves the fundamental value proposition of a creator SaaS (turn 1 idea into LinkedIn, Instagram, X, and YouTube assets).
3. **Core Anchor**: The input/output schemas of App 02 define the canonical content structure for the entire platform.

### Why Application 06 (`Clip Finder`) Must Be Last:
1. **Infrastructure Weight**: Requires host-level FFmpeg, yt-dlp, and local Faster-Whisper C-extensions.
2. **Deployment Burden**: A Docker container for App 06 is > 4GB, whereas the rest of the web platform is < 250MB.
3. **Isolation Required**: Must be deployed to a dedicated worker pool after the core web platform is fully operational.
