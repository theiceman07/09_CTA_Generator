from typing import List, Optional
from pydantic import BaseModel, Field

class ApplicationCapability(BaseModel):
    id: str
    name: str
    description: str
    category: str
    route: str
    capabilities: List[str]
    input_type: str
    output_type: str
    is_ai_powered: bool = True
    requires_background_worker: bool = False
    supports_project_assets: bool = True
    supports_workflow_chaining: bool = True
    status: str = "active"  # "active" | "planned"

APPLICATION_REGISTRY: List[ApplicationCapability] = [
    # 1. Content Idea Generator
    ApplicationCapability(
        id="content-idea-generator",
        name="Content Idea Generator",
        description="Brainstorm viral, niche-targeted content concepts, topics, and video angles.",
        category="Content Creation",
        route="/tools/content-idea-generator",
        capabilities=["ideation", "trend-analysis", "angle-generation"],
        input_type="niche_or_topic",
        output_type="list_of_ideas",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 2. Content Repurposer (Active Reference Implementation)
    ApplicationCapability(
        id="content-repurposer",
        name="Content Repurposer",
        description="Multi-platform transformation of core ideas into tailored LinkedIn, Instagram, X, and YouTube assets.",
        category="Repurposing & Optimization",
        route="/tools/content-repurposer",
        capabilities=["content-analysis", "cross-platform-formatting", "carousel-generation", "thread-creation"],
        input_type="raw_text",
        output_type="platform_package",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 3. Hook Generator
    ApplicationCapability(
        id="hook-generator",
        name="Hook Generator",
        description="Generate high-converting, scroll-stopping hooks tailored to psychological angles.",
        category="Content Creation",
        route="/tools/hook-generator",
        capabilities=["psychological-framing", "retention-hooks", "a-b-options"],
        input_type="topic_or_draft",
        output_type="list_of_hooks",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 4. Daily Content Planner
    ApplicationCapability(
        id="daily-content-planner",
        name="Daily Content Planner",
        description="Structure calendar scheduling, distribution cadences, and content slots.",
        category="Repurposing & Optimization",
        route="/tools/daily-content-planner",
        capabilities=["calendar-planning", "cadence-optimization", "content-matrix"],
        input_type="topics_and_dates",
        output_type="schedule_plan",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 5. Reel Script Builder
    ApplicationCapability(
        id="reel-script-builder",
        name="Reel Script Builder",
        description="Build short-form vertical video scripts with visual cues, pacing, and hooks.",
        category="Content Creation",
        route="/tools/reel-script-builder",
        capabilities=["scriptwriting", "visual-direction", "audio-cues"],
        input_type="concept_or_summary",
        output_type="short_form_script",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 6. Clip Finder
    ApplicationCapability(
        id="clip-finder",
        name="Clip Finder",
        description="Extract high-impact moments and highlight timestamps from long-form video and audio.",
        category="Audio & Video Media",
        route="/tools/clip-finder",
        capabilities=["transcript-indexing", "virality-scoring", "timestamp-extraction"],
        input_type="video_or_audio_url",
        output_type="highlight_clips",
        is_ai_powered=True,
        requires_background_worker=True,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 7. Thumbnail Ideator
    ApplicationCapability(
        id="thumbnail-ideator",
        name="Thumbnail Ideator",
        description="Generate high-CTR visual thumbnail concepts, composition layouts, and text overlays.",
        category="Audio & Video Media",
        route="/tools/thumbnail-ideator",
        capabilities=["composition-layouts", "contrast-ideation", "visual-prompts"],
        input_type="video_title_or_script",
        output_type="thumbnail_concepts",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 8. Caption Assistant
    ApplicationCapability(
        id="caption-assistant",
        name="Caption Assistant",
        description="Craft punchy, platform-optimized captions with hashtags and callouts.",
        category="Content Creation",
        route="/tools/caption-assistant",
        capabilities=["caption-crafting", "hashtag-clustering", "readability-optimization"],
        input_type="draft_or_summary",
        output_type="captions",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 9. CTA Generator
    ApplicationCapability(
        id="cta-generator",
        name="CTA Generator",
        description="Create irresistible call-to-actions tailored for conversions, follows, and engagement.",
        category="Content Creation",
        route="/tools/cta-generator",
        capabilities=["lead-generation-cta", "engagement-prompts", "link-in-bio-triggers"],
        input_type="content_goal",
        output_type="cta_options",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 10. Comment Analyzer
    ApplicationCapability(
        id="comment-analyzer",
        name="Comment Analyzer",
        description="Sentiment, question detection, and audience insight extraction from community feedback.",
        category="Repurposing & Optimization",
        route="/tools/comment-analyzer",
        capabilities=["sentiment-analysis", "faq-extraction", "audience-insights"],
        input_type="comments_list",
        output_type="analysis_report",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 11. Comment to Content
    ApplicationCapability(
        id="comment-to-content",
        name="Comment to Content",
        description="Transform audience questions and viral comments into complete follow-up posts.",
        category="Repurposing & Optimization",
        route="/tools/comment-to-content",
        capabilities=["question-answering", "objection-handling", "followup-scripts"],
        input_type="user_comment",
        output_type="followup_content",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 12. Creator Research Assistant
    ApplicationCapability(
        id="creator-research-assistant",
        name="Creator Research Assistant",
        description="In-depth factual synthesis, competitor angle analysis, and academic/domain research.",
        category="Research & Strategy",
        route="/tools/creator-research-assistant",
        capabilities=["topic-deep-dive", "source-aggregation", "fact-checking"],
        input_type="research_query",
        output_type="research_brief",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 13. Voice Replicator
    ApplicationCapability(
        id="voice-replicator",
        name="Voice Replicator",
        description="Analyze creator tone signatures and synthesize personalized voice styles.",
        category="Audio & Video Media",
        route="/tools/voice-replicator",
        capabilities=["voice-signature-analysis", "tone-replication", "cadence-matching"],
        input_type="audio_sample_or_transcript",
        output_type="voice_profile",
        is_ai_powered=True,
        requires_background_worker=True,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 14. Podcast Assistant
    ApplicationCapability(
        id="podcast-assistant",
        name="Podcast Assistant",
        description="Generate episode show notes, key timestamps, quotes, and newsletter recaps.",
        category="Audio & Video Media",
        route="/tools/podcast-assistant",
        capabilities=["show-notes", "chaptering", "quote-cards", "newsletter-recap"],
        input_type="transcript_or_audio",
        output_type="podcast_package",
        is_ai_powered=True,
        requires_background_worker=True,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 15. Creator Workspace
    ApplicationCapability(
        id="creator-workspace",
        name="Creator Workspace",
        description="Central unified studio interface for real-time asset drafting and tool handoffs.",
        category="Workflows & Autonomous Pipelines",
        route="/tools/creator-workspace",
        capabilities=["rich-editing", "cross-tool-handoff", "multi-asset-management"],
        input_type="project_context",
        output_type="workspace_state",
        is_ai_powered=False,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 16. Content Recycler
    ApplicationCapability(
        id="content-recycler",
        name="Content Recycler",
        description="Refresh past top-performing assets with new angles, updated hooks, and current frameworks.",
        category="Repurposing & Optimization",
        route="/tools/content-recycler",
        capabilities=["angle-refresh", "hook-modernization", "evergreen-adaptation"],
        input_type="past_successful_post",
        output_type="refreshed_assets",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 17. Brand Pitch Builder
    ApplicationCapability(
        id="brand-pitch-builder",
        name="Brand Pitch Builder",
        description="Construct tailored creator brand sponsorship pitches, rate cards, and proposal emails.",
        category="Research & Strategy",
        route="/tools/brand-pitch-builder",
        capabilities=["proposal-generation", "value-proposition", "roi-framing"],
        input_type="brand_and_metrics",
        output_type="brand_pitch_deck",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 18. AI Content Director
    ApplicationCapability(
        id="ai-content-director",
        name="AI Content Director",
        description="High-level editorial orchestration, multi-week campaign planning, and quality control.",
        category="Workflows & Autonomous Pipelines",
        route="/tools/ai-content-director",
        capabilities=["campaign-orchestration", "quality-evaluation", "strategic-direction"],
        input_type="strategic_goals",
        output_type="content_campaign",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 19. AI Content Director — Guruvelah
    ApplicationCapability(
        id="ai-content-director-guruvelah",
        name="AI Content Director — Guruvelah",
        description="Specialized narrative strategy and philosophical creative direction engine.",
        category="Workflows & Autonomous Pipelines",
        route="/tools/ai-content-director-guruvelah",
        capabilities=["philosophical-narrative", "signature-framing", "signature-voice"],
        input_type="strategic_thesis",
        output_type="signature_campaign",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 20. Creator Second Brain
    ApplicationCapability(
        id="creator-second-brain",
        name="Creator Second Brain",
        description="Semantic retrieval, knowledge base Q&A, and citation-grounded memory using pgvector.",
        category="Research & Strategy",
        route="/tools/creator-second-brain",
        capabilities=["semantic-retrieval", "vector-indexing", "grounded-synthesis"],
        input_type="knowledge_docs_and_queries",
        output_type="grounded_answers",
        is_ai_powered=True,
        requires_background_worker=True,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 21. AI Screenplay Workspace
    ApplicationCapability(
        id="screenplay-workspace",
        name="AI Screenplay Workspace",
        description="Long-form storytelling workspace with scene breakdown, character bible, and dialogue.",
        category="Content Creation",
        route="/tools/screenplay-workspace",
        capabilities=["scene-breakdown", "character-bible", "dialogue-generation", "fountain-export"],
        input_type="treatment_or_synopsis",
        output_type="screenplay_document",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 22. Autonomous Content Pipeline
    ApplicationCapability(
        id="autonomous-content-pipeline",
        name="Autonomous Content Pipeline",
        description="End-to-end multi-stage pipeline: idea -> hook -> script -> repurpose -> queue.",
        category="Workflows & Autonomous Pipelines",
        route="/tools/autonomous-content-pipeline",
        capabilities=["autonomous-batching", "stage-transitions", "human-in-the-loop-review"],
        input_type="campaign_seed",
        output_type="end_to_end_pipeline",
        is_ai_powered=True,
        requires_background_worker=True,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 23. AI Creative Producer
    ApplicationCapability(
        id="ai-creative-producer",
        name="AI Creative Producer",
        description="Production budgeting, asset checklist generator, equipment breakdown, and timeline management.",
        category="Workflows & Autonomous Pipelines",
        route="/tools/ai-creative-producer",
        capabilities=["production-planning", "asset-checklist", "schedule-estimation"],
        input_type="project_concept",
        output_type="production_plan",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
    # 24. Creator Collaboration Finder
    ApplicationCapability(
        id="collaboration-finder",
        name="Creator Collaboration Finder",
        description="Match with creators by audience overlap, complementary skills, and co-host opportunities.",
        category="Research & Strategy",
        route="/tools/collaboration-finder",
        capabilities=["overlap-matching", "outreach-generation", "synergy-scoring"],
        input_type="channel_profile",
        output_type="matches_and_pitches",
        is_ai_powered=True,
        requires_background_worker=False,
        supports_project_assets=True,
        supports_workflow_chaining=True,
        status="active"
    ),
]
