# Unified File and Asset Storage Plan

## Storage Requirements Across Applications

The unified SaaS platform generates, processes, and persists diverse asset types across its 24 integrated capabilities:

| Asset Type | Originating Applications | File Formats | Retention Strategy | Storage Tier |
|------------|--------------------------|--------------|-------------------|--------------|
| **Raw Video Uploads** | `06_Clip_Finder` | MP4, MOV, MKV | 7-day retention post-slicing | S3 Standard / Cold |
| **Processed Video Clips** | `06_Clip_Finder` | MP4 (H.264, AAC) | Permanent (User Library) | S3 Standard + CDN |
| **Audio Transcripts** | `06`, `14`, `19` | JSON, VTT, SRT | Permanent (Relational/JSONB) | PostgreSQL Database |
| **Thumbnails & Covers** | `07_Thumbnail_Ideator` | PNG, WebP | Permanent (CDN Cached) | S3 Standard + Edge CDN |
| **Creator Voice Assets** | `13_Voice_Replicator` | JPG, PNG (Post images) | Intermediate (Post-OCR) | S3 Infrequent Access |
| **Proposal PDFs** | `17_Brand_Pitch_Builder` | PDF | Permanent (User Documents) | S3 Standard |
| **Screenplay Documents** | `20_AI_Screenplay_Workspace`| PDF, Fountain, TXT | Permanent | S3 Standard |
| **Knowledge Embeddings** | `11`, `13`, `19`, `20` | Vector Arrays (384-dim) | Permanent | PostgreSQL `pgvector` |

---

## Unified Storage Architecture

```text
       Client (Next.js) ────────── Presigned Upload URL ──────────► S3 / Cloudflare R2
              │                                                             │
              ▼                                                             ▼
     FastAPI Backend (Metadata)                                    Media Worker Queue
              │                                                             │
              ▼                                                             ▼
     PostgreSQL (Assets Table)                                    FFmpeg / Whisper Job
```

### 1. Object Storage Technology Selection
- **Recommended Provider**: **Cloudflare R2** or **AWS S3**.
- **Rationale**:
  - **Zero Egress Fees**: Cloudflare R2 has zero data egress charges, which is essential for video streaming (Application 06) and frequent thumbnail downloads (Application 07).
  - **S3 API Compatibility**: Standard AWS S3 SDKs (`boto3` in Python, `@aws-sdk/client-s3` in Node.js) work out-of-the-box.

### 2. Direct-to-Storage Presigned Uploads
- **Security & Performance**: Clients upload large video and PDF files directly to S3/R2 using pre-signed PUT URLs.
- **Benefit**: Large 500MB+ videos never pass through the web server application memory, preventing socket exhaustion.

### 3. Bucket Directory Structure
```text
creatorsaas-assets-prod/
├── users/
│   └── {user_id}/
│       └── avatars/
├── projects/
│   └── {project_id}/
│       ├── raw/                 # Temporary raw video/audio uploads
│       │   └── {asset_id}.mp4
│       ├── clips/               # Trimmed output clips
│       │   └── {clip_id}.mp4
│       ├── covers/              # Generated thumbnails & reel covers
│       │   └── {cover_id}.png
│       ├── proposals/           # Brand pitch PDFs
│       │   └── {proposal_id}.pdf
│       └── documents/           # Screenplay treatments & scripts
│           └── {doc_id}.pdf
└── system/
    └── templates/               # Standard graphic overlays & fonts
```

### 4. Lifecycle Policies
- `projects/{project_id}/raw/*`: Automatically expire and delete after 7 days via S3 Lifecycle Rule to minimize storage costs once clips are extracted.
- `projects/{project_id}/clips/*`: Retained indefinitely based on user's subscription quota (e.g. Free: 1GB, Pro: 25GB, Studio: 100GB).
