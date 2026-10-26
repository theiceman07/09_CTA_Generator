from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.creator_second_brain.schemas import (
    SecondBrainItemCreate,
    SecondBrainItemResponse,
    SecondBrainQueryRequest,
    SecondBrainQueryResponse,
)
from app.modules.creator_second_brain.service import creator_second_brain_service

router = APIRouter(prefix="/tools/second-brain", tags=["Creator Second Brain"])

@router.post(
    "/items",
    response_model=SecondBrainItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save a knowledge item/note to Creator Second Brain"
)
async def create_second_brain_item(
    data: SecondBrainItemCreate,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await creator_second_brain_service.create_item(
        db=db,
        user_id=current_user.id,
        data=data
    )

@router.get(
    "/items",
    response_model=List[SecondBrainItemResponse],
    status_code=status.HTTP_200_OK,
    summary="List or search saved knowledge items in Creator Second Brain"
)
async def list_second_brain_items(
    project_id: str = Query(..., description="Target project ID"),
    query: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await creator_second_brain_service.list_items(
        db=db,
        user_id=current_user.id,
        project_id=project_id,
        query=query,
        category=category
    )

@router.post(
    "/query",
    response_model=SecondBrainQueryResponse,
    status_code=status.HTTP_200_OK,
    summary="Query and synthesize answers from stored second brain knowledge"
)
async def query_second_brain(
    request: SecondBrainQueryRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await creator_second_brain_service.query_brain(
        db=db,
        user_id=current_user.id,
        request=request
    )
