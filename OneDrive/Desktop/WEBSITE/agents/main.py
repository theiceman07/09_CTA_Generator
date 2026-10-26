"""
AI Video Pre-Production Studio — FastAPI Backend
Serves three LangChain + Gemini agents via REST API
"""

import os
import logging
import traceback
from typing import Optional
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("agents_api")

# Suppress harmless AFC warning from google-genai SDK
try:
    from google.genai.models import Models
    Models._logged_afc_warning = True
except Exception:
    pass

from agents import (
    run_shot_list_agent,
    run_creative_director_agent,
    run_production_planner_agent,
)

app = FastAPI(
    title="AI Video Pre-Production Studio — Agents API",
    description="Three LangChain agents for video pre-production: Shot List, Creative Director, Production Planner",
    version="1.0.0",
)

# ── CORS (allow requests from React dev server) ──────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite default
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Shared Request Schema ────────────────────────────────────────
class AgentRequest(BaseModel):
    title: str
    script: str
    platform: str = "YouTube"
    videoType: str = "Short-form video"
    tones: list[str] = ["Energetic"]
    targetDuration: str = "60 seconds"
    creativeDirection: Optional[str] = None


# ═══════════════════════════════════════════════════════════════
# HEALTH CHECK
# ═══════════════════════════════════════════════════════════════
@app.get("/")
def root():
    return {
        "status": "online",
        "service": "AI Video Pre-Production Studio — Agents API",
        "agents": {
            "shot-list": "/api/agents/shot-list",
            "creative-director": "/api/agents/creative-director",
            "production-planner": "/api/agents/production-planner",
        },
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "langsmith_tracing": os.getenv("LANGSMITH_TRACING", "").lower() in ("true", "1", "yes"),
        "langsmith_project": os.getenv("LANGSMITH_PROJECT", "FrameFlow-AI"),
    }


# ═══════════════════════════════════════════════════════════════
# AGENT 1: 🎥 SHOT LIST AGENT
# ═══════════════════════════════════════════════════════════════
@app.post("/api/agents/shot-list")
async def shot_list_agent(req: AgentRequest):
    """
    Generate a detailed shot list from a video script.
    Returns structured JSON with shot-by-shot breakdown.
    """
    try:
        result = run_shot_list_agent(
            script=req.script,
            platform=req.platform,
            video_type=req.videoType,
            tones=req.tones,
            target_duration=req.targetDuration,
            title=req.title,
        )
        return {
            "agent": "Shot List Agent",
            "status": "success",
            "data": result,
        }
    except Exception as e:
        logger.error(f"[Shot List Agent] Execution failed: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Shot List Agent error: {str(e)}")


# ═══════════════════════════════════════════════════════════════
# AGENT 2: 🎨 CREATIVE DIRECTOR AGENT
# ═══════════════════════════════════════════════════════════════
@app.post("/api/agents/creative-director")
async def creative_director_agent(req: AgentRequest):
    """
    Generate complete creative direction for a video.
    Returns visual style, color palette, music direction, and more.
    """
    try:
        result = run_creative_director_agent(
            script=req.script,
            platform=req.platform,
            video_type=req.videoType,
            tones=req.tones,
            target_duration=req.targetDuration,
            title=req.title,
            creative_direction=req.creativeDirection or "",
        )
        return {
            "agent": "Creative Director Agent",
            "status": "success",
            "data": result,
        }
    except Exception as e:
        logger.error(f"[Creative Director Agent] Execution failed: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Creative Director Agent error: {str(e)}")


# ═══════════════════════════════════════════════════════════════
# AGENT 3: 📋 PRODUCTION PLANNER AGENT
# ═══════════════════════════════════════════════════════════════
@app.post("/api/agents/production-planner")
async def production_planner_agent(req: AgentRequest):
    """
    Generate a full production plan with scenes, timeline, props & equipment.
    Returns structured JSON ready for the workspace.
    """
    try:
        result = run_production_planner_agent(
            script=req.script,
            platform=req.platform,
            video_type=req.videoType,
            tones=req.tones,
            target_duration=req.targetDuration,
            title=req.title,
        )
        return {
            "agent": "Production Planner Agent",
            "status": "success",
            "data": result,
        }
    except Exception as e:
        logger.error(f"[Production Planner Agent] Execution failed: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Production Planner Agent error: {str(e)}")


# ═══════════════════════════════════════════════════════════════
# RUN ALL THREE AGENTS AT ONCE
# ═══════════════════════════════════════════════════════════════
@app.post("/api/agents/run-all")
async def run_all_agents(req: AgentRequest):
    """
    Run all three agents in sequence and return combined results.
    """
    results = {}
    errors = {}

    try:
        results["shotList"] = run_shot_list_agent(
            script=req.script, platform=req.platform, video_type=req.videoType,
            tones=req.tones, target_duration=req.targetDuration, title=req.title,
        )
    except Exception as e:
        logger.error(f"[Run All - Shot List] Execution failed: {e}")
        traceback.print_exc()
        errors["shotList"] = str(e)

    try:
        results["creativeDirection"] = run_creative_director_agent(
            script=req.script, platform=req.platform, video_type=req.videoType,
            tones=req.tones, target_duration=req.targetDuration, title=req.title,
            creative_direction=req.creativeDirection or "",
        )
    except Exception as e:
        logger.error(f"[Run All - Creative Director] Execution failed: {e}")
        traceback.print_exc()
        errors["creativeDirection"] = str(e)

    try:
        results["productionPlan"] = run_production_planner_agent(
            script=req.script, platform=req.platform, video_type=req.videoType,
            tones=req.tones, target_duration=req.targetDuration, title=req.title,
        )
    except Exception as e:
        logger.error(f"[Run All - Production Planner] Execution failed: {e}")
        traceback.print_exc()
        errors["productionPlan"] = str(e)

    return {
        "status": "completed" if not errors else "partial",
        "results": results,
        "errors": errors if errors else None,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
