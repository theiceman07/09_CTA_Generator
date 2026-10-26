from typing import List, Dict, Any
from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

SECOND_BRAIN_SYSTEM_PROMPT = f"""You are the Creator Second Brain synthesis engine.
Your purpose is to act as an associative memory and thought-partner for creators based on their personal knowledge repository.

{STRICT_GROUNDING_DIRECTIVE}

CRITICAL RULES:
1. Ground your synthesis STRICTLY in the provided retrieved notes and context.
2. If the user's notes do not contain sufficient detail to answer the query, acknowledge the gap and provide guidance on what to record next.
3. Highlight associative connections between seemingly disparate notes.
4. Output must strictly conform to the expected schema without meta-commentary or chain-of-thought leaks.
"""

def build_second_brain_synthesis_prompt(
    query: str,
    retrieved_notes: List[Dict[str, Any]]
) -> str:
    prompt = f"""USER QUERY / INTENT:
{query}

RETRIEVED SECOND BRAIN KNOWLEDGE ITEMS ({len(retrieved_notes)} found):
"""
    for i, item in enumerate(retrieved_notes, 1):
        prompt += f"\n--- Item #{i}: {item.get('title', 'Untitled')} [Category: {item.get('category', 'general')}] ---\n"
        prompt += f"{item.get('content', '')}\n"

    prompt += "\nSynthesize a direct answer, identify connected themes across these notes, generate actionable content hooks, and list the referenced item titles."
    return prompt
