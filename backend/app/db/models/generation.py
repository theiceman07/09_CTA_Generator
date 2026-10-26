from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from app.db.models.base import Base, generate_uuid, utc_now

class AIGeneration(Base):
    __tablename__ = "ai_generations"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tool = Column(String(100), nullable=False)  # e.g., 'content-repurposer'
    provider = Column(String(50), nullable=False)  # e.g., 'google', 'anthropic', 'mock'
    model = Column(String(100), nullable=False)  # e.g., 'gemini-2.5-flash'
    
    input_data = Column(JSON, nullable=False, default=dict)  # content, platforms, tone, etc.
    output_data = Column(JSON, nullable=False, default=dict)  # generated platforms, analysis, etc.
    
    input_tokens = Column(Integer, nullable=True)
    output_tokens = Column(Integer, nullable=True)
    total_tokens = Column(Integer, nullable=True)
    latency_ms = Column(Integer, nullable=True)
    
    status = Column(String(50), default="completed")  # 'pending', 'completed', 'failed'
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    
    project = relationship("Project", back_populates="generations")
    user = relationship("User", back_populates="generations")
    usage_records = relationship("UsageRecord", back_populates="generation", cascade="all, delete-orphan")
