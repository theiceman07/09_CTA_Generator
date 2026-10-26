from collections import defaultdict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.usage import UsageRecord
from app.modules.usage.schemas import UsageSummaryResponse, UsageRecordResponse

class UsageService:
    @staticmethod
    async def get_user_usage_summary(db: AsyncSession, user_id: str) -> UsageSummaryResponse:
        result = await db.execute(
            select(UsageRecord)
            .where(UsageRecord.user_id == user_id)
            .order_by(UsageRecord.created_at.desc())
        )
        records = result.scalars().all()
        
        total_generations = len(records)
        total_input_tokens = sum(r.input_tokens or 0 for r in records)
        total_output_tokens = sum(r.output_tokens or 0 for r in records)
        total_tokens = sum(r.total_tokens or (r.input_tokens or 0) + (r.output_tokens or 0) for r in records)
        
        tool_counts = defaultdict(int)
        for r in records:
            tool_counts[r.tool] += 1
            
        recent = [UsageRecordResponse.model_validate(r) for r in records[:20]]
        
        return UsageSummaryResponse(
            total_generations=total_generations,
            total_input_tokens=total_input_tokens,
            total_output_tokens=total_output_tokens,
            total_tokens=total_tokens,
            tool_breakdown=dict(tool_counts),
            recent_records=recent
        )
