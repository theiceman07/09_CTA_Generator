from fastapi import APIRouter
from app.modules.auth.router import router as auth_router
from app.modules.projects.router import router as projects_router
from app.modules.assets.router import router as assets_router
from app.modules.generations.router import router as generations_router
from app.modules.usage.router import router as usage_router
from app.modules.content_repurposer.router import router as repurposer_router
from app.modules.content_idea_generator.router import router as idea_router, alias_router as idea_alias_router
from app.modules.hook_generator.router import router as hook_router, alias_router as hook_alias_router
from app.modules.reel_script_builder.router import router as reel_script_router, alias_router as reel_script_alias_router
from app.modules.caption_assistant.router import router as caption_router, alias_router as caption_alias_router
from app.modules.cta_generator.router import router as cta_router, alias_router as cta_alias_router
from app.modules.comment_analyzer.router import router as comment_router, alias_router as comment_alias_router
from app.modules.comment_to_content.router import router as comment_to_content_router
from app.modules.content_recycler.router import router as content_recycler_router
from app.modules.brand_pitch_builder.router import router as brand_pitch_router, alias_router as brand_pitch_alias_router
from app.modules.creator_collaboration_finder.router import router as collaboration_router, alias_router as collaboration_alias_router
from app.modules.daily_content_planner.router import router as daily_planner_router
from app.modules.thumbnail_ideator.router import router as thumbnail_ideator_router
from app.modules.creator_research_assistant.router import router as creator_research_router, alias_router as creator_research_alias_router
from app.modules.creator_workspace.router import router as workspace_router
from app.modules.creator_second_brain.router import router as second_brain_router
from app.modules.voice_replicator.router import router as voice_router, alias_router as voice_alias_router
from app.modules.podcast_assistant.router import router as podcast_router, alias_router as podcast_alias_router
from app.modules.clip_finder.router import router as clip_router, alias_router as clip_alias_router
from app.modules.ai_content_director.router import router as director_router, alias_router as director_alias_router
from app.modules.ai_content_director_guruvelah.router import router as guruvelah_router, alias_router as guruvelah_alias_router
from app.modules.ai_screenplay_workspace.router import router as screenplay_router, alias_router as screenplay_alias_router
from app.modules.autonomous_content_pipeline.router import router as pipeline_router, alias_router as pipeline_alias_router
from app.modules.ai_creative_producer.router import router as producer_router, alias_router as producer_alias_router
from app.core.config import settings

from app.core.registry import APPLICATION_REGISTRY, ApplicationCapability
from typing import List

api_router = APIRouter()

# Register domain modules
api_router.include_router(auth_router)
api_router.include_router(projects_router)
api_router.include_router(assets_router)
api_router.include_router(generations_router)
api_router.include_router(usage_router)
api_router.include_router(repurposer_router)
api_router.include_router(idea_router)
api_router.include_router(idea_alias_router)
api_router.include_router(hook_router)
api_router.include_router(hook_alias_router)
api_router.include_router(reel_script_router)
api_router.include_router(reel_script_alias_router)
api_router.include_router(caption_router)
api_router.include_router(caption_alias_router)
api_router.include_router(cta_router)
api_router.include_router(cta_alias_router)
api_router.include_router(comment_router)
api_router.include_router(comment_alias_router)
api_router.include_router(comment_to_content_router)
api_router.include_router(content_recycler_router)
api_router.include_router(brand_pitch_router)
api_router.include_router(brand_pitch_alias_router)
api_router.include_router(collaboration_router)
api_router.include_router(collaboration_alias_router)
api_router.include_router(daily_planner_router)
api_router.include_router(thumbnail_ideator_router)
api_router.include_router(creator_research_router)
api_router.include_router(creator_research_alias_router)
api_router.include_router(workspace_router)
api_router.include_router(second_brain_router)
api_router.include_router(voice_router)
api_router.include_router(voice_alias_router)
api_router.include_router(podcast_router)
api_router.include_router(podcast_alias_router)
api_router.include_router(clip_router)
api_router.include_router(clip_alias_router)
api_router.include_router(director_router)
api_router.include_router(director_alias_router)
api_router.include_router(guruvelah_router)
api_router.include_router(guruvelah_alias_router)
api_router.include_router(screenplay_router)
api_router.include_router(screenplay_alias_router)
api_router.include_router(pipeline_router)
api_router.include_router(pipeline_alias_router)
api_router.include_router(producer_router)
api_router.include_router(producer_alias_router)

@api_router.get("/registry/applications", response_model=List[ApplicationCapability], tags=["Application Registry"])
async def get_application_registry():
    """
    Standardized Application Registry returning all 24 SaaS capabilities.
    """
    return APPLICATION_REGISTRY

@api_router.get("/health", tags=["Health"])
async def api_health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }
