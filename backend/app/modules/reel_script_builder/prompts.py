from typing import Optional
from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE, get_tone_instruction

SYSTEM_REEL_SCRIPT_PROMPT = f"""You are an elite short-form vertical video scriptwriter (Instagram Reels, YouTube Shorts, TikTok).
Your mission is to turn creator ideas, concepts, and technical builds into highly engaging, high-retention short-form video scripts.

{STRICT_GROUNDING_DIRECTIVE}

=== REEL SCRIPT ARCHITECTURE (3-PART STRUCTURE) ===
1. HOOK (0 - 5 s):
   - Scroll-stopping opening line that poses an intriguing question, challenges assumptions, or reveals a high-stakes problem.
   - If the user provides a pre-existing hook (e.g. from a Hook Generator), you MUST preserve and feature it prominently as the opening hook.

2. BODY (5 - 50 s):
   - Rapid-fire value delivery broken down into clear, distinct scenes or beats.
   - Every scene must pair spoken dialogue with visual direction (camera angle, action, B-roll, gesture) and punchy on-screen text.
   - Pacing must feel dynamic: no single visual beat should drag for more than 5-8 seconds.

3. CTA (50 - 60 s):
   - Fast, compelling closing call to action aligned with the creator's goal (e.g. follow, comment, save, share, check link).

=== CRITICAL STATISTIC SAFETY RULE ===
- Strictly NEVER invent fake statistics, synthetic survey percentages, or unverified claims (e.g., do NOT invent '87% of engineers agree' or 'tripled efficiency by 400%').
- If the source context lacks hard numerical metrics, focus entirely on engineering logic, workflow mechanics, and tangible outcomes.

=== FORMATTING & OUTPUT REQUIREMENTS ===
- Return a structured ReelScriptOutput containing:
  - title: A concise headline for the reel.
  - hook: The opening 0-5s attention-grabber.
  - body: The complete body narrative text (5-50s).
  - cta: The closing call to action (50-60s).
  - duration: The target duration (e.g., '30-60s').
  - scenes: A list of 3-5 chronological ReelScene objects with scene_number, timestamp ('0:00 - 0:05', etc.), spoken dialogue, visual_direction, and on_screen_text.
  - caption_suggestion: A ready-to-post caption with relevant hashtags.
  - estimated_word_count: Total spoken word count (target 75-140 words for 30-60s).
  - thoughts: 3-4 agentic planning reflections summarizing topic analysis, pacing decisions, and visual strategy.
"""

def build_reel_script_prompt(
    topic: str,
    hook: Optional[str] = None,
    audience: Optional[str] = None,
    platform: str = "all",
    tone: str = "engaging",
    duration: str = "30-60",
    content_goal: Optional[str] = "educate",
    creator_context: Optional[str] = None,
    project_context: Optional[str] = None,
) -> str:
    tone_desc = get_tone_instruction(tone)

    prompt = f"""Generate a high-retention short-form reel script for the following specifications:

TOPIC / CONCEPT:
{topic}
"""

    if hook and hook.strip():
        prompt += f"""
PRE-EXISTING HOOK (MUST PRESERVE IN OPENING SCENE):
"{hook.strip()}"
"""

    if audience and audience.strip():
        prompt += f"""
TARGET AUDIENCE:
{audience.strip()}
"""

    prompt += f"""
TARGET PLATFORM: {platform.upper()}
TONE PROFILE: {tone.capitalize()} ({tone_desc})
TARGET DURATION: {duration} seconds
CONTENT GOAL: {content_goal.capitalize()}
"""

    if creator_context and creator_context.strip():
        prompt += f"""
CREATOR / CHANNEL CONTEXT:
{creator_context.strip()}
"""

    if project_context and project_context.strip():
        prompt += f"""
PROJECT CONTEXT / BUILD NOTES:
{project_context.strip()}
"""

    prompt += """
REQUIREMENTS:
1. Ensure the opening scene (0-5s) delivers an irresistible hook. If a pre-existing hook was provided, preserve it verbatim or build directly upon it.
2. Structure the body into 3-5 vivid scenes with actionable visual direction, spoken dialogue, and punchy on-screen text.
3. Conclude with a strong, natural call to action.
4. Keep the spoken word count calibrated to natural speaking speed (approx 130-150 words/min).
5. Ground every single claim in the provided topic. Do not invent fake statistics or off-topic advice.
"""

    return prompt
