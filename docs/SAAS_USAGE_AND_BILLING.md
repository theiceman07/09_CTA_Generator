# SaaS Usage and Billing Architecture

## Billing Architecture Hierarchy

```text
USER / ORGANIZATION
         │
         ▼
ACTIVE SUBSCRIPTION PLAN (Free / Pro / Studio / Enterprise)
         │
         ▼
MONTHLY USAGE ALLOWANCE & CREDIT BALANCE
         │
         ▼
API GATEWAY METERING INTERCEPTOR
         ├── Deduct Generation Credits
         ├── Verify Token / Concurrency Limits
         └── Log Telemetry to `usage_metering` Table
         │
         ▼
EXECUTE SERVICE (FastAPI / Worker / AI Gateway)
```

---

## Trackable Usage Metrics

The unified SaaS platform meters usage across four distinct operational dimensions:

1. **AI Token Metering**:
   - `input_tokens` and `output_tokens` tracked per request across Google Gemini, Anthropic Claude, and Groq.
   - Weighted credit deduction based on model tier (e.g. Flash = 1 credit/1k tokens; Claude Sonnet = 15 credits/1k tokens).
2. **Audio & Speech Processing**:
   - Audio transcription minutes processed via Whisper (Applications 06, 14, 19).
3. **Video Rendering & FFmpeg Compute**:
   - CPU/GPU seconds utilized for video slicing and subtitle burn-in (Application 06).
4. **Cloud Asset Storage**:
   - Gigabytes of video clips, images, and audio stored in S3/R2 (Applications 06, 07, 13).
5. **Project & Workflow Capacity**:
   - Number of active projects and concurrent autonomous pipeline runs (Application 21).

---

## Subscription Tier Definitions

| Plan Feature | Free Starter | Pro Creator ($29/mo) | Studio / Agency ($79/mo) |
|--------------|--------------|----------------------|--------------------------|
| **Monthly AI Credits** | 100 Credits (~50k tokens) | 2,500 Credits (~1.5M tokens) | 10,000 Credits (~6M tokens) |
| **Active Projects** | 2 Projects | 25 Projects | Unlimited Projects |
| **Repurposing Engine** | 5 Repurposes / mo | Unlimited Repurposing | Unlimited Repurposing |
| **Second Brain Knowledge Vault** | 1 Channel (max 10 videos) | 5 Channels (max 100 videos) | Unlimited Channels |
| **Clip Finder (Whisper + FFmpeg)** | 10 minutes video / mo | 120 minutes video / mo | 500 minutes video / mo |
| **Cloud Storage** | 1 GB | 25 GB | 150 GB |
| **Autonomous Campaigns** | 0 Runs | 5 Campaigns / mo | 30 Campaigns / mo |
| **Brand Pitch PDF Exports** | Watermarked | Unlimited Unbranded | Unlimited Unbranded |
| **Team Seats** | 1 Seat | 1 Seat | 5 Seats Included |
