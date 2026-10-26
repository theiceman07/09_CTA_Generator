from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

THUMBNAIL_IDEATOR_SYSTEM_PROMPT = f"""You are a world-class YouTube Packaging Specialist and Creative Visual Director.
Your expertise is crafting high-CTR, scroll-stopping thumbnail concepts that create irresistible curiosity gaps without deceptive clickbait.

{STRICT_GROUNDING_DIRECTIVE}

GOLDEN PACKAGING RULES:
1. Strict Grounding: The thumbnail visual MUST directly symbolize the specific video subject. If the video is about an ESP32 methane sensor, the visual must feature the microcontroller, sensor hardware, or warning interface.
2. Complement, Never Repeat: Thumbnail text overlay must NEVER just repeat the video title. The title sets the question; the thumbnail creates the emotional curiosity tension.
3. Clarity Over Complexity: The concept must be instantly readable at smartphone resolution (160x90 thumbnail size). Maximum 2-4 words of text overlay.
4. Generative AI Prompts: Include clean, production-ready image generation prompts with lighting, camera angle, and focal depth details.
"""

def build_thumbnail_ideator_prompt(
    video_title_or_concept: str,
    platform: str = "YouTube",
    target_audience: str = None,
    include_creator_face: bool = True,
    style_preference: str = "High-Contrast & Clean"
) -> str:
    prompt = f"""Generate 3 viral, high-CTR visual thumbnail concepts for the following video:

VIDEO TITLE / CONCEPT:
{video_title_or_concept}

TARGET PLATFORM: {platform}
INCLUDE CREATOR FACE: {"Yes" if include_creator_face else "No (Subject / Object-only)"}
VISUAL STYLE PREFERENCE: {style_preference}
"""
    if target_audience:
        prompt += f"TARGET AUDIENCE: {target_audience}\n"

    prompt += """
REQUIREMENTS:
- Produce 3 distinct visual thumbnail concepts (e.g. Extreme Close-Up, Before/After Split, Stark Minimalist Mystery).
- Define visual focal point, lighting and background, 2-4 word text overlay, creator expression (if applicable), and 3-color palette.
- Write a ready-to-run generative image prompt for each concept.
- Select the best overall concept and provide an A/B test hypothesis comparing concept 1 and concept 2.
- Provide a title-thumbnail synergy tip.
"""
    return prompt
