import pytest
from app.modules.reel_script_builder.chains import ReelScriptGenerationChain
from app.modules.reel_script_builder.schemas import ReelScriptOutput

@pytest.mark.asyncio
async def test_reel_script_generation_chain_execution():
    """
    Validates that ReelScriptGenerationChain builds prompt messages,
    executes structured generation conforming to ReelScriptOutput,
    and returns 3-part script architecture with scene breakdowns.
    """
    chain = ReelScriptGenerationChain()
    inputs = {
        "topic": "Autonomous IoT Methane Monitoring System using ESP32",
        "hook": "Can a $5 microcontroller really detect industrial methane leaks?",
        "audience": "Embedded Engineers",
        "platform": "instagram",
        "tone": "engaging",
        "duration": "30-60",
        "content_goal": "educate"
    }

    system_prompt, human_prompt = chain.build_prompt_messages(inputs)
    assert "short-form vertical video" in system_prompt
    assert "Methane Monitoring System" in human_prompt
    assert "Can a $5 microcontroller" in human_prompt

    output, usage = await chain.ainvoke(inputs)
    assert isinstance(output, ReelScriptOutput)
    assert output.title
    assert output.hook
    assert output.body
    assert output.cta
    assert len(output.scenes) >= 3
    assert all(hasattr(s, "visual_direction") and hasattr(s, "dialogue") for s in output.scenes)
