from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.models.base import Base, TimestampMixin

class Project(Base, TimestampMixin):
    __tablename__ = "projects"
    
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_audience = Column(String(255), nullable=True)
    tone = Column(String(100), default="Professional")
    primary_goal = Column(String(100), default="Growth")
    status = Column(String(50), default="active")
    
    user = relationship("User", back_populates="projects")
    assets = relationship("Asset", back_populates="project", cascade="all, delete-orphan")
    generations = relationship("AIGeneration", back_populates="project", cascade="all, delete-orphan")
    usage_records = relationship("UsageRecord", back_populates="project", cascade="all, delete-orphan")
