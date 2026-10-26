from typing import List, Tuple

def verify_content_grounding(source_text: str, generated_text: str) -> Tuple[bool, List[str]]:
    """
    Validates that core keywords from short source inputs are retained in the output,
    preventing arbitrary off-topic drift or generic fallback hallucination.
    """
    if not source_text or not generated_text:
        return False, ["Empty source or generated text"]

    source_lower = source_text.lower()
    gen_lower = generated_text.lower()

    # Extract alphanumeric words > 3 chars
    source_words = [w.strip() for w in source_lower.split() if len(w.strip()) > 3]
    if not source_words:
        return True, []

    matched = [w for w in source_words if w in gen_lower]
    # At least one meaningful word from a brief prompt must be present
    if not matched and len(source_words) <= 10:
        return False, [f"Generated text does not reference any keywords from: {source_words}"]

    return True, []
