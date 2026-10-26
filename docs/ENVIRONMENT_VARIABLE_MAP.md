# Unified Environment Variable Map

This document catalogs every environment variable discovered across the 24 application branches.

> [!IMPORTANT]
> In accordance with security audit rules, this document lists **variable names only**. Actual secrets or sensitive values are never recorded.

---

## Discovered Environment Variables by Domain

### 1. AI Model Providers & Keys
- `GEMINI_API_KEY` (Used in apps 01, 02, 03, 05, 07, 08, 10, 12, 13, 14, 15, 17, 18G, 20, 21)
- `AI_MODEL` (Used in app 18G)
- `GEMINI_MODEL` (Used in apps 08, 14, 15)
- `ANTHROPIC_API_KEY` (Used in apps 08, 09, 11, 18)
- `ANTHROPIC_MODEL` (Used in app 11)
- `CUE_MODEL` (Used in app 09)
- `CUE_EFFORT` (Used in app 09)
- `GROQ_API_KEY` (Used in app 19)
- `OPENAI_API_KEY` (Used in apps 20, 21)
- `LLM_PROVIDER` (Used in app 13)
- `LLM_MODEL` (Used in apps 13, 19)
- `LLM_FAST_MODEL` (Used in app 19)
- `LLM_API_KEY` (Used in app 13)
- `PROVIDER` (Used in app 08)
- `VISION_PROVIDER` (Used in app 08)
- `FALLBACK_PROVIDER` (Used in app 08)

### 2. Local AI & Media Services
- `OLLAMA_BASE_URL` (Used in app 06)
- `OLLAMA_MODEL` (Used in app 06)
- `WHISPER_MODEL` (Used in apps 06, 19)
- `EMBEDDING_PROVIDER` (Used in app 13)
- `EMBEDDING_MODEL` (Used in app 13)
- `EMBEDDING_MODEL_NAME` (Used in app 11)
- `USE_LOCAL_EMBEDDINGS` (Used in app 11)
- `DATA_DIR` (Used in app 06)
- `MAX_CLIP_DURATION` (Used in app 06)
- `MIN_CLIP_DURATION` (Used in app 06)
- `MAX_VIDEOS` (Used in app 19)
- `TRANSCRIPT_PROXY` (Used in app 19)

### 3. Observability & Tracing
- `LANGSMITH_API_KEY` (Used in apps 02, 05)
- `LANGSMITH_TRACING` (Used in apps 02, 05)
- `LANGSMITH_PROJECT` (Used in apps 02, 05)
- `LANGSMITH_ENDPOINT` (Used in app 05)
- `LANGCHAIN_TRACING_V2` (Used in app 02)

### 4. Database & Storage Connections
- `DATABASE_URL` (Used in apps 11, 13, 18G, 19)
- `MONGODB_URI` (Used in apps 16, 21)
- `NEXT_PUBLIC_SUPABASE_URL` (Used in app 18G)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Used in app 18G)
- `SUPABASE_SERVICE_ROLE_KEY` (Used in app 18G)

### 5. Authentication & Security
- `JWT_SECRET` (Used in app 16)
- `CRON_SECRET` (Used in app 18G)
- `NEXTAUTH_SECRET` (Used in Next.js apps)
- `NEXTAUTH_URL` (Used in Next.js apps)

### 6. Social Media & External Integrations
- `YOUTUBE_API_KEY` (Used in app 19)
- `INSTAGRAM_USER_ID` (Used in app 10)
- `INSTAGRAM_ACCESS_TOKEN` (Used in apps 10, 11)
- `INSTAGRAM_APP_ID` (Used in app 11)
- `INSTAGRAM_APP_SECRET` (Used in app 11)
- `INSTAGRAM_GRAPH_API_VERSION` (Used in app 10)
- `ENABLE_INSTAGRAM_GRAPH_API` (Used in app 11)

### 7. Server & Runtime Configuration
- `PORT` (Used across all Express, FastAPI, and Flask apps)
- `HOST` (Used in app 11)
- `NODE_ENV` (Used in apps 15, 16, 21)
- `DEBUG` (Used in app 13)
- `CLIENT_URL` (Used in apps 15, 16)
- `CORS_ORIGINS` (Used in app 11)
- `NEXT_PUBLIC_APP_URL` (Used in apps 18, 21)
- `DAILY_GENERATION_LIMIT` (Used in app 18G)
- `DAILY_REGEN_LIMIT` (Used in app 18G)
- `CUE_RATE_PER_MIN` (Used in app 09)
- `CUE_RATE_PER_DAY` (Used in app 09)

---

## Recommended Unified SaaS Configuration Schema

In the consolidated product, environment variables are reduced from 50+ down to a clean, canonical set:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://app.omncreator.ai
PORT=8000

# Authentication & Database
DATABASE_URL=postgresql://user:pass@ep-postgres.prod/creator_studio
REDIS_URL=redis://default:pass@ep-redis.prod:6379
AUTH_SECRET=super_secure_random_key_64_bytes

# AI Model Providers
GEMINI_API_KEY=primary_google_genai_key
ANTHROPIC_API_KEY=primary_anthropic_claude_key
GROQ_API_KEY=primary_groq_llama_key

# Observability
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=primary_langsmith_key
LANGSMITH_PROJECT=creator-studio-saas

# Object Storage (S3 / Cloudflare R2)
R2_ACCOUNT_ID=cf_account_id
R2_ACCESS_KEY_ID=r2_key_id
R2_SECRET_ACCESS_KEY=r2_secret
R2_BUCKET_NAME=creatorstudio-assets-prod
NEXT_PUBLIC_CDN_URL=https://cdn.omncreator.ai

# Social Integrations
YOUTUBE_API_KEY=youtube_data_api_key
INSTAGRAM_APP_ID=meta_app_id
INSTAGRAM_APP_SECRET=meta_app_secret
```
