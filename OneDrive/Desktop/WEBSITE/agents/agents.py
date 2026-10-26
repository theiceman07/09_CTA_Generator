"""
AI Video Pre-Production Studio — LangChain Agents
Three specialized agents powered by Gemini via LangChain:

1. 🎥 Shot List Agent    — Generates detailed shot lists from a script
2. 🎨 Creative Director  — Suggests style, tone, mood & visual direction
3. 📋 Production Planner — Plans scenes, timeline, props & equipment
"""

import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from langsmith import traceable
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────────
# LangSmith Observability & Tracing Configuration
# ─────────────────────────────────────────────
if os.getenv("LANGSMITH_TRACING", "").lower() in ("true", "1", "yes"):
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    os.environ["LANGSMITH_TRACING"] = "true"

langsmith_key = os.getenv("LANGSMITH_API_KEY") or os.getenv("LANGCHAIN_API_KEY")
if langsmith_key and langsmith_key != "YOUR_LANGSMITH_API_KEY":
    os.environ["LANGSMITH_API_KEY"] = langsmith_key
    os.environ["LANGCHAIN_API_KEY"] = langsmith_key

langsmith_project = os.getenv("LANGSMITH_PROJECT") or os.getenv("LANGCHAIN_PROJECT") or "FrameFlow-AI"
os.environ["LANGSMITH_PROJECT"] = langsmith_project
os.environ["LANGCHAIN_PROJECT"] = langsmith_project

# Suppress harmless AFC warning from google-genai SDK
try:
    from google.genai.models import Models
    Models._logged_afc_warning = True
except Exception:
    pass

# ─────────────────────────────────────────────
# Helper: Safely extract text from response.content
# ─────────────────────────────────────────────
def extract_content_text(content) -> str:
    """Extract string text from response.content whether it's a str or a list of content blocks."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict) and "text" in item:
                parts.append(item["text"])
            elif hasattr(item, "text"):
                parts.append(str(item.text))
        return "\n".join(parts)
    return str(content)

# ─────────────────────────────────────────────
# Shared LLM (Gemini via LangChain)
# ─────────────────────────────────────────────
def get_llm(temperature: float = 0.7):
    primary_model = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    primary = ChatGoogleGenerativeAI(
        model=primary_model,
        temperature=temperature,
        max_retries=1,
    )
    # Automatic fallback if primary model encounters 429 quota exhaustion or API limits
    fallback = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        temperature=temperature,
        max_retries=2,
    )
    return primary.with_fallbacks([fallback])


# ═══════════════════════════════════════════════════════════════
# AGENT 1: 🎥 SHOT LIST AGENT
# ═══════════════════════════════════════════════════════════════

SHOT_LIST_SYSTEM = """You are an expert cinematographer and Shot List specialist for video production.
Given a script, platform, video type, and tone — generate a detailed, professional shot list.

For each shot, provide:
- Shot number
- Shot type (Close-up, Medium, Wide, Extreme close-up, etc.)
- Camera angle (Eye level, Low angle, High angle, Dutch angle)
- Camera movement (Static, Pan, Tilt, Push in, Pull out, Tracking, Handheld)
- Lens suggestion (24mm, 35mm, 50mm, 85mm, etc.)
- Subject / what is in frame
- Duration in seconds
- Audio notes

Return a JSON array of shot objects. Be cinematic, specific, and practical.
"""

@traceable(
    name="Shot List Agent",
    run_type="chain",
    metadata={"agent": "Shot List Agent", "framework": "LangChain"},
)
def run_shot_list_agent(
    script: str,
    platform: str,
    video_type: str,
    tones: list[str],
    target_duration: str,
    title: str,
) -> dict:
    """Shot List Agent — generates a professional shot list from a script."""
    llm = get_llm(temperature=0.6)

    prompt = f"""
Generate a detailed shot list for this video production:

Title: {title}
Platform: {platform}
Video Type: {video_type}
Tone(s): {', '.join(tones)}
Target Duration: {target_duration}

SCRIPT:
{script}

Return a JSON object with this structure:
{{
  "shotList": [
    {{
      "shotNumber": 1,
      "sceneNumber": 1,
      "shotType": "Close-up",
      "cameraAngle": "Eye level",
      "cameraMovement": "Static",
      "lensSuggestion": "50mm f/1.8",
      "framing": "Subject centered, tight on face",
      "subject": "Description of what is in frame",
      "duration": "3 sec",
      "durationSeconds": 3,
      "audio": "Clean dialogue, no music",
      "description": "Brief cinematic description"
    }}
  ],
  "totalShots": 12,
  "estimatedDuration": "60 sec",
  "cinematographyNotes": "Overall visual style notes"
}}

Generate between 8-20 shots depending on the script length.
"""

    messages = [
        SystemMessage(content=SHOT_LIST_SYSTEM),
        HumanMessage(content=prompt),
    ]

    response = llm.invoke(
        messages,
        config={
            "run_name": "Shot List Gemini Model Call",
            "metadata": {
                "agent": "Shot List Agent",
                "title": title,
                "platform": platform,
                "video_type": video_type,
            },
        },
    )
    raw = extract_content_text(response.content)

    # Extract JSON from the response
    try:
        # Try to find JSON block
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0].strip()
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0].strip()
        result = json.loads(raw)
    except Exception:
        # Fallback: return raw text in a structured wrapper
        result = {
            "shotList": [],
            "totalShots": 0,
            "estimatedDuration": target_duration,
            "cinematographyNotes": raw,
            "error": "Could not parse structured JSON — see cinematographyNotes for raw output",
        }

    return result


# ═══════════════════════════════════════════════════════════════
# AGENT 2: 🎨 CREATIVE DIRECTOR AGENT
# ═══════════════════════════════════════════════════════════════

CREATIVE_DIRECTOR_SYSTEM = """You are a visionary Creative Director with 15 years of experience directing 
viral YouTube, TikTok, and Instagram content. You have a deep understanding of visual storytelling, 
color theory, lighting aesthetics, and platform-specific trends.

Your job is to define the complete creative vision for a video — its look, feel, mood, color palette,
music direction, editing style, and visual motifs.
"""

@traceable(
    name="Creative Director Agent",
    run_type="chain",
    metadata={"agent": "Creative Director Agent", "framework": "LangChain"},
)
def run_creative_director_agent(
    script: str,
    platform: str,
    video_type: str,
    tones: list[str],
    target_duration: str,
    title: str,
    creative_direction: str = "",
) -> dict:
    """Creative Director Agent — defines the full visual & creative direction."""
    llm = get_llm(temperature=0.8)

    prompt = f"""
Act as Creative Director for this video production. Define the complete creative vision.

Title: {title}
Platform: {platform}
Video Type: {video_type}
Tone(s): {', '.join(tones)}
Target Duration: {target_duration}
Additional Creative Notes: {creative_direction or "None provided"}

SCRIPT:
{script}

Return a JSON object with this structure:
{{
  "visualStyle": "Detailed description of the overall visual aesthetic",
  "colorPalette": {{
    "primary": "#HEX color",
    "secondary": "#HEX color",
    "accent": "#HEX color",
    "mood": "Warm / Cool / Neutral / Vibrant",
    "description": "Explanation of color choices"
  }},
  "lightingStyle": "Detailed lighting approach (e.g., 'Natural window light with warm fill, golden hour tones')",
  "editingStyle": "Cut pace, transitions, effects (e.g., 'Fast-paced cuts every 2s, whip pans, J-cuts')",
  "musicDirection": {{
    "genre": "Genre of background music",
    "tempo": "BPM range or description",
    "mood": "Emotional feel of the music",
    "examples": ["Song/artist reference 1", "Song/artist reference 2"]
  }},
  "visualMotifs": ["Recurring visual element 1", "Recurring visual element 2"],
  "openingHook": "Detailed description of how the video should open (first 3 seconds)",
  "closingFrame": "Description of the final frame / call-to-action moment",
  "platformOptimizations": ["Specific optimization for {platform} 1", "Optimization 2"],
  "moodBoard": ["Visual reference / keyword 1", "Visual reference 2", "Visual reference 3"],
  "directorNotes": "Overall creative vision statement from the director"
}}
"""

    messages = [
        SystemMessage(content=CREATIVE_DIRECTOR_SYSTEM),
        HumanMessage(content=prompt),
    ]

    response = llm.invoke(
        messages,
        config={
            "run_name": "Creative Director Gemini Model Call",
            "metadata": {
                "agent": "Creative Director Agent",
                "title": title,
                "platform": platform,
                "video_type": video_type,
            },
        },
    )
    raw = extract_content_text(response.content)

    try:
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0].strip()
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0].strip()
        result = json.loads(raw)
    except Exception:
        result = {
            "directorNotes": raw,
            "error": "Could not parse structured JSON — see directorNotes for raw output",
        }

    return result


# ═══════════════════════════════════════════════════════════════
# AGENT 3: 📋 PRODUCTION PLANNER AGENT
# ═══════════════════════════════════════════════════════════════

PRODUCTION_PLANNER_SYSTEM = """You are a seasoned Film & Video Production Manager with expertise in 
pre-production planning, scheduling, budgeting, and logistics for YouTube, Instagram, and TikTok content.

You create comprehensive production plans covering scenes, timelines, props, equipment, crew, 
and shooting schedules. Your plans are practical, actionable, and optimized for the given platform.
"""

@traceable(
    name="Production Planner Agent",
    run_type="chain",
    metadata={"agent": "Production Planner Agent", "framework": "LangChain"},
)
def run_production_planner_agent(
    script: str,
    platform: str,
    video_type: str,
    tones: list[str],
    target_duration: str,
    title: str,
) -> dict:
    """Production Planner Agent — creates a full production plan with scenes, timeline, props & equipment."""
    llm = get_llm(temperature=0.5)

    prompt = f"""
Create a comprehensive production plan for this video:

Title: {title}
Platform: {platform}
Video Type: {video_type}
Tone(s): {', '.join(tones)}
Target Duration: {target_duration}

SCRIPT:
{script}

Return a JSON object with this structure:
{{
  "summary": {{
    "totalScenes": 5,
    "estimatedShootingTime": "3 hours",
    "complexity": "Simple / Standard / Advanced",
    "recommendedCrew": "Solo / 2-person / Full crew"
  }},
  "scenes": [
    {{
      "sceneNumber": 1,
      "title": "Scene title",
      "duration": "10 sec",
      "durationSeconds": 10,
      "location": "Location name",
      "purpose": "What this scene achieves narratively",
      "dialogue": "Key dialogue or voiceover for this scene",
      "visualDescription": "What the audience sees",
      "lighting": "Lighting setup",
      "props": ["Prop 1", "Prop 2"],
      "broll": ["B-roll idea 1", "B-roll idea 2"]
    }}
  ],
  "timeline": [
    {{
      "timestamp": "00:00",
      "sceneNumber": 1,
      "title": "Scene title",
      "duration": "10 sec"
    }}
  ],
  "propsAndEquipment": [
    {{
      "name": "Item name",
      "category": "Props / Camera Equipment / Lighting / Audio",
      "required": true,
      "notes": "Usage notes"
    }}
  ],
  "shootingSchedule": [
    {{
      "order": 1,
      "scene": 1,
      "reason": "Why shoot in this order",
      "estimatedTime": "30 min"
    }}
  ],
  "productionTips": ["Practical tip 1", "Practical tip 2", "Practical tip 3"],
  "budgetEstimate": {{
    "tier": "Budget / Mid-range / Premium",
    "essentials": "What you absolutely need",
    "optional": "Nice-to-have extras"
  }}
}}
"""

    messages = [
        SystemMessage(content=PRODUCTION_PLANNER_SYSTEM),
        HumanMessage(content=prompt),
    ]

    response = llm.invoke(
        messages,
        config={
            "run_name": "Production Planner Gemini Model Call",
            "metadata": {
                "agent": "Production Planner Agent",
                "title": title,
                "platform": platform,
                "video_type": video_type,
            },
        },
    )
    raw = extract_content_text(response.content)

    try:
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0].strip()
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0].strip()
        result = json.loads(raw)
    except Exception:
        result = {
            "productionTips": [raw],
            "error": "Could not parse structured JSON — see productionTips for raw output",
        }

    return result
