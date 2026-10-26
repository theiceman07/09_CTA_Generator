from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.content_idea_generator.schemas import ContentIdeaRequest, ContentIdeaResponse
from app.modules.content_idea_generator.service import content_idea_service

router = APIRouter(prefix="/tools/content-ideas", tags=["Content Idea Generator"])

@router.post("/generate", response_model=ContentIdeaResponse, status_code=status.HTTP_200_OK)
async def generate_content_ideas(
    request: ContentIdeaRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate grounded, viral, platform-specific content ideas, hooks, and execution angles.
    Powered by Google Gemini (gemini-3.1-flash-lite) and LangChain.
    """
    return await content_idea_service.generate_ideas(
        db=db,
        user_id=current_user.id,
        request=request
    )

# Alias router mounted under /tools/content-idea-generator to match application ID convention
alias_router = APIRouter(prefix="/tools/content-idea-generator", tags=["Content Idea Generator"])

@alias_router.post("/generate", response_model=ContentIdeaResponse, status_code=status.HTTP_200_OK)
async def generate_content_ideas_alias(
    request: ContentIdeaRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await content_idea_service.generate_ideas(
        db=db,
        user_id=current_user.id,
        request=request
    )
