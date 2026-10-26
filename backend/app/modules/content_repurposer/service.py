import asyncio
import json
import time
from typing import Dict, Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.core.config import settings
from app.db.models.project import Project
from app.db.models.asset import Asset
from app.db.models.generation import AIGeneration
from app.db.models.usage import UsageRecord
from app.ai.gateway import model_gateway
from app.ai.schemas import ContentAnalysis, YouTubeOutput
from app.modules.content_repurposer.schemas import ContentRepurposerRequest, ContentRepurposerResponse
from app.core.logging import logger

class ContentRepurposerService:
    @staticmethod
    async def generate(
        db: AsyncSession,
        user_id: str,
        request: ContentRepurposerRequest
    ) -> ContentRepurposerResponse:
        start_time = time.time()
        
        # 1. Validate project ownership
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        content = request.content.strip()
        tone = request.tone
        selected_platforms = request.platforms

        # 2. Stage 1: Content Analysis (Run once)
        analysis_prompt = (
            f"Analyze the following source content faithfully. Extract the specific topic, core message, "
            f"and key points directly and exclusively from what the user wrote.\n\n"
            f"CRITICAL GROUNDING RULES:\n"
            f"- The topic MUST be directly about the actual subject described (e.g. if the user says 'i built an methane monitoring system using esp 32', the topic is 'Methane Monitoring System using ESP32').\n"
            f"- Do NOT fabricate metrics, sensors, results, field deployments, or claims not mentioned in the source.\n"
            f"- Do NOT turn the topic into generic content strategy, social media workflows, or marketing advice unless the user's content is literally about that.\n\n"
            f"Tone requested: {tone.capitalize()}\n\n"
            f"Source Content:\n{content}"
        )
        system_analysis = (
            "You are an objective content analysis engine. Extract accurate, grounded topics and insights "
            "strictly faithful to the user's provided input without fabricating claims or substituting the subject."
        )

        analysis_res = await model_gateway.generate_structured(
            prompt=analysis_prompt,
            schema=ContentAnalysis,
            system_prompt=system_analysis
        )
        
        analysis_data = analysis_res.structured_data or {}
        topic = analysis_data.get("topic") or content[:60]
        key_points = analysis_data.get("key_points") or [content]
        core_message = analysis_data.get("core_message") or content
        target_audience = analysis_data.get("target_audience", "Technical professionals and enthusiasts")

        # Shared grounding block for all platform copy
        grounding_rules = (
            f"STRICT GROUNDING REQUIREMENTS:\n"
            f"- The output MUST be strictly and directly about: {topic}\n"
            f"- Source Content provided by creator:\n\"{content}\"\n"
            f"- Use ONLY information directly supported by the source content and analysis.\n"
            f"- Do NOT invent test results, field statistics, unmentioned hardware/sensors, or claims.\n"
            f"- Do NOT replace the user's specific subject with generic advice about content creation, marketing, workflows, or audience growth.\n"
            f"- Preserve the technical and thematic focus of the original source."
        )

        # 3. Stage 2: Parallel Platform Generation (Only for selected platforms)
        tasks = []
        platform_keys = []

        if "linkedin" in selected_platforms:
            linkedin_prompt = (
                f"You are an expert LinkedIn copywriter.\n"
                f"Write an engaging, high-retention LinkedIn post directly discussing the following project/topic:\n\n"
                f"{grounding_rules}\n\n"
                f"Topic: {topic}\n"
                f"Core Message: {core_message}\n"
                f"Key Takeaways:\n" + "\n".join(f"- {kp}" for kp in key_points) + "\n"
                f"Tone: {tone.capitalize()}\n"
                f"Target Audience: {target_audience}\n\n"
                f"Guidelines:\n"
                f"- Start with a compelling 1-line hook directly about {topic}.\n"
                f"- Use short, punchy paragraphs and 1-2 line spacing for readability.\n"
                f"- Share the technical or practical story faithfully based on the source content.\n"
                f"- End with a relevant discussion question about the project.\n"
                f"- Add 3-5 relevant hashtags tailored specifically to this topic at the bottom."
            )
            tasks.append(model_gateway.generate(prompt=linkedin_prompt))
            platform_keys.append("linkedin")

        if "instagram" in selected_platforms:
            instagram_prompt = (
                f"You are a visual storytelling expert creating an Instagram carousel slide deck.\n"
                f"Create a slide-by-slide carousel outline and caption directly discussing this build/topic:\n\n"
                f"{grounding_rules}\n\n"
                f"Topic: {topic}\n"
                f"Core Message: {core_message}\n"
                f"Key Points:\n" + "\n".join(f"- {kp}" for kp in key_points) + "\n"
                f"Tone: {tone.capitalize()}\n\n"
                f"Format Requirements:\n"
                f"- Slide 1: Bold headline / hook specifically about {topic}.\n"
                f"- Slides 2-5: One clear visual takeaway per slide explaining the project.\n"
                f"- Final Slide: Summary & CTA (Save, share, follow).\n"
                f"- Caption: 2-3 short sentences summarizing the project with relevant hashtags."
            )
            tasks.append(model_gateway.generate(prompt=instagram_prompt))
            platform_keys.append("instagram")

        if "x" in selected_platforms:
            x_prompt = (
                f"You are a viral X (Twitter) ghostwriter.\n"
                f"Write a high-impact, value-packed X thread directly breaking down this project/topic:\n\n"
                f"{grounding_rules}\n\n"
                f"Topic: {topic}\n"
                f"Core Message: {core_message}\n"
                f"Key Points:\n" + "\n".join(f"- {kp}" for kp in key_points) + "\n"
                f"Tone: {tone.capitalize()}\n\n"
                f"Format Requirements:\n"
                f"- Tweet 1 (Hook): Scroll-stopping hook that directly mentions {topic}. No hashtags.\n"
                f"- Tweets 2-5: Each tweet must deliver a single punchy technical insight from the source.\n"
                f"- Final Tweet: Conclusion + CTA (Follow, Retweet).\n"
                f"- Separate tweets clearly with '---' or '1/', '2/', etc."
            )
            tasks.append(model_gateway.generate(prompt=x_prompt))
            platform_keys.append("x")

        if "youtube" in selected_platforms:
            youtube_prompt = (
                f"You are a YouTube growth and content strategist.\n"
                f"Create a complete YouTube video package for a video strictly about:\n\n"
                f"{grounding_rules}\n\n"
                f"Topic: {topic}\n"
                f"Core Message: {core_message}\n"
                f"Key Points:\n" + "\n".join(f"- {kp}" for kp in key_points) + "\n"
                f"Tone: {tone.capitalize()}\n"
                f"Target Audience: {target_audience}\n\n"
                f"Return structured fields: title, description, tags, outline."
            )
            tasks.append(model_gateway.generate_structured(prompt=youtube_prompt, schema=YouTubeOutput))
            platform_keys.append("youtube")

        # Execute selected platform generations in parallel
        platform_responses = await asyncio.gather(*tasks)

        # Assemble results
        results = {}
        total_input_tokens = analysis_res.usage.input_tokens or 0
        total_output_tokens = analysis_res.usage.output_tokens or 0

        for key, resp in zip(platform_keys, platform_responses):
            if key == "youtube":
                yt_data = resp.structured_data or {
                    "title": f"The Ultimate Guide to {topic}",
                    "description": core_message,
                    "tags": ["content", "strategy", "creator"],
                    "outline": "\n".join(key_points)
                }
                results["youtube"] = yt_data
            else:
                results[key] = resp.raw_content.strip()

            if resp.usage.input_tokens:
                total_input_tokens += resp.usage.input_tokens
            if resp.usage.output_tokens:
                total_output_tokens += resp.usage.output_tokens

        total_latency = int((time.time() - start_time) * 1000)

        # 4. Save AIGeneration Record
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="content-repurposer",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "content_preview": content[:200],
                "platforms": selected_platforms,
                "tone": tone
            },
            output_data=results,
            input_tokens=total_input_tokens if total_input_tokens > 0 else None,
            output_tokens=total_output_tokens if total_output_tokens > 0 else None,
            total_tokens=(total_input_tokens + total_output_tokens) if (total_input_tokens + total_output_tokens) > 0 else None,
            latency_ms=total_latency,
            status="completed"
        )
        db.add(generation)
        await db.flush()  # Populates generation.id

        # 5. Save generated platform outputs as Project Assets
        for p_name, p_content in results.items():
            content_str = json.dumps(p_content, indent=2) if isinstance(p_content, dict) else str(p_content)
            title_str = f"{project.name} - {p_name.capitalize()} Post"
            if p_name == "youtube" and isinstance(p_content, dict):
                title_str = p_content.get("title") or title_str

            asset = Asset(
                project_id=project.id,
                user_id=user_id,
                type=p_name,
                title=title_str,
                content=content_str,
                meta_info={
                    "platform": p_name,
                    "tone": tone,
                    "generation_id": str(generation.id),
                    "created_via": "content-repurposer"
                }
            )
            db.add(asset)

        # 6. Save UsageRecord
        usage_rec = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="content-repurposer",
            provider=generation.provider,
            model=generation.model,
            input_tokens=generation.input_tokens,
            output_tokens=generation.output_tokens,
            total_tokens=generation.total_tokens
        )
        db.add(usage_rec)
        await db.commit()

        return ContentRepurposerResponse(
            generation_id=str(generation.id),
            project_id=str(project.id),
            results=results,
            usage={
                "input_tokens": generation.input_tokens,
                "output_tokens": generation.output_tokens,
                "total_tokens": generation.total_tokens,
                "latency_ms": total_latency
            },
            analysis=analysis_data
        )
