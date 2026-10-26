import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings
from app.core.logging import logger
from app.db.models.base import Base

# Determine effective async database URL
database_url = settings.DATABASE_URL

# For testing or if running locally without a live Postgres service
if settings.TESTING:
    database_url = "sqlite+aiosqlite:///:memory:"
elif "sqlite" in database_url.lower():
    if not database_url.startswith("sqlite+aiosqlite"):
        database_url = database_url.replace("sqlite://", "sqlite+aiosqlite://")

# Ensure proper driver specification for PostgreSQL
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://")

logger.info(f"Configuring database engine for: {database_url.split('@')[-1] if '@' in database_url else database_url}")

connect_args = {}
if "sqlite" in database_url:
    connect_args = {"check_same_thread": False}

try:
    engine = create_async_engine(
        database_url,
        echo=False,
        future=True,
        connect_args=connect_args
    )
except Exception as e:
    logger.warning(f"Failed to create primary engine ({e}), falling back to SQLite for local development")
    database_url = "sqlite+aiosqlite:///./omnicreator_dev.db"
    engine = create_async_engine(database_url, echo=False, future=True, connect_args={"check_same_thread": False})

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    global engine, async_session_factory
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema initialized successfully.")
    except Exception as e:
        logger.warning(f"Could not connect to configured database ({e}). Falling back to local SQLite dev database (creator_ai_dev.db)...")
        fallback_url = "sqlite+aiosqlite:///./creator_ai_dev.db"
        engine = create_async_engine(
            fallback_url,
            echo=False,
            future=True,
            connect_args={"check_same_thread": False}
        )
        async_session_factory = async_sessionmaker(
            engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False
        )
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Local SQLite database initialized successfully at creator_ai_dev.db.")

