# SaaS Unified Data Model

## Relational Schema Design (PostgreSQL 16)

The unified platform consolidates the fragmented SQLite, MongoDB, and local JSON schemas into a normalized relational schema with PostgreSQL `pgvector` support.

---

## Entity Relationship Overview

```text
 Users ──< Organizations ──< Projects ──< Content_Items ──< Generations
   │                              │              │
   │                              │              ├──< Assets (Media / S3)
   │                              │              │
   │                              ├──< Voice_Profiles (pgvector)
   │                              │
   │                              ├──< Knowledge_Chunks (pgvector)
   │                              │
   │                              ├──< Publishing_Schedules
   │                              │
   │                              └──< Post_Analytics
   │
   └──< Usage_Logs & Invoices
```

---

## Database Tables Specification

### 1. `users`
- `id`: UUID (Primary Key, default `gen_random_uuid()`)
- `email`: VARCHAR(255) (Unique, Not Null)
- `hashed_password`: VARCHAR(255) (Nullable if OAuth)
- `full_name`: VARCHAR(255)
- `subscription_tier`: VARCHAR(50) (Default 'free', 'pro', 'studio')
- `created_at`: TIMESTAMPTZ (Default `NOW()`)
- `updated_at`: TIMESTAMPTZ (Default `NOW()`)

### 2. `projects` (The Central Entity)
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> `users.id`, On Delete Cascade)
- `name`: VARCHAR(255) (Not Null)
- `description`: TEXT
- `target_audience`: VARCHAR(255)
- `tone`: VARCHAR(100) (e.g. 'Bold', 'Educational', 'Conversational')
- `primary_goal`: VARCHAR(100) (e.g. 'Growth', 'Sales', 'Authority')
- `status`: VARCHAR(50) (Default 'active', 'archived')
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### 3. `content_items`
- `id`: UUID (Primary Key)
- `project_id`: UUID (Foreign Key -> `projects.id`, On Delete Cascade)
- `title`: VARCHAR(255) (Not Null)
- `format`: VARCHAR(50) ('idea', 'reel_script', 'hook', 'cta', 'caption', 'repurposed_bundle', 'screenplay')
- `status`: VARCHAR(50) ('draft', 'in_review', 'approved', 'scheduled', 'published')
- `body_payload`: JSONB (Flexible structured content matching domain schemas)
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### 4. `generations` (AI Audit & Telemetry)
- `id`: UUID (Primary Key)
- `content_item_id`: UUID (Foreign Key -> `content_items.id`, Nullable)
- `project_id`: UUID (Foreign Key -> `projects.id`)
- `user_id`: UUID (Foreign Key -> `users.id`)
- `model_name`: VARCHAR(100) (e.g. 'gemini-2.0-flash', 'claude-3-5-sonnet')
- `prompt_snapshot`: TEXT
- `completion_snapshot`: TEXT
- `input_tokens`: INT
- `output_tokens`: INT
- `latency_ms`: INT
- `user_rating`: SMALLINT (1 to 5, Nullable)
- `created_at`: TIMESTAMPTZ

### 5. `voice_profiles` (Style Memory from App 13)
- `id`: UUID (Primary Key)
- `project_id`: UUID (Foreign Key -> `projects.id`, Unique)
- `formality_score`: FLOAT
- `humor_index`: FLOAT
- `emoji_ratio`: FLOAT
- `avg_sentence_length`: FLOAT
- `vocabulary_diversity`: FLOAT
- `style_vector`: vector(384) (pgvector representation of creator voice)
- `updated_at`: TIMESTAMPTZ

### 6. `knowledge_chunks` (Second Brain RAG from App 19 & 20)
- `id`: UUID (Primary Key)
- `project_id`: UUID (Foreign Key -> `projects.id`)
- `source_type`: VARCHAR(50) ('youtube_video', 'podcast_transcript', 'screenplay_pdf', 'manual_note')
- `source_reference`: VARCHAR(255) (e.g. Video URL or File Name)
- `chunk_text`: TEXT (Not Null)
- `embedding`: vector(384) (pgvector for cosine similarity search)
- `metadata`: JSONB (Timestamps, speaker name, chapter title)
- `created_at`: TIMESTAMPTZ

### 7. `assets` (Media & Files)
- `id`: UUID (Primary Key)
- `project_id`: UUID (Foreign Key -> `projects.id`)
- `content_item_id`: UUID (Foreign Key -> `content_items.id`, Nullable)
- `asset_type`: VARCHAR(50) ('video_raw', 'clip_mp4', 'thumbnail_png', 'proposal_pdf', 'audio_wav')
- `storage_path`: VARCHAR(512) (S3 / R2 URI)
- `file_size_bytes`: BIGINT
- `mime_type`: VARCHAR(100)
- `created_at`: TIMESTAMPTZ

### 8. `publishing_schedules` (Calendar from App 04, 16, 21)
- `id`: UUID (Primary Key)
- `content_item_id`: UUID (Foreign Key -> `content_items.id`)
- `platform`: VARCHAR(50) ('youtube', 'instagram', 'linkedin', 'x', 'tiktok')
- `scheduled_time`: TIMESTAMPTZ (Not Null)
- `publish_status`: VARCHAR(50) ('pending', 'published', 'failed')
- `error_message`: TEXT

### 9. `post_analytics` (Evergreen & Recycling from App 16)
- `id`: UUID (Primary Key)
- `content_item_id`: UUID (Foreign Key -> `content_items.id`)
- `external_post_id`: VARCHAR(255)
- `views`: INT
- `likes`: INT
- `comments`: INT
- `shares`: INT
- `saves`: INT
- `decay_rate`: FLOAT
- `evergreen_score`: FLOAT
- `recommended_action`: VARCHAR(50) ('repost', 'rework', 'repurpose', 'archive')
- `last_checked_at`: TIMESTAMPTZ

### 10. `usage_metering` (Billing from Step 24)
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> `users.id`)
- `period_start`: DATE
- `period_end`: DATE
- `tokens_consumed`: BIGINT
- `audio_seconds_processed`: INT
- `video_seconds_rendered`: INT
- `storage_bytes_used`: BIGINT
