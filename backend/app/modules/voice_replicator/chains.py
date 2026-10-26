from app.ai.gemini.service import gemini_service
from app.modules.voice_replicator.schemas import (
    VoiceReplicatorRequest,
    VoiceReplicatorLLMOutput,
)
from app.modules.voice_replicator.prompts import (
    VOICE_REPLICATOR_SYSTEM_PROMPT,
    build_voice_replication_prompt,
)
from app.core.logging import logger

class VoiceReplicationChain:
    """
    LangChain execution chain for creator stylistic voice replication.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: VoiceReplicatorRequest) -> VoiceReplicatorLLMOutput:
        prompt = build_voice_replication_prompt(
            sample_writings=request.sample_writings,
            topic=request.topic,
            platform=request.platform,
            tone=request.tone,
            target_audience=request.target_audience,
        )

        logger.info(f"Executing VoiceReplicationChain for topic={request.topic} platform={request.platform}")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=VoiceReplicatorLLMOutput,
            system_prompt=VOICE_REPLICATOR_SYSTEM_PROMPT,
            temperature=0.5
        )

        if resp.structured_data:
            return VoiceReplicatorLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Voice Replicator")

voice_replication_chain = VoiceReplicationChain()
