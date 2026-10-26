from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.content_repurposer.schemas import ContentRepurposerRequest, ContentRepurposerResponse
from app.modules.content_repurposer.service import ContentRepurposerService

router = APIRouter(prefix="/tools/content-repurposer", tags=["Content Repurposer"])

@router.post("/generate", response_model=ContentRepurposerResponse, status_code=status.HTTP_200_OK)
async def generate_repurposed_content(
    request: ContentRepurposerRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await ContentRepurposerService.generate(
        db=db,
        user_id=current_user.id,
        request=request
    )
