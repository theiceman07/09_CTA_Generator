import pytest
from app.core.config import settings
from app.modules.content_idea_generator.chains import IdeaGenerationChain
from app.modules.content_idea_generator.schemas import IdeaListOutput

@pytest.mark.asyncio
async def test_idea_generation_chain_execution():
    """
    Direct unit test for IdeaGenerationChain prompt assembly and execution.
    """
    chain = IdeaGenerationChain()
    system_prompt, human_prompt = chain.build_prompt_messages({
        "topic": "Autonomous Agent Workflows with LangChain",
        "niche": "Artificial Intelligence",
        "target_audience": "Senior Software Engineers",
        "content_goal": "Authority",
        "platform": "youtube",
        "tone": "educational",
        "number_of_ideas": 3,
    })

    assert "Autonomous Agent Workflows with LangChain" in human_prompt
    assert "Artificial Intelligence" in human_prompt
    assert "YOUTUBE" in human_prompt
    assert len(system_prompt) > 0

    # Execute chain
    output, usage = await chain.ainvoke({
        "topic": "Autonomous Agent Workflows with LangChain",
        "niche": "Artificial Intelligence",
        "target_audience": "Senior Software Engineers",
        "content_goal": "Authority",
        "platform": "youtube",
        "tone": "educational",
        "number_of_ideas": 3,
    })

    assert isinstance(output, IdeaListOutput)
    assert len(output.ideas) >= 1
    assert output.ideas[0].title is not None
    assert output.ideas[0].hook is not None
