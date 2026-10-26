import pytest
import os
import sys

# Ensure testing settings before importing app
os.environ["TESTING"] = "true"
os.environ["AI_PROVIDER"] = "mock"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.core.config import settings
settings.TESTING = True
settings.AI_PROVIDER = "mock"
settings.DATABASE_URL = "sqlite+aiosqlite:///:memory:"

from app.db.models.base import Base
from app.db.session import get_db
from app.main import app

test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
TestingSessionLocal = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)

@pytest.fixture(autouse=True)
async def prepare_database():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as c:
        yield c

@pytest.fixture
async def auth_headers(client: AsyncClient) -> dict:
    resp = await client.post("/api/v1/auth/register", json={
        "email": "creator@omnicreator.ai",
        "password": "Password123!",
        "full_name": "Test Creator"
    })
    token = resp.json()["token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
async def second_auth_headers(client: AsyncClient) -> dict:
    resp = await client.post("/api/v1/auth/register", json={
        "email": "another@omnicreator.ai",
        "password": "Password123!",
        "full_name": "Another Creator"
    })
    token = resp.json()["token"]
    return {"Authorization": f"Bearer {token}"}
