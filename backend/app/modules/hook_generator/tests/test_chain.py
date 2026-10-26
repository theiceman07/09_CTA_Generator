import pytest
from app.modules.hook_generator.chains import HookGenerationChain
from app.modules.hook_generator.schemas import HookListOutput

@pytest.mark.asyncio
async def test_hook_generation_chain_execution():
    """
    Direct unit test for HookGenerationChain prompt assembly and LangChain execution.
    """
    chain = HookGenerationChain()
    system_prompt, human_prompt = chain.build_prompt_messages({
        "topic": "Autonomous IoT Methane Monitoring System using ESP32",
        "audience": "Makers and Embedded Engineers",
        "platform": "youtube",
        "tone": "bold",
        "hook_style": "all",
        "number_of_hooks": 10,
    })

    assert "Autonomous IoT Methane Monitoring System using ESP32" in human_prompt
    assert "YOUTUBE" in human_prompt
    assert "Curiosity" in human_prompt
    assert "Contrarian" in human_prompt
    assert len(system_prompt) > 0

    # Execute chain
    output, usage = await chain.ainvoke({
        "topic": "Autonomous IoT Methane Monitoring System using ESP32",
        "audience": "Makers and Embedded Engineers",
        "platform": "youtube",
        "tone": "bold",
        "hook_style": "all",
        "number_of_hooks": 10,
    })

    assert isinstance(output, HookListOutput)
    assert len(output.hooks) >= 1
    assert output.hooks[0].hook is not None
    assert output.hooks[0].style is not None
