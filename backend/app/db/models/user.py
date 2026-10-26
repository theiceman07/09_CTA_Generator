from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from app.db.models.base import Base, TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    full_name = Column(String(255), default="Creator")
    is_active = Column(Boolean, default=True)
    subscription_tier = Column(String(50), default="free")
    
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    generations = relationship("AIGeneration", back_populates="user", cascade="all, delete-orphan")
    usage_records = relationship("UsageRecord", back_populates="user", cascade="all, delete-orphan")
