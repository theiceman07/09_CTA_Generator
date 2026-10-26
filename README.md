# CreatorOS — AI Creator Workspace

CreatorOS is an AI-powered creative workspace that helps creators transform ideas into researched, platform-ready content. It brings content generation, trend discovery, evaluation, content management, and publishing preparation into one unified experience.

## Features

### AI Content Studio
- Generate content for Instagram Reels, carousels, captions, and stories.
- Adapt tone and messaging for different audiences and platforms.
- Refine generated drafts before saving or exporting them.

### Trend Discovery
- Explore trends and creative angles relevant to a creator's niche.
- Filter and bookmark useful trends.
- Use selected trends as starting points for content generation.

### Content Evaluation
- Evaluate hooks, clarity, pacing, audience relevance, and calls to action.
- Identify strengths and opportunities for improvement.
- Apply suggested improvements to working drafts.

### Content Library
- Save and manage generated content.
- Search and filter drafts by format.
- View, copy, and delete saved items.

### Dashboard and Settings
- View saved content, bookmarked trends, and recent activity.
- Configure content preferences and AI provider settings.
- Keep API credentials on the server side.

## Technology Stack

The repository is organized as a pnpm monorepo with a Next.js web application.

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **UI and interactions:** shadcn/ui, Lucide React, and supporting UI libraries
- **AI integration:** Configurable language-model providers
- **Workspace:** pnpm

Backend services, database integrations, authentication, and agent orchestration must follow the implementation and architecture documented in the corresponding repository files.

## Prerequisites

Install the following tools before starting development:

- Node.js version supported by the repository
- pnpm version specified by the root `package.json`
- Any additional runtimes or services required by the backend

## Getting Started

### 1. Install dependencies

From the repository root:

```bash
pnpm install
```

### 2. Configure environment variables

Use the repository's `.env.example` as a reference and create the required local environment files.

Never commit `.env` files, API keys, access tokens, or other secrets.

### 3. Start the web application

```bash
pnpm dev --filter web
```

If the workspace scripts differ, use the commands documented in the relevant package's `package.json`.

Open the local URL printed in the terminal.

### 4. Run checks

Use the scripts defined in the root or relevant workspace package:

```bash
pnpm lint
pnpm test
pnpm build
```

Some commands may require the corresponding scripts to be configured.

## Project Structure

The repository uses a workspace-based structure. The exact folders and responsibilities are defined by the files present in the repository.

Typical components may include:

- `apps/web/` — web application
- `apps/agent/` — agent service, if implemented
- `apps/api/` — API service, if implemented
- `packages/` — shared packages and utilities

Refer to the actual workspace configuration before assuming that every directory or service is present.

## Security

- Keep secrets and credentials out of source control.
- Validate inputs at application and API boundaries.
- Keep AI provider credentials on the server.
- Do not publish content to external platforms without explicit user approval.
- Use authenticated and authorized access for private creator data.

## Development Guidelines

- Follow the architecture and conventions documented in `CLAUDE.md` and the repository's technical specifications.
- Reuse shared schemas and components where available.
- Keep changes focused and test affected functionality.
- Document environment variables and setup requirements.
- Do not claim a feature is implemented until it has been verified in the codebase.

## Project Status

The available features and services depend on the current implementation. Consult the source code, tests, and project documentation to determine which capabilities are implemented and which remain planned.
