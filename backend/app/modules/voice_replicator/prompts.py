from typing import Optional
from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

VOICE_REPLICATOR_SYSTEM_PROMPT = f"""You are the Voice Replicator Engine.
Your mission is to perform stylistic analysis on author writing samples and generate new content on a specified topic that impeccably mirrors the author's stylistic cadences, rhetorical structure, and tone.

{STRICT_GROUNDING_DIRECTIVE}

ETHICAL AND BOUNDARY RULES:
1. This is STYLE REPLICATION (linguistic syntax, rhythm, structure, and tone patterns), NOT biometric voice cloning or identity impersonation.
2. Ground all claims strictly in the provided sample writings and topic. Do not invent fake autobiographical facts.
3. Provide a structured style profile, drafted content, style alignment score, and reusable guidelines.
4. Output must strictly conform to the expected schema without meta-commentary or chain-of-thought leaks.
"""

def build_voice_replication_prompt(
    sample_writings: str,
    topic: str,
    platform: Optional[str] = "LinkedIn",
    tone: Optional[str] = "Authoritative",
    target_audience: Optional[str] = None,
) -> str:
    prompt = f"""AUTHOR SAMPLE WRITINGS (Analyze linguistic syntax, vocabulary, pacing, and tone signature):
\"\"\"
{sample_writings}
\"\"\"

NEW TOPIC TO WRITE IN THIS VOICE:
{topic}

TARGET PLATFORM: {platform}
DESIRED TONE NUANCE: {tone}
"""
    if target_audience:
        prompt += f"TARGET AUDIENCE: {target_audience}\n"

    prompt += "\nExtract the author's style profile, generate a complete content piece on the topic matching their voice, compute an alignment score, and output reusable voice guidelines."
    return prompt
