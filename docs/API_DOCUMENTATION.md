# Unified API Documentation

## Base URL
- Local: `http://localhost:8000/api/v1`
- Swagger UI: `http://localhost:8000/docs`

## Endpoints

### 1. Authentication (`/auth`)
- `POST /auth/register`: Create user account. Returns JWT access token.
- `POST /auth/login`: Authenticate with email/password. Returns JWT access token.
- `GET /auth/me`: Get authenticated user profile.

### 2. Application Registry (`/registry`)
- `GET /registry/applications`: Returns list of all 24 standardized application capabilities with metadata (ID, category, input/output types, status).

### 3. Projects (`/projects`)
- `GET /projects`: List user-owned projects.
- `POST /projects`: Create a new project workspace.
- `GET /projects/{id}`: Retrieve project details.
- `PUT /projects/{id}`: Update project metadata (niche, tone, audience).
- `DELETE /projects/{id}`: Delete project.
- `GET /projects/{id}/assets`: Retrieve project generated assets.
- `GET /projects/{id}/generations`: Retrieve project generation logs.

### 4. Content Repurposer (`/tools/content-repurposer`)
- `POST /tools/content-repurposer/generate`:
  - **Body**:
    ```json
    {
      "project_id": "uuid",
      "content": "raw text to repurpose",
      "platforms": ["linkedin", "instagram", "x", "youtube"],
      "tone": "professional"
    }
    ```
  - **Response**:
    ```json
    {
      "generation_id": "uuid",
      "project_id": "uuid",
      "results": {
        "linkedin": "...",
        "instagram": "...",
        "x": "...",
        "youtube": { "title": "...", "description": "...", "tags": [...], "outline": "..." }
      },
      "usage": { "input_tokens": 120, "output_tokens": 450, "latency_ms": 3200 },
      "analysis": { "topic": "...", "key_points": [...], "core_message": "..." }
    }
    ```

### 5. Usage & Tracking (`/usage`)
- `GET /usage/summary`: Retrieve user token consumption and generation counts.
