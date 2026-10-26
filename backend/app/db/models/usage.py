from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.models.base import Base, generate_uuid, utc_now

class UsageRecord(Base):
    __tablename__ = "usage_records"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    generation_id = Column(String(36), ForeignKey("ai_generations.id", ondelete="CASCADE"), nullable=False, index=True)
    
    tool = Column(String(100), nullable=False)
    provider = Column(String(50), nullable=False)
    model = Column(String(100), nullable=False)
    
    input_tokens = Column(Integer, nullable=True)
    output_tokens = Column(Integer, nullable=True)
    total_tokens = Column(Integer, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    
    user = relationship("User", back_populates="usage_records")
    project = relationship("Project", back_populates="usage_records")
    generation = relationship("AIGeneration", back_populates="usage_records")
