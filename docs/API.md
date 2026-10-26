# Unified Creator AI SaaS — API Documentation (v1)

This document provides the complete API specification for the Unified Creator AI SaaS backend, built with FastAPI in a Modular Monolith architecture.

Base URL: `/api/v1`

---

## 1. System Health

### `GET /health` & `GET /api/v1/health`
Health & readiness check confirming that the API service is operational.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "unified-creator-ai-backend",
  "version": "1.0.0"
}
```

---

## 2. Authentication & User Management

### `POST /api/v1/auth/register`
Register a new creator account.

**Request:**
```json
{
  "email": "creator@example.com",
  "password": "StrongPassword123",
  "name": "Alex Creator"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer",
  "user": {
    "id": "c1f77d34-7a32-426b-9c71-...",
    "email": "creator@example.com",
    "name": "Alex Creator",
    "created_at": "2026-10-01T14:00:00Z"
  }
}
```

### `POST /api/v1/auth/login`
Authenticate existing user and retrieve JWT access token.

**Request:**
```json
{
  "email": "creator@example.com",
  "password": "StrongPassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer",
  "user": {
    "id": "c1f77d34-7a32-426b-9c71-...",
    "email": "creator@example.com",
    "name": "Alex Creator",
    "created_at": "2026-10-01T14:00:00Z"
  }
}
```

### `GET /api/v1/auth/me`
Retrieve currently authenticated user profile. Requires `Authorization: Bearer <token>`.

**Response (200 OK):**
```json
{
  "id": "c1f77d34-7a32-426b-9c71-...",
  "email": "creator@example.com",
  "name": "Alex Creator",
  "created_at": "2026-10-01T14:00:00Z"
}
```

---

## 3. Project Management

All project endpoints require `Authorization: Bearer <token>`. Project isolation and ownership are enforced at the service level; users cannot access or mutate projects belonging to another user.

### `POST /api/v1/projects`
Create a new creator project.

**Request:**
```json
{
  "name": "AI Systems 2026",
  "description": "Cross-platform thought leadership campaign"
}
```

**Response (201 Created):**
```json
{
  "id": "proj-uuid-1234",
  "user_id": "user-uuid-5678",
  "name": "AI Systems 2026",
  "description": "Cross-platform thought leadership campaign",
  "created_at": "2026-10-01T14:05:00Z",
  "updated_at": "2026-10-01T14:05:00Z"
}
```

### `GET /api/v1/projects`
List all projects owned by the authenticated user.

**Response (200 OK):**
```json
[
  {
    "id": "proj-uuid-1234",
    "user_id": "user-uuid-5678",
    "name": "AI Systems 2026",
    "description": "Cross-platform thought leadership campaign",
    "created_at": "2026-10-01T14:05:00Z",
    "updated_at": "2026-10-01T14:05:00Z"
  }
]
```

### `GET /api/v1/projects/{project_id}`
Retrieve a single project by ID. Returns 404 if not found or unauthorized.

### `PATCH /api/v1/projects/{project_id}`
Update project name or description.

**Request:**
```json
{
  "name": "AI Systems 2026 - Q4",
  "description": "Updated roadmap"
}
```

### `DELETE /api/v1/projects/{project_id}`
Delete a project and cascade-delete associated assets and generations. Returns 204 No Content.

---

## 4. Project Assets & Generations

### `GET /api/v1/projects/{project_id}/assets`
List all saved content assets (e.g. LinkedIn posts, YouTube outlines, X threads) for a project.

**Response (200 OK):**
```json
[
  {
    "id": "asset-uuid-001",
    "project_id": "proj-uuid-1234",
    "user_id": "user-uuid-5678",
    "type": "linkedin",
    "title": "LinkedIn Repurposed Content",
    "content": "Why modular monoliths beat microservices...",
    "storage_ref": null,
    "metadata": {
      "tone": "educational",
      "tool": "content-repurposer"
    },
    "created_at": "2026-10-01T14:10:00Z",
    "updated_at": "2026-10-01T14:10:00Z"
  }
]
```

### `GET /api/v1/projects/{project_id}/generations`
Audit history of AI generation runs for a project.

**Response (200 OK):**
```json
[
  {
    "id": "gen-uuid-001",
    "project_id": "proj-uuid-1234",
    "user_id": "user-uuid-5678",
    "tool": "content-repurposer",
    "provider": "google",
    "model": "gemini-2.5-flash",
    "input_metadata": {
      "platforms": ["linkedin", "x"],
      "tone": "educational",
      "content_length": 340
    },
    "output_metadata": {
      "generated_platforms": ["linkedin", "x"]
    },
    "token_usage": {
      "input_tokens": 120,
      "output_tokens": 280,
      "total_tokens": 400
    },
    "status": "completed",
    "created_at": "2026-10-01T14:10:00Z"
  }
]
```

---

## 5. AI Tool: Content Repurposer

### `POST /api/v1/tools/content-repurposer/generate`
Repurposes long-form content into target social platform outputs.
- Validates input content (non-empty, stripped).
- Validates target platforms (`linkedin`, `instagram`, `x`, `youtube`).
- Generates outputs **only** for requested platforms.
- Automatically saves outputs as Project Assets.
- Automatically records an `AIGeneration` log and `UsageRecord`.

**Request:**
```json
{
  "project_id": "proj-uuid-1234",
  "content": "Why modular monolith architecture provides superior reliability for AI SaaS compared to microservices...",
  "platforms": ["linkedin", "youtube"],
  "tone": "educational"
}
```

**Response (200 OK):**
```json
{
  "generation_id": "gen-uuid-001",
  "project_id": "proj-uuid-1234",
  "results": {
    "linkedin": "🚀 Why Modular Monoliths Win for AI SaaS in 2026...\n\n#Architecture #Engineering",
    "youtube": {
      "title": "Why Microservices Are Killing Your AI Startup (And What to Do Instead)",
      "description": "In this video, we break down why modular monoliths provide faster iteration...",
      "tags": ["softwareengineering", "modularmonolith", "aisaas", "startup"],
      "outline": "00:00 Hook\n01:30 The Microservice Trap\n04:00 The Modular Monolith Pattern\n08:00 Conclusion"
    }
  },
  "usage": {
    "input_tokens": 150,
    "output_tokens": 380,
    "total_tokens": 530
  },
  "analysis": {
    "topic": "Modular Monolith vs Microservices for AI SaaS",
    "summary": "Explains why unified codebases reduce distributed system overhead.",
    "key_points": ["Lower latency", "Simpler deployments", "Unified transactions"],
    "audience": "Software engineers and SaaS founders"
  }
}
```

---

## 6. Usage Tracking

### `GET /api/v1/usage`
Aggregated usage statistics for the authenticated user.

**Response (200 OK):**
```json
{
  "total_generations": 12,
  "total_input_tokens": 4200,
  "total_output_tokens": 9800,
  "total_tokens": 14000,
  "tool_breakdown": {
    "content-repurposer": 12
  }
}
```
