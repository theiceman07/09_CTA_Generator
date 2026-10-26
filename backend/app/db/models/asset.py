from sqlalchemy import Column, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.models.base import Base, TimestampMixin

class Asset(Base, TimestampMixin):
    __tablename__ = "assets"
    
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50), nullable=False)  # e.g., 'repurposed_post', 'linkedin', 'instagram', 'x', 'youtube', 'script'
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    storage_ref = Column(String(512), nullable=True)  # Cloudflare R2 / S3 path if media
    meta_info = Column(JSON, default=dict)  # Metadata JSONB: platform, tags, format, etc.
    
    project = relationship("Project", back_populates="assets")
