# Unified SaaS Product Structure

The goal of this initiative is to unify 24 separate student prototypes into ONE coherent, world-class SaaS platform for content creators: **CreatorStudio AI** (or **OmniCreator AI**).

The final application will NOT be a disconnected list of 24 tools. Instead, it will be structured into 8 cohesive product domains accessible through a single unified navigation interface, powered by a single authentication system, unified project workspaces, a single database, and an integrated asset management system.

---

## Unified Product Hierarchy

```text
OmniCreator SaaS
├── Authentication (Single Sign-On, User Profile, Subscription Tiers)
├── Project Switcher (Active Workspace / Channel / Brand Profile)
│
├── 1. Executive Dashboard
│   ├── Quick Actions (New Project, Repurpose Content, Generate Hooks)
│   ├── Active Content Pipeline Status
│   ├── Recycling Alerts (Evergreen Posts Ready for Rework)
│   ├── Trend Radar (Live Topics Ingested for Creator Niche)
│   └── Monthly Quota & Generation Token Meter
│
├── 2. Strategy & Ideation Hub
│   ├── Trend Hunter (Application 18G - Real-time social trend analysis)
│   ├── Idea Generator (Application 01 - YouTube & multi-angle concepts)
│   ├── Audience Intelligence (Application 10 + 11 - Clustered comment demand)
│   ├── Daily Content Planner (Application 04 - Time & goal-based scheduling)
│   └── Research Dossier (Application 12 - Deep facts, angles & sources)
│
├── 3. Production Studio
│   ├── Scriptwriting Suite (Application 05, 18, 20)
│   │   ├── 30-60s Reel Script Builder (with timeline & visual cues)
│   │   ├── 7-Stage Production Director (Research -> Script -> Shot List)
│   │   └── Screenplay & Narrative Room (Character bible & act continuity)
│   ├── Hook Engine (Application 03 - 10 psychological angles with safety checks)
│   ├── CTA Builder (Application 09 - Goal-aligned conversion triggers)
│   ├── Visual & Cover Ideator (Application 07 - Thumbnail concepts & canvas previews)
│   └── Caption Studio (Application 08 - Multi-modal photo-to-caption studio)
│
├── 4. Repurposing & Multi-Platform Engine
│   ├── 1-to-All Content Repurposer (Application 02)
│   │   ├── LinkedIn Thought Leadership Carousel & Post
│   │   ├── Instagram Multi-Slide Carousel & Reel Caption
│   │   ├── X (Twitter) Hook & Thread
│   │   └── YouTube Long-form Outline & Short Script
│   └── Podcast & Audio Transcriber (Application 14)
│       └── Transcripts -> Titles, Chapters, Highlights & Social Snippets
│
├── 5. Video & Media Studio (Specialized Processing)
│   ├── Clip Finder (Application 06)
│   │   ├── YouTube / File Ingestion
│   │   ├── Faster-Whisper Speech-to-Text Transcription
│   │   ├── AI Viral Moment Detection (Timestamps & virality score)
│   │   └── Automatic FFmpeg Video Slicing & Subtitle Rendering
│
├── 6. Creator Knowledge & Voice Vault (The Second Brain)
│   ├── Second Brain Semantic Chat (Application 19)
│   │   ├── Multi-Agent Supervisor (Researcher, Drift Analyst, Promise Auditor)
│   │   └── Channel Knowledge Graph (Interactive 2D force graph)
│   ├── Voice Profiler (Application 13)
│   │   ├── Historical Post Ingestion (Text + Image OCR)
│   │   ├── Stylistic Fingerprint (Formality, humor, vocabulary, emoji ratio)
│   │   └── AI Draft Style Validation & Similarity Scoring
│
├── 7. Growth & Monetization
│   ├── Content Recycler & Evergreen Optimizer (Application 16)
│   │   ├── Performance Decay Analysis
│   │   └── Automated Action Bucketing (Repost, Rework, Repurpose, Archive)
│   ├── Brand Pitch Builder (Application 17)
│   │   ├── Creator Media Kit Management
│   │   ├── Brand Campaign Alignment Scoring
│   │   ├── Tiered Pricing Proposals ($)
│   │   └── PDF Export & Pitch Email Drafter
│   └── Collaboration Finder (Application 26)
│       ├── Synergy Matchmaking Engine
│       └── Collaborative Outreach Drafter
│
└── 8. Autonomous Orchestrator (Autonomous Content Pipeline)
    ├── Master Campaign Runner (Application 21)
    │   ├── One-Click Full Campaign (Research -> YouTube -> 3x Reels -> LinkedIn -> X)
    │   ├── LangGraph State Machine Execution & Self-Criticism
    │   └── Real-Time SSE Progress Monitor & Publishing Calendar
```

---

## Architectural Mapping Table

| Unified Product Domain | Integrated Applications | Primary Capabilities Delivered |
|------------------------|-------------------------|--------------------------------|
| **1. Dashboard** | `18G`, `16`, `21` | Quota meters, trend feed, recycling alerts, active pipeline runs |
| **2. Strategy & Ideation** | `01`, `04`, `10`, `11`, `12`, `18G` | Trend ingestion, comment mining, concept generation, research dossier |
| **3. Production Studio** | `03`, `05`, `07`, `08`, `09`, `18`, `20` | Scripting, hooks, CTAs, thumbnail design, caption generation |
| **4. Repurposing Engine** | `02`, `14` | Synchronous cross-platform generation, podcast chaptering |
| **5. Video & Media Studio** | `06` | Whisper transcription, viral moment detection, FFmpeg clip cutting |
| **6. Knowledge & Voice Vault** | `13`, `19` | Channel ingestion, pgvector semantic search, voice style cloning |
| **7. Growth & Monetization** | `16`, `17`, `26` | Evergreen decay scoring, brand pitch proposals, creator matchmaking |
| **8. Autonomous Orchestrator** | `21` (fulfills `22`) | End-to-end multi-agent pipeline from seed idea to publishing calendar |
