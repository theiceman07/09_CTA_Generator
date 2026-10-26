from typing import Optional
from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE, get_tone_instruction

SYSTEM_CAPTION_PROMPT = f"""You are an elite social media copywriter and content strategist specializing in high-engagement, algorithm-optimized captions across Instagram, LinkedIn, X, TikTok, and YouTube.
Your mission is to turn creator ideas, project summaries, and technical builds into high-retention, publish-ready captions with compelling hooks and natural engagement drivers.

{STRICT_GROUNDING_DIRECTIVE}

=== CRITICAL STATISTIC SAFETY RULE ===
- Strictly NEVER invent fake statistics, synthetic survey percentages, benchmark test results, or unverified claims (e.g., do NOT invent 'boosts accuracy by 92%' or 'reduces methane emissions by 40%').
- If the source context lacks hard numerical metrics, use safe phrasing such as:
  "designed to", "aims to", "helps monitor", "explores", "built for", "can be used to".
- Never turn an exploratory project description into an unsubstantiated performance claim.

=== 2026 ALGORITHM & COPYWRITING ARCHITECTURE ===
1. HOOK (Line 1):
   - Scroll-stopping opening line under 125 characters. Never a dry description of what the post shows.
   - Poses an intriguing question, challenges assumptions, or reveals a high-stakes problem.
   - If the user supplies a pre-existing hook (e.g. from Hook Generator), preserve and feature it prominently.
2. BODY:
   - Deliver clear, focused value. One main idea per caption. Write naturally with clean line breaks.
   - Weave 1-2 plain search keywords naturally into the hook or first sentence for caption SEO.
   - Keep emojis tasteful and calibrated to the platform and tone.
3. CALL TO ACTION (CTA):
   - End with exactly ONE specific CTA aligned with the content goal (e.g. a direct question, bookmark/save prompt, comment trigger).
   - A specific question beats generic "thoughts?".
4. HASHTAGS:
   - Provide 3-5 grounded, topic-relevant hashtags without the '#' symbol.
   - Never generate unrelated trending hashtags.

=== MULTI-VARIANT REQUIREMENTS ===
Generate 3-4 distinct creative caption variants differing in angle and narrative approach (e.g. Take 1: Story-Led, Take 2: Direct & Punchy, Take 3: Educational Breakdown, Take 4: Behind-The-Scenes).
For each variant:
- label: Descriptive name for the angle.
- hook: Line 1 hook under 125 characters.
- body: Main narrative text.
- cta: Aligned call to action.
- hashtags: List of clean hashtags (strings without '#').
- keywords: 1-2 SEO keywords included.
- reach_score: Algorithm reach index (0-100) assessing hook strength, keyword presence, and share/save triggers.
- why: One-sentence copywriting rationale explaining why this take works.
- extra: Platform-specific advice (e.g. Reel on-screen text hook, Carousel slide-1 title, or posting tip).

Pick the ONE variant most likely to achieve the creator's goal as the recommended take (`recommended_variant_index`), and provide a clear one-sentence `recommend_reason`.
Populate the top-level `caption` with the complete, formatted publishable text of the recommended take.
"""

def build_caption_prompt(
    topic: str,
    platform: str = "Instagram",
    tone: str = "Engaging",
    target_audience: Optional[str] = "General Audience",
    content_goal: Optional[str] = "Engagement",
    caption_length: str = "Medium",
    hook: Optional[str] = None,
    cta: Optional[str] = None,
    include_hashtags: bool = True,
    hashtag_count: int = 5,
    include_emojis: bool = True,
    include_seo_keywords: bool = True,
    format_type: Optional[str] = "Photo post",
    creator_context: Optional[str] = None,
    project_context: Optional[str] = None,
) -> str:
    tone_desc = get_tone_instruction(tone)

    length_guidelines = {
        "short": "Short (1-2 punchy sentences, under 200 characters total)",
        "medium": "Medium (2-4 clear paragraphs with line breaks, 300-500 characters)",
        "long": "Long (detailed storytelling/educational breakdown, 700-1000 characters)"
    }
    length_str = length_guidelines.get(caption_length.lower(), f"{caption_length} length")

    prompt = f"""Generate high-performing captions for the following specifications:

TOPIC / CONTENT DESCRIPTION:
{topic}
"""

    if hook and hook.strip():
        prompt += f"""
PRE-EXISTING HOOK (MUST PRESERVE IN OPENING LINE):
"{hook.strip()}"
"""

    if cta and cta.strip():
        prompt += f"""
CUSTOM CALL TO ACTION (MUST INCORPORATE):
"{cta.strip()}"
"""

    prompt += f"""
TARGET PLATFORM: {platform.upper()}
POST FORMAT: {format_type or 'Post'}
TONE PROFILE: {tone.capitalize()} ({tone_desc})
TARGET AUDIENCE: {target_audience or 'General Audience'}
CONTENT GOAL: {content_goal or 'Engagement'}
TARGET LENGTH: {length_str}
"""

    if creator_context and creator_context.strip():
        prompt += f"""
CREATOR / CHANNEL CONTEXT:
{creator_context.strip()}
"""

    if project_context and project_context.strip():
        prompt += f"""
PROJECT CONTEXT / BUILD DETAILS:
{project_context.strip()}
"""

    emoji_instruction = "Use emojis sparingly and tastefully (max 2-3)." if include_emojis else "Do not use emojis."
    hashtag_instruction = f"Generate {hashtag_count} relevant hashtags (without '#' symbol)." if include_hashtags and hashtag_count > 0 else "Do not include hashtags (empty list)."
    seo_instruction = "Weave 1-2 SEO keywords naturally into the hook or first line." if include_seo_keywords else "Focus on conversational flow without forced SEO keywords."

    prompt += f"""
CONSTRAINTS & RULES:
1. Ground every statement strictly in the topic provided. Do not invent fake statistics, benchmarks, or test results.
2. {emoji_instruction}
3. {hashtag_instruction}
4. {seo_instruction}
5. Line 1 must be a captivating hook under 125 characters.
6. Provide 3-4 distinct takes differing in angle and structure.
7. Designate the best take as recommended with a clear one-sentence rationale.
"""

    return prompt
