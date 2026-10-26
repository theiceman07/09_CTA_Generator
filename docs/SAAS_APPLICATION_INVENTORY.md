# SaaS Application Inventory

This inventory document provides a complete technical audit of all 24 application branches discovered in the repository `https://github.com/Rishi-ZAiFi/ASADI_Protosem01.git`.

## Executive Inventory Table

| # | Application | Branch | Student | Frontend | Backend | AI Model | AI Framework | Database | Storage |
|---|-------------|--------|---------|----------|---------|----------|--------------|----------|---------|
| 01 | Content Idea Generator | `01_Content_Idea_Generator` | Kavi Priya CA | Vanilla HTML/CSS/JS | Express (Node.js) | Google Gemini | LangChain (`@langchain/google-genai`) | None | In-Memory |
| 02 | Content Repurposer | `02_Content_Repurposer` | Jaishanth L | React 19 (Vite) | FastAPI (Python) | `gemini-3.1-flash-lite` | LangChain (`langchain-google-genai`) | None | In-Memory |
| 03 | Hook Generator | `03_Hook_Generator` | Mithra Ravi | Next.js 15 (React 19) | Next.js Server Route | `gemini-2.5-pro` | LangChain (`@langchain/google-genai`) | None | In-Memory |
| 04 | Daily Content Planner | `04_Daily_Content_Planner` | Theeran P | Next.js 14 (React 18) | Next.js Server Route | None (Broken rule imports) | None | LocalStorage | LocalStorage |
| 05 | Reel Script Builder | `05_Reel_Script_Builder` | PRAVEEN.A | Vanilla HTML/JS | FastAPI (Python) | `gemini-3.8-flash` | LangChain + LangSmith | None | In-Memory |
| 06 | Clip Finder | `06_Clip_Finder` | Manoj M | Streamlit | FastAPI / Python CLI | `llama3.2` (Ollama) + Whisper | Direct Ollama API + Faster-Whisper | SQLite | Local Filesystem (`data/`) |
| 07 | Thumbnail Ideator | `07_Thumbnail_Ideator` | Sanadhani | Next.js 14 (React 18) | Next.js Server Route | `gemini-2.5-flash` | Google GenAI SDK (`@google/genai`) | None | In-Memory / Client Canvas |
| 08 | Caption Assistant | `08_Caption_Assistant` | Tejaswi K | Vanilla HTML/JS | Flask (Python) | `gemini-3.8-flash` / Ollama / Claude | LangChain Core (LCEL) | None | Local Temp Files |
| 09 | CTA Generator | `09_CTA_Generator` | Malligaarjunan AVK | Next.js 15 (React 19) | Next.js Server Route | `claude-opus-5` / Fallback | Anthropic SDK + Heuristic Rules | None | IndexedDB (`idb-keyval`) |
| 10 | Comment Analyzer | `10_Comment_Analyzer` | Poornaa Shree Praveenraj | Vanilla HTML/JS | Express (Node.js) | Gemini via `@google/genai` | `@google/genai` + Heuristics | SQLite (`better-sqlite3`) | SQLite File |
| 11 | Comment-to-Content | `11_Comment_to_Content` | Satheesh | Next.js 16 (React 19) | FastAPI (Python) | `claude-3-7-sonnet-20250219` | Anthropic SDK + SentenceTransformers | SQLite (SQLAlchemy) | SQLite File (`comidea.db`) |
| 12 | Creator Research Assistant | `12_Creator_Research_Assistant` | Sudhiksha | Next.js 16 (React 19) | Next.js Server Route | `gemini-2.5-flash` | Google GenAI SDK | None | Client State |
| 13 | Voice Replicator | `13_Voice_Replicator` | Suryakumar J S | Next.js 16 (React 19) | FastAPI (Python) | `gemini-2.5-flash` | Google GenAI SDK + spaCy + EasyOCR | PostgreSQL + pgvector (SQLite fallback) | Local DB & Media Cache |
| 14 | Podcast Assistant | `14_Podcast_Assistant` | Priyadharshini B | Next.js 14 (React 18) | Next.js Server Route | `gemini-1.5-flash` / `gemini-3.8-flash` | Direct Gemini Fetch | None | In-Memory |
| 15 | Creator Workspace | `15_Creator_Workspace` | Aatif F | React 18 (Vite) | Express (Node.js) | `gemini-3.5-flash-lite` | `@google/generative-ai` | None | In-Memory |
| 16 | Content Recycler | `16_Content_Recycler` | Archana C | React 19 (Vite) | Express (Node.js) | None (Algorithmic NLP/TF-IDF) | Custom Evergreen/Decay Heuristics | MongoDB (In-memory fallback) | MongoDB |
| 17 | Brand Pitch Builder | `17_Brand_Pitch_Builder` | Prinetha kannan | React 18 (Vite) | Express (Node.js) | Gemini via `@langchain/google-genai` | LangChain (`@langchain/google-genai`) | SQLite (`node:sqlite`) | SQLite File |
| 18 | AI Content Director | `18_AI_Content_Director` | Sri Jananii S | Next.js 14 (React 18) | Next.js Server Route | `claude-3-5-sonnet-20241022` | Anthropic SDK + Zod | None | In-Memory |
| 18G | AI Content Director (Guruvelah) | `18_AI_Content_Director_Guruvelah` | Guruvelah | Next.js 15 (React 19) | Next.js Server Routes | `gemini-3.5-flash-lite` / `gemini-1.5-pro` | Google GenAI SDK (`@google/genai`) | PostgreSQL (Supabase) | Supabase Storage |
| 19 | Creator Second Brain | `19_Creator_Second_Brain` | Karthik Aravind M | Next.js 16 (React 19) | FastAPI (Python) | `llama-3.3-70b-versatile` (Groq) | LangChain + LangGraph | PostgreSQL + pgvector + SQLite | Vector DB & Local Storage |
| 20 | AI Screenplay Workspace | `20_AI_Screenplay_Workspace` | SaiSanjay R | Next.js 16 (React 19) | FastAPI (Python) | `gemini-1.5-pro-latest` / `gpt-4o` | LangChain + LangGraph | ChromaDB + MongoDB + Neo4j | Chroma Vector DB |
| 21 | Autonomous Content Pipeline | `21_Autonomous_Content_Pipeline` | Sudharshan R | Next.js 16 (React 19) | Fastify (Node.js) | `gemini-3.8-flash` / `gpt-4o` | LangGraph (`@langchain/langgraph`) | MongoDB | MongoDB |
| 22 | AI Creative Producer | `22_AI_Creative_Producer` | Udhayan K | None | None | None | None | None | None |
| 26 | Creator Collaboration Finder | `26_Creator_Collaboration_Finder` | Cohort Submission | Vanilla HTML/CSS/JS | None (Pure Client-side) | None (Deterministic Jaccard Algorithm) | None | LocalStorage | Browser LocalStorage |

---

## Detailed Application Profiles

### 01. Content Idea Generator (`01_Content_Idea_Generator`)
- **Student**: Kavi Priya CA
- **Purpose**: Solves creator ideation fatigue by generating 10 structured YouTube concepts with title, type, hook, and rationale based on topic and target audience.
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (`index.html`, `app.js`, `style.css`).
- **Backend**: Express.js server (`server/index.js`, port 3001).
- **Programming Languages**: JavaScript, HTML, CSS.
- **AI Provider**: Google Gemini via `@langchain/google-genai`.
- **AI Model**: Gemini (`ChatGoogleGenerativeAI`).
- **AI Framework**: LangChain (`@langchain/core`, `@langchain/google-genai`, `langchain`, `zod`).
- **Database**: None.
- **Storage**: In-memory only.
- **Authentication**: None.
- **External APIs**: Google Gemini API.
- **Important Dependencies**: `@langchain/core ^0.3.28`, `@langchain/google-genai ^0.1.7`, `express ^4.21.0`, `zod ^3.23.8`, `dotenv ^16.4.5`, `cors ^2.8.5`.
- **API Endpoints**:
  - `GET /api/health`
  - `POST /api/generate`
- **Input**: `{ "topic": string, "audience": string }`
- **Output**: JSON payload with `ideas: Array<{ type: string, title: string, hook: string, whyItWorks: string }>`
- **Startup Command**: `cd server && npm install && npm start`
- **Default Port**: Backend: 3001, Frontend: Static file (5500/Live Server).

### 02. Content Repurposer (`02_Content_Repurposer`)
- **Student**: Jaishanth L
- **Purpose**: Transforms a single piece of long-form thought or draft into 4 distinct, platform-optimized formats: LinkedIn carousel/post, Instagram slides & captions, X (Twitter) thread, and YouTube video/short script.
- **Frontend**: React 19, Vite, Lucide React, Oxlint (`frontend/src/App.jsx`).
- **Backend**: FastAPI Python (`backend/app.py`, port 8000).
- **Programming Languages**: Python, JavaScript (JSX), CSS.
- **AI Provider**: Google Gemini.
- **AI Model**: `gemini-3.1-flash-lite`.
- **AI Framework**: LangChain (`langchain`, `langchain-core`, `langchain-google-genai`).
- **Database**: None.
- **Storage**: In-memory.
- **Authentication**: None.
- **External APIs**: Google Gemini API, LangSmith tracing.
- **Important Dependencies**: `fastapi`, `uvicorn`, `pydantic`, `langchain`, `langchain-core`, `langchain-google-genai`, `react ^19.2.8`, `vite ^8.3.0`, `lucide-react ^1.48.0`.
- **API Endpoints**:
  - `GET /health`
  - `POST /api/generate`
- **Input**: `{ "content": string, "platforms": ["linkedin", "instagram", "x", "youtube"] }`
- **Output**: Structured JSON containing `content_analysis` and `repurposed` platform payloads.
- **Startup Command**: Backend: `uvicorn backend.app:app --port 8000`; Frontend: `cd frontend && npm run dev`
- **Default Port**: Backend: 8000, Frontend: 5173.

### 03. Hook Generator (`03_Hook_Generator`)
- **Student**: Mithra Ravi
- **Purpose**: Generates exactly 10 psychological scroll-stopping hooks (Curiosity, Question, Contrarian, Bold Claim, Statistic/Data, Story, Pain Point, Fear, Possibility, Surprise) with strict statistical safety rules.
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Lucide React.
- **Backend**: Next.js Server Route Handler (`src/app/api/generate-hooks/route.ts`).
- **Programming Languages**: TypeScript, React (TSX), CSS.
- **AI Provider**: Google Gemini.
- **AI Model**: `gemini-2.5-pro` (with fallback logic).
- **AI Framework**: LangChain (`@langchain/google-genai ^2.3.2`, `@langchain/core ^1.2.13`, `@google/genai ^2.24.0`).
- **Database**: None.
- **Storage**: In-memory.
- **Authentication**: None.
- **External APIs**: Google Gemini API.
- **Important Dependencies**: `next ^15.2.1`, `react ^19.0.0`, `@langchain/google-genai`, `@langchain/core`, `lucide-react`.
- **API Endpoints**:
  - `POST /api/generate-hooks`
- **Input**: `{ "topic": string, "platform": string, "tone": string, "audienceContext"?: string }`
- **Output**: `{ "hooks": Array<{ style: string, hook: string, angleExplanation: string }> }`
- **Startup Command**: `npm install && npm run dev`
- **Default Port**: 3000.

### 04. Daily Content Planner (`04_Daily_Content_Planner`)
- **Student**: Theeran P
- **Purpose**: Generates a daily content plan based on niche, primary daily goal, time available, tone, and platform.
- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion, Three.js (`@react-three/fiber`, `@react-three/drei`).
- **Backend**: Next.js client-side / server structure.
- **Programming Languages**: TypeScript, TSX, CSS.
- **AI Provider**: Intended local rule/template engine.
- **AI Model**: None.
- **AI Framework**: None.
- **Database**: None (local storage intended).
- **Storage**: LocalStorage.
- **Authentication**: None.
- **External APIs**: None.
- **Important Dependencies**: `next ^14.2.23`, `react ^18.3.1`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `lucide-react`.
- **API Endpoints**: Client-side Next.js routes (`/create`, `/plan/[id]`, `/history`).
- **Input**: `{ "niche": string, "goal": string, "time": string, "tone": string, "platform": string }`
- **Output**: Content plan card with title, hook, format badge, and timeline.
- **Startup Command**: `cd 04_Daily_Content_Planner && npm run dev`
- **Default Port**: 3000.
- **Critical Technical Note**: Missing committed imports (`src/lib/engine.ts`, `src/lib/storage.ts`) prevent clean building.

### 05. Reel Script Builder (`05_Reel_Script_Builder`)
- **Student**: PRAVEEN.A
- **Purpose**: Creates 30-60 second vertical video reel scripts with hook, timestamped body points, visual cues, on-screen text, audio suggestion, and CTA.
- **Frontend**: Vanilla HTML/JS (`frontend/index.html`).
- **Backend**: FastAPI Python (`app.py`, port 8000).
- **Programming Languages**: Python, HTML, JavaScript.
- **AI Provider**: Google Gemini.
- **AI Model**: `gemini-3.8-flash`.
- **AI Framework**: LangChain (`langchain-core`, `langchain-google-genai`) with LangSmith tracing (`@traceable`).
- **Database**: None.
- **Storage**: In-memory.
- **Authentication**: None.
- **External APIs**: Google Gemini API, LangSmith API.
- **Important Dependencies**: `fastapi`, `uvicorn`, `pydantic`, `python-dotenv`, `langchain-core`, `langchain-google-genai`, `langsmith`.
- **API Endpoints**:
  - `POST /api/generate-script`
  - `GET /`
- **Input**: `{ "topic": string, "tone": string }`
- **Output**: `{ "hook": string, "body": Array<{ timestamp, visual, narration, text_overlay }>, "cta": string, "audio_suggestion": string }`
- **Startup Command**: `uvicorn app:app --reload --port 8000`
- **Default Port**: 8000.

### 06. Clip Finder (`06_Clip_Finder`)
- **Student**: Manoj M
- **Purpose**: Ingests video files or YouTube URLs, transcribes audio using local Whisper, identifies viral clip moments with timestamps using an LLM, and slices MP4 clips using FFmpeg.
- **Frontend**: Streamlit (`app/main.py`, `app/premium_ui.py`).
- **Backend**: FastAPI / Python Pipeline (`app/server.py`, `app/video/ffmpeg_service.py`, `app/transcription/whisper_service.py`).
- **Programming Languages**: Python.
- **AI Provider**: Ollama (local) + faster-whisper.
- **AI Model**: `llama3.2` via Ollama; `faster-whisper` (`small` model).
- **AI Framework**: Direct Ollama REST client (`app/analysis/ollama_service.py`).
- **Database**: SQLite (`app/db.py`).
- **Storage**: Local filesystem (`data/uploads/`, `data/clips/`).
- **Authentication**: None.
- **External APIs**: YouTube (via `yt-dlp`), local Ollama (`http://localhost:11434`).
- **System Prerequisites**: Host must have FFmpeg installed.
- **Important Dependencies**: `fastapi >=0.100.0`, `streamlit >=1.30.0`, `faster-whisper >=0.10.0`, `yt-dlp >=2024.0.0`, `numpy`, `requests`, `pydantic`.
- **API Endpoints**: Streamlit web interface + internal API methods.
- **Input**: MP4/MOV upload or YouTube video URL.
- **Output**: Cut MP4 video clips, timestamped transcripts, virality scores.
- **Startup Command**: `streamlit run app/main.py`
- **Default Port**: 8501.

### 07. Thumbnail Ideator (`07_Thumbnail_Ideator`)
- **Student**: Sanadhani
- **Purpose**: Converts video titles and summaries into high-CTR cover concepts for Instagram Reels and YouTube thumbnails, emphasizing visual hooks, expressions, and color theory.
- **Frontend**: Next.js 14, React 18, Tailwind CSS, `html-to-image`.
- **Backend**: Next.js Server Route Handler (`app/api/generate/route.ts`).
- **Programming Languages**: TypeScript, React (TSX), CSS.
- **AI Provider**: Google Gemini.
- **AI Model**: `gemini-2.5-flash`.
- **AI Framework**: Google Gen AI SDK (`@google/genai ^1.0.0`) + Zod schema validation.
- **Database**: None.
- **Storage**: In-memory / client-side canvas download.
- **Authentication**: None.
- **External APIs**: Google Gemini API.
- **Important Dependencies**: `@google/genai ^1.0.0`, `html-to-image ^1.11.11`, `next 14.2.15`, `react ^18`, `zod ^3.23.8`, `tailwindcss ^3.4.1`.
- **API Endpoints**:
  - `POST /api/generate`
- **Input**: `{ "title": string, "topic": string, "format": string }`
- **Output**: Structured JSON with concepts (visual hook, expression, text overlay, background, color palette).
- **Startup Command**: `npm install && npm run dev`
- **Default Port**: 3000.

### 08. Caption Assistant (`08_Caption_Assistant`)
- **Student**: Tejaswi K
- **Purpose**: Generates 4 styles of platform-ready captions from either text topics or uploaded photos (using Vision LLM).
- **Frontend**: Vanilla HTML/JS/CSS (`static/index.html`, `static/studio.html`, `static/studio.js`).
- **Backend**: Python Flask (`app.py`, port 5000).
- **Programming Languages**: Python, HTML, JavaScript.
- **AI Provider**: Multi-provider (Google Gemini, Ollama, Anthropic Claude).
- **AI Model**: `gemini-3.8-flash` (default), `gemma3:1b`/`4b` (Ollama), `claude-3-5-haiku` (Anthropic).
- **AI Framework**: LangChain Core (`langchain-core >=0.3`, LCEL `ChatPromptTemplate`, `RunnableLambda`, `PydanticOutputParser`).
- **Database**: None.
- **Storage**: Local temporary photo cache.
- **Authentication**: None.
- **External APIs**: Google Gemini API, Anthropic API, Ollama endpoint.
- **Important Dependencies**: `flask >=3.0`, `requests >=2.31`, `python-dotenv >=1.0`, `langchain-core >=0.3`, `pydantic >=2`.
- **API Endpoints**:
  - `POST /api/generate-captions`
  - `POST /api/analyze-image`
- **Input**: Multipart form: text or photo, platform (Instagram/LinkedIn/X), tone, hashtags flag.
- **Output**: 4 validated captions (Punchy, Story, Educational, Engaging) with hashtags.
- **Startup Command**: `python app.py`
- **Default Port**: 5000.

### 09. CTA Generator (`09_CTA_Generator`)
- **Student**: Malligaarjunan AVK
- **Purpose**: Generates high-converting, non-repetitive calls-to-action tailored to creator goals (conversion, engagement, follow, community) with offline fallback templates.
- **Frontend**: Next.js 15, React 19, TypeScript, Three.js shaders (`@react-three/fiber`, `@shadergradient/react`).
- **Backend**: Next.js Route Handler (`src/app/api/generate/route.ts`).
- **Programming Languages**: TypeScript, TSX.
- **AI Provider**: Anthropic Claude.
- **AI Model**: `claude-opus-5` / `claude-sonnet-5` / `claude-haiku-4-5`.
- **AI Framework**: Anthropic SDK (`@anthropic-ai/sdk`) + Zod + Rate limiter.
- **Database**: None.
- **Storage**: Client IndexedDB (`idb-keyval`).
- **Authentication**: None.
- **External APIs**: Anthropic Claude API.
- **Important Dependencies**: `@anthropic-ai/sdk ^0.128.0`, `@react-three/fiber ^9.8.1`, `@shadergradient/react`, `next`, `react 19.0.0`, `zod`.
- **API Endpoints**:
  - `POST /api/generate`
- **Input**: `{ "goal": string, "platform": string, "context": string, "tone": string }`
- **Output**: `{ "ctas": Array<{ ctaText: string, placement: string, urgencyLevel: string, framework: string }> }`
- **Startup Command**: `npm install && npm run dev`
- **Default Port**: 3000.

### 10. Comment Analyzer (`10_Comment_Analyzer`)
- **Student**: Poornaa Shree Praveenraj
- **Purpose**: Connects to Instagram Graph API or ingests raw comments, classifying audience reactions into Themes, Questions, Complaints, and Opportunities in batches of 25.
- **Frontend**: Vanilla HTML/JS/CSS (`public/index.html`, `public/dashboard.html`).
- **Backend**: Node.js Express (`src/server.js`, port 3000).
- **Programming Languages**: JavaScript, HTML, CSS.
- **AI Provider**: Google Gemini.
- **AI Model**: Gemini via `@google/genai` (with smart keyword heuristic fallback).
- **AI Framework**: `@google/genai ^2.24.0`.
- **Database**: SQLite (`better-sqlite3 ^13.0.3`).
- **Storage**: Local SQLite file (`comments.db`).
- **Authentication**: None.
- **External APIs**: Meta / Instagram Graph API v23.0, Google Gemini API.
- **Important Dependencies**: `@google/genai ^2.24.0`, `better-sqlite3 ^13.0.3`, `dotenv ^18.0.4`, `express ^5.2.1`.
- **API Endpoints**:
  - `POST /api/analyze-post`
  - `GET /api/posts`
  - `GET /api/posts/:shortcode`
  - `GET /api/metrics/:shortcode`
- **Input**: Instagram shortcode / URL or raw comment list.
- **Output**: Sentiment breakdown, categorized comment clusters, action items.
- **Startup Command**: `node src/server.js`
- **Default Port**: 3000.

### 11. Comment-to-Content (`11_Comment_to_Content`)
- **Student**: Satheesh
- **Purpose**: Complete ML and AI pipeline turning audience comments into validated future content: spam cleaning, intent extraction, semantic embedding clustering, demand scoring, content gap analysis against past posts, and auto-generation of Reels/Carousels/Stories and reply drafts.
- **Frontend**: Next.js 16, React 19, Recharts, Tailwind CSS.
- **Backend**: Python FastAPI (`backend/app/main.py`, port 8000).
- **Programming Languages**: Python, TypeScript, TSX.
- **AI Provider**: Anthropic Claude + Local Embeddings (`sentence-transformers`).
- **AI Model**: `claude-3-7-sonnet-20250219`, `paraphrase-multilingual-MiniLM-L12-v2`.
- **AI Framework**: Anthropic SDK + Scikit-Learn KMeans/HDBSCAN.
- **Database**: SQLite (`comidea.db`) with SQLAlchemy ORM.
- **Storage**: Local database file.
- **Authentication**: None.
- **External APIs**: Anthropic Claude API, optional Instagram Graph API.
- **Important Dependencies**: `fastapi >=0.110.0`, `uvicorn >=0.28.0`, `sqlalchemy >=2.0.28`, `anthropic >=0.20.0`, `sentence-transformers >=2.5.0`, `scikit-learn >=1.4.0`, `hdbscan >=0.8.33`, `next 16.3.6`, `react 19.2.8`.
- **API Endpoints**:
  - `POST /api/ingest/demo`
  - `POST /api/pipeline/run`
  - `GET /api/ideas`
  - `GET /api/clusters`
  - `GET /api/insights`
  - `GET /api/replies`
- **Input**: Comment text batches or CSV dataset.
- **Output**: Clustered themes, demand score, content gap rating, generated Reel/Carousel script, personalized reply drafts.
- **Startup Command**: Backend: `uvicorn backend.app.main:app --port 8000`; Frontend: `npm run dev --prefix frontend`
- **Default Port**: Backend: 8000, Frontend: 3000.

### 12. Creator Research Assistant (`12_Creator_Research_Assistant`)
- **Student**: Sudhiksha
- **Purpose**: Educational content research assistant that transforms complex topics into vetted facts, contrarian angles, statistics, common misconceptions, and source citations.
- **Frontend**: Next.js 16, React 19, Tailwind CSS, Lucide React.
- **Backend**: Next.js Route Handler (`src/app/api/research/route.ts`).
- **Programming Languages**: TypeScript, TSX.
- **AI Provider**: Google Gemini.
- **AI Model**: `gemini-2.5-flash`.
- **AI Framework**: Direct Google GenAI / Gemini API.
- **Database**: None.
- **Storage**: Client-side state.
- **Authentication**: None.
- **External APIs**: Google Gemini API.
- **Important Dependencies**: `next 16.3.6`, `react 19.2.8`, `lucide-react ^1.48.0`.
- **API Endpoints**:
  - `POST /api/research`
- **Input**: `{ "topic": string, "targetAudience": string, "depth": string }`
- **Output**: `{ summary, keyFacts: [...], contentAngles: [...], sources: [...], citations: [...] }`
- **Startup Command**: `npm install && npm run dev`
- **Default Port**: 3000.

### 13. Voice Replicator (`13_Voice_Replicator`)
- **Student**: Suryakumar J S
- **Purpose**: Learns a creator's unique voice from historical posts (extracting text from images via OCR and captions), builds a stylistic fingerprint, vectorizes posts, generates new drafts in the creator's voice, and evaluates similarity.
- **Frontend**: Next.js 16, React 19, Tailwind CSS.
- **Backend**: Python FastAPI (`backend/app/main.py`, port 8000).
- **Programming Languages**: Python, TypeScript, TSX.
- **AI Provider**: Google Gemini + SentenceTransformers.
- **AI Model**: `gemini-2.5-flash`, `all-MiniLM-L6-v2`.
- **AI Framework**: Google Gen AI SDK (`google-genai`), spaCy, Scikit-Learn, EasyOCR.
- **Database**: PostgreSQL with `pgvector` (with automatic SQLite fallback).
- **Storage**: Local filesystem & database.
- **Authentication**: None.
- **External APIs**: Google Gemini API.
- **Important Dependencies**: `fastapi >=0.110.0`, `sqlalchemy >=2.0.28`, `alembic >=1.13.0`, `pgvector >=0.2.5`, `google-genai >=0.1.1`, `easyocr >=1.7.1`, `opencv-python-headless >=4.9.0.80`, `sentence-transformers >=2.5.1`, `spacy >=3.7.4`.
- **API Endpoints**:
  - `POST /api/projects`
  - `POST /api/posts/import`
  - `POST /api/analysis/style`
  - `POST /api/generation/draft`
  - `POST /api/validation/evaluate`
- **Input**: Historical posts (text & image files), new drafting prompt.
- **Output**: Style metrics (formality, humor, vocabulary richness), generated draft, adherence score.
- **Startup Command**: Backend: `uvicorn app.main:app --port 8000 --app-dir backend`; Frontend: `npm run dev --prefix frontend`
- **Default Port**: Backend: 8000, Frontend: 3000.

### 14. Podcast Assistant (`14_Podcast_Assistant`)
- **Student**: Priyadharshini B
- **Purpose**: Transforms podcast transcripts into titles, SEO descriptions, timestamped chapters, key takeaways, and promotional snippets.
- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide React.
- **Backend**: Next.js Route Handler (`app/api/analyze/route.ts`).
- **Programming Languages**: TypeScript, React (TSX).
- **AI Provider**: Google Gemini.
- **AI Model**: `gemini-1.5-flash` / `gemini-3.8-flash`.
- **AI Framework**: Direct Gemini JSON prompt schema.
- **Database**: None.
- **Storage**: In-memory.
- **Authentication**: None.
- **External APIs**: Google Gemini API.
- **Important Dependencies**: `next 14.2.15`, `react ^18.3.1`, `lucide-react ^0.400.0`, `tailwindcss ^3.4.13`.
- **API Endpoints**:
  - `POST /api/analyze`
- **Input**: `{ "transcript": string, "episodeNumber"?: string, "hostName"?: string }`
- **Output**: `{ "title": string, "alternativeTitles": string[], "description": string, "chapters": Array<{ timestamp, title, summary }>, "highlights": string[] }`
- **Startup Command**: `npm install && npm run dev`
- **Default Port**: 3000.

### 15. Creator Workspace (`15_Creator_Workspace`)
- **Student**: Aatif F
- **Purpose**: Interactive Kanban workflow organizer managing content progression across Idea -> Research -> Script -> Published with AI stage generation.
- **Frontend**: React 18, Vite, React Router DOM, Lucide React.
- **Backend**: Node.js Express (`server/server.js`, port 5000).
- **Programming Languages**: JavaScript, JSX, CSS.
- **AI Provider**: Google Gemini.
- **AI Model**: `gemini-3.5-flash-lite`.
- **AI Framework**: `@google/generative-ai ^0.24.0`.
- **Database**: None (in-memory mock store).
- **Storage**: None.
- **Authentication**: None.
- **External APIs**: Google Gemini API.
- **Important Dependencies**: `express ^4.21.2`, `@google/generative-ai ^0.24.0`, `react ^18.3.1`, `react-router-dom ^6.28.0`, `vite ^6.0.1`.
- **API Endpoints**:
  - `GET /api/health`
  - `POST /api/gemini/generate`
  - `POST /api/gemini/refine`
- **Input**: Seed topic, current stage, refinement instructions.
- **Output**: Stage-appropriate text draft.
- **Startup Command**: Backend: `npm start --prefix server`; Frontend: `npm run dev --prefix client`
- **Default Port**: Backend: 5000, Frontend: 5173.

### 16. Content Recycler (`16_Content_Recycler`)
- **Student**: Archana C
- **Purpose**: Smart India Hackathon project that calculates evergreen scores and engagement decay on past posts, scheduling posts into REPOST, REWORK, REPURPOSE, and ARCHIVE buckets.
- **Frontend**: React 19, Vite, Recharts, Lucide React, Axios.
- **Backend**: Node.js Express (`backend/server.js`, port 5000).
- **Programming Languages**: JavaScript, JSX.
- **AI Provider**: Algorithmic NLP & Decay Heuristics.
- **AI Model**: None (TF-IDF vector cosine similarity & engagement math).
- **AI Framework**: Custom algorithmic engine (`recommendationEngine.js`).
- **Database**: MongoDB (with seamless fallback to In-Memory Demo Storage).
- **Storage**: MongoDB / Memory.
- **Authentication**: JWT Authentication (`jsonwebtoken`, `bcryptjs`).
- **External APIs**: None.
- **Important Dependencies**: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `react ^19.2.8`, `recharts ^3.10.1`, `axios ^1.20.0`.
- **API Endpoints**:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/posts`
  - `POST /api/import`
  - `GET /api/recommendations`
  - `POST /api/similarity`
  - `GET /api/planner`
- **Input**: Historical post engagement metrics (likes, comments, shares, saves, date).
- **Output**: Decay curves, evergreen score, recommended action, recycling calendar.
- **Startup Command**: Backend: `node backend/server.js`; Frontend: `npm run dev --prefix frontend`
- **Default Port**: Backend: 5000, Frontend: 5173.

### 17. Brand Pitch Builder (`17_Brand_Pitch_Builder`)
- **Student**: Prinetha kannan
- **Purpose**: Personalized brand collaboration proposal builder: aligns creator demographics with brand marketing goals, generates tiered pricing packages, email pitches, and exports PDF proposals.
- **Frontend**: React 18, Vite, Lucide React, Canvas Confetti, `html2pdf.js`.
- **Backend**: Node.js Express (`server/src/index.js`, port 5000).
- **Programming Languages**: JavaScript, JSX.
- **AI Provider**: Google Gemini.
- **AI Model**: Gemini via `@langchain/google-genai`.
- **AI Framework**: LangChain (`@langchain/core ^1.2.13`, `@langchain/google-genai ^2.3.2`).
- **Database**: SQLite (Node.js built-in `node:sqlite` DatabaseSync).
- **Storage**: Local SQLite file (`server/data/brand_pitch.db`).
- **Authentication**: None.
- **External APIs**: Google Gemini API.
- **Important Dependencies**: `@langchain/core`, `@langchain/google-genai`, `express ^4.21.2`, `react ^18.3.1`, `html2pdf.js ^0.10.2`.
- **API Endpoints**:
  - `GET /api/profiles`
  - `POST /api/profiles`
  - `POST /api/ai/analyze-alignment`
  - `POST /api/ai/generate-proposal`
  - `POST /api/proposals`
- **Input**: Creator media kit data + Brand campaign requirements.
- **Output**: Brand alignment score, deliverable tiers, email pitch drafts, downloadable PDF.
- **Startup Command**: `npm run dev`
- **Default Port**: Backend: 5000, Frontend: 5173.

### 18. AI Content Director (`18_AI_Content_Director`)
- **Student**: Sri Jananii S
- **Purpose**: Full 7-stage content production pipeline: Research -> Angles -> Narrative -> Script -> Visuals/B-roll -> Shot List -> Publishing Copy.
- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide React.
- **Backend**: Next.js Route Handler (`app/api/pipeline/generate/route.ts`).
- **Programming Languages**: TypeScript, React (TSX).
- **AI Provider**: Anthropic Claude (with mock data fallback).
- **AI Model**: `claude-3-5-sonnet-20241022`.
- **AI Framework**: `@anthropic-ai/sdk ^0.32.1` + Zod schemas.
- **Database**: None.
- **Storage**: In-memory.
- **Authentication**: None.
- **External APIs**: Anthropic Claude API.
- **Important Dependencies**: `@anthropic-ai/sdk ^0.32.1`, `next ^14.2.15`, `react ^18.3.1`, `zod ^3.23.8`.
- **API Endpoints**:
  - `POST /api/pipeline/generate`
- **Input**: `{ "stage": string, "seedTopic": string, "previousStageData"?: object }`
- **Output**: Stage-specific structured JSON content.
- **Startup Command**: `npm install && npm run dev`
- **Default Port**: 3000.

### 18G. AI Content Director (Guruvelah Edition) (`18_AI_Content_Director_Guruvelah`)
- **Student**: Guruvelah
- **Purpose**: Enterprise-grade trend-to-content SaaS: ingests live trending topics, generates multi-platform content packages, provides user feedback loops, duplication, regeneration, user quotas, and Supabase auth/DB.
- **Frontend**: Next.js 15, React 19, Tailwind CSS, Radix UI.
- **Backend**: Next.js Route Handlers (`app/api/*`).
- **Programming Languages**: TypeScript, TSX.
- **AI Provider**: Google Gemini.
- **AI Model**: `gemini-3.5-flash-lite`, `gemini-1.5-pro`, `gemini-2.0-flash`.
- **AI Framework**: Google GenAI SDK (`@google/genai ^0.14.0`).
- **Database**: PostgreSQL (Supabase).
- **Storage**: Supabase Storage.
- **Authentication**: Supabase Auth (Email/Password, Sessions).
- **External APIs**: Google Gemini API, Supabase API.
- **Important Dependencies**: `@google/genai ^0.14.0`, `@supabase/supabase-js ^2.48.1`, `@supabase/ssr ^0.5.2`, `next`, `react 19.2.8`, `zod`.
- **API Endpoints**:
  - `POST /api/analyze-trend`
  - `POST /api/generate-content`
  - `GET /api/generations`
  - `GET /api/generations/:id`
  - `POST /api/generations/:id/regenerate`
  - `POST /api/generations/:id/duplicate`
  - `POST /api/feedback`
  - `GET /api/trends`
  - `GET /api/trends/refresh`
- **Input**: Trend selection, platform, creator goal, tone.
- **Output**: Persisted content packages (hooks, script, captions, shot list) with generation history.
- **Startup Command**: `npm install && npm run dev`
- **Default Port**: 3000.

### 19. Creator Second Brain (`19_Creator_Second_Brain`)
- **Student**: Karthik Aravind M
- **Purpose**: Autonomous knowledge vault for creators: ingests entire YouTube channels, transcribes and embeds videos, and deploys a Supervisor Agent coordinating 5 specialist agents (Researcher, Clip Editor, Drift Analyst, Connections, Promise Auditor) over SSE streaming chat.
- **Frontend**: Next.js 16, React 19, `react-force-graph-2d`, Recharts.
- **Backend**: Python FastAPI (`backend/main.py`, port 8000).
- **Programming Languages**: Python, TypeScript, TSX.
- **AI Provider**: Groq Cloud / OpenAI compatible.
- **AI Model**: `llama-3.3-70b-versatile` / `openai/gpt-oss-120b` via Groq.
- **AI Framework**: LangChain + LangGraph (`langchain ==1.4.3`, `langchain-groq ==1.1.3`, `langgraph ==1.2.12`, `langgraph-checkpoint-sqlite ==3.1.1`).
- **Embeddings**: `fastembed ==0.8.1`.
- **Database**: PostgreSQL + `pgvector` (via `SQLAlchemy`, `pg8000`, `pgvector`).
- **Storage**: Vector store + PostgreSQL.
- **Authentication**: None.
- **External APIs**: Groq API, YouTube Data API, YouTube Transcript API.
- **Important Dependencies**: `fastapi ==0.141.1`, `SQLAlchemy ==2.1.1`, `pg8000 ==1.31.5`, `pgvector ==0.5.0`, `groq ==0.37.1`, `langchain ==1.4.3`, `langgraph ==1.2.12`, `fastembed ==0.8.1`.
- **API Endpoints**:
  - `POST /api/channels/{channel_id}/agent/chat` (SSE Streaming)
  - `GET /api/channels/{channel_id}/agent/threads`
  - `POST /api/ingest`
  - `GET /api/graph`
- **Input**: YouTube channel URL, user conversational query.
- **Output**: Real-time streaming response with interactive specialist tool cards (knowledge graph, clips, drift metrics).
- **Startup Command**: Backend: `uvicorn main:app --port 8000 --app-dir backend`; Frontend: `npm run dev --prefix frontend`
- **Default Port**: Backend: 8000, Frontend: 3000.

### 20. AI Screenplay Workspace (`20_AI_Screenplay_Workspace`)
- **Student**: SaiSanjay R
- **Purpose**: Long-form narrative writer's room maintaining character profiles, location bibles, and scene continuity across multiple acts using vector memory.
- **Frontend**: Next.js 16, React 19, CSS Modules.
- **Backend**: Python FastAPI (`backend/main.py`, port 8000).
- **Programming Languages**: Python, TypeScript, TSX.
- **AI Provider**: Google Gemini / OpenAI.
- **AI Model**: `gemini-1.5-pro-latest` / `gpt-4o`.
- **AI Framework**: LangChain + LangGraph (`langchain`, `langchain-google-genai`, `langchain-community`, `langgraph`).
- **Database**: ChromaDB (vector) + MongoDB (`motor`) + Neo4j driver.
- **Storage**: ChromaDB vector store + local file uploads.
- **Authentication**: None.
- **External APIs**: Google Gemini API / OpenAI API.
- **Important Dependencies**: `fastapi`, `uvicorn`, `langchain`, `langchain-google-genai`, `langgraph`, `chromadb`, `motor`, `neo4j`.
- **API Endpoints**:
  - `POST /api/upload-script`
  - `POST /api/generate-scene`
  - `POST /api/character-bible`
  - `GET /api/continuity-check`
- **Input**: Screenplay draft / treatment, character details, scene prompt.
- **Output**: Screenplay formatted scene text, continuity audit report.
- **Startup Command**: Backend: `uvicorn main:app --port 8000 --app-dir backend`; Frontend: `npm run dev --prefix frontend`
- **Default Port**: Backend: 8000, Frontend: 3000.

### 21. Autonomous Content Pipeline (`21_Autonomous_Content_Pipeline`)
- **Student**: Sudharshan R
- **Purpose**: Production monorepo orchestrating end-to-end content lifecycles: Seed Topic -> Web Research (DuckDuckGo scraping) -> Master YouTube Script -> 3 Viral Reels -> LinkedIn Post -> X Thread -> Captions -> Publishing Calendar using LangGraph state graphs.
- **Frontend**: Next.js 16, React 19, Radix UI, Framer Motion, Lenis (`apps/web`).
- **Backend**: Fastify service running LangGraph (`apps/agent`, port 3001).
- **Programming Languages**: TypeScript, TSX.
- **AI Provider**: Google Gemini + OpenAI.
- **AI Model**: `gemini-3.8-flash` / `gemini-3.1-pro` / `gpt-4o`.
- **AI Framework**: LangGraph (`@langchain/langgraph ^1.4.18`, `@langchain/core ^1.2.13`), `@google/genai ^2.24.0`, `openai ^7.23.0`.
- **Database**: MongoDB (`mongodb ^7.6.0`, `@better-auth/mongo-adapter`).
- **Storage**: MongoDB database.
- **Authentication**: Better Auth (`better-auth ^1.7.6`).
- **External APIs**: Google Gemini API, OpenAI API, DuckDuckGo scraping (`duck-duck-scrape`).
- **Important Dependencies**: Turborepo, `better-auth`, `mongodb`, `@langchain/langgraph`, `@google/genai`, `openai`, `zod`, `framer-motion`.
- **API Endpoints**:
  - `POST /api/runs`
  - `GET /api/runs/:runId/events` (SSE Streaming)
  - `GET /api/runs/:runId`
  - `POST /api/calendar/schedule`
- **Input**: Topic, target audience, tone, platform selection.
- **Output**: Complete synchronized multi-platform content assets + scheduled calendar entries.
- **Startup Command**: `npm run dev` (Turborepo launches web on port 3002, agent on port 3001)
- **Default Port**: Web: 3002, Agent: 3001.

### 22. AI Creative Producer (`22_AI_Creative_Producer`)
- **Student**: Udhayan K
- **Challenge Description**: Given a creator goal, define audience, content pillars, and a 30-day strategy, generate daily content, retain history, and adapt recommendations using performance data.
- **Repository State**: Unsubmitted / Pending Starter Branch. Contains only `.github/PULL_REQUEST_TEMPLATE.md`, `.gitignore`, `README.md`, and `assignments.csv`.
- **Technical Status**: Zero source code committed.
- **Resolution for Unified SaaS**: Functionality will be fulfilled by integrating Application 04 (Daily Planner), Application 16 (Recycler), Application 18G (Trend Engine), and Application 21 (Autonomous Pipeline).

### 26. Creator Collaboration Finder (`26_Creator_Collaboration_Finder`)
- **Student**: Cohort Submission
- **Purpose**: Client-side matchmaking engine that calculates creator synergy across category adjacency, format compatibility, audience size ratio, and shared goals using a 100-point deterministic algorithm, generating personalized outreach messages.
- **Frontend**: Vanilla HTML5, Vanilla CSS3, Vanilla JavaScript (`index.html`, `app.js`, `styles.css`, `engine.js`, `data.js`).
- **Backend**: None (pure client-side execution).
- **Programming Languages**: JavaScript, HTML, CSS.
- **AI Provider**: None (Deterministic Jaccard similarity & adjacency scoring).
- **AI Model**: None.
- **AI Framework**: None.
- **Database**: None.
- **Storage**: Browser LocalStorage.
- **Authentication**: None.
- **External APIs**: None.
- **Important Dependencies**: None (Zero third-party dependencies).
- **API Endpoints**: None (Client-side event-driven DOM routing).
- **Input**: Creator profile (niche, platforms, subscriber count, goals).
- **Output**: Ranked collaborator recommendations with synergy scores and outreach pitch drafts.
- **Startup Command**: Open `index.html` in browser or serve with `npx serve`.
- **Default Port**: Static file (3000/5500).
