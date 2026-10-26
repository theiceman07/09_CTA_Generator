import pytest
from app.modules.caption_assistant.chains import CaptionGenerationChain
from app.modules.caption_assistant.schemas import CaptionOutput

@pytest.mark.asyncio
async def test_caption_generation_chain_execution():
    """
    Validates that CaptionGenerationChain builds prompt messages,
    executes structured generation conforming to CaptionOutput,
    and returns multi-take caption architecture with reach scores.
    """
    chain = CaptionGenerationChain()
    inputs = {
        "topic": "Autonomous IoT Methane Monitoring System using ESP32 and Edge AI",
        "hook": "Can a $5 microcontroller prevent industrial disaster?",
        "platform": "Instagram",
        "tone": "Engaging",
        "target_audience": "Hardware Hackers & Embedded Devs",
        "content_goal": "Saves",
        "caption_length": "Medium",
        "include_hashtags": True,
        "hashtag_count": 5,
        "include_emojis": True,
        "include_seo_keywords": True,
        "format_type": "Reel",
    }

    system_prompt, human_prompt = chain.build_prompt_messages(inputs)
    assert "copywriter and content strategist" in system_prompt
    assert "Autonomous IoT Methane Monitoring System" in human_prompt
    assert "Can a $5 microcontroller prevent industrial disaster?" in human_prompt

    output, usage = await chain.ainvoke(inputs)
    assert isinstance(output, CaptionOutput)
    assert output.caption
    assert output.hook
    assert output.body
    assert output.call_to_action
    assert len(output.variants) >= 2
    assert all(hasattr(v, "label") and hasattr(v, "reach_score") for v in output.variants)
    assert output.recommend_reason
