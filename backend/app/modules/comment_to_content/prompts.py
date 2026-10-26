from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

COMMENT_TO_CONTENT_SYSTEM_PROMPT = f"""You are an expert Social Media Strategist and Creator Coach specializing in community-led content loops.
Your job is to transform audience questions, confusion, or viral comments into compelling, high-converting standalone content pieces (Reels, Carousels, Threads, Posts).

{STRICT_GROUNDING_DIRECTIVE}

GUIDELINES:
1. Grounding: Every content idea must address the substance of the comment directly. If a commenter asks about sensor calibration on ESP32, produce content specifically on sensor calibration for ESP32.
2. Hook Dynamics: Use native reply-style hooks (e.g. "Someone commented asking why ESP32 is better than Arduino for methane detection... here is the real answer", "Replying to @user: Here's the step everyone misses").
3. Content Value: Provide complete, actionable talking points, clear captions, and engaging CTAs.
"""

def build_comment_to_content_prompt(
    comment: str,
    additional_comments: list[str] = None,
    platform: str = "Instagram",
    format_type: str = "Short-form Video",
    tone: str = "Educational",
    creator_context: str = None
) -> str:
    prompt = f"""Transform the following audience comment into structured follow-up content concepts.

TARGET COMMENT TO ANSWER:
"{comment}"
"""
    if additional_comments:
        prompt += "\nSUPPORTING AUDIENCE COMMENTS:\n" + "\n".join([f"- {c}" for c in additional_comments]) + "\n"
    if creator_context:
        prompt += f"\nCREATOR / NICHE CONTEXT:\n{creator_context}\n"

    prompt += f"""
TARGET PLATFORM: {platform}
PREFERRED FORMAT: {format_type}
TONE: {tone}

REQUIREMENTS:
- Generate 3 distinct content ideas/angles answering or expanding upon this comment.
- Provide a viral reply hook, step-by-step key talking points, a ready-to-publish draft caption, and a closing CTA for each.
- Select the best overall recommended idea and summarize the strategic reason.
"""
    return prompt
