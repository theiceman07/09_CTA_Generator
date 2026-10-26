import time
from typing import Dict, Any, Type, Optional, List, Tuple
from pydantic import BaseModel
from app.ai.providers.base import BaseAIProvider
from app.ai.schemas import ModelResponse, ModelUsageMetadata, ContentAnalysis, YouTubeOutput

def extract_subject(prompt: str) -> Tuple[str, List[str]]:
    p_lower = prompt.lower()
    if "methane" in p_lower:
        topic = "Methane Monitoring System using ESP32"
        points = [
            "Built a dedicated methane monitoring system centered around the ESP32 microcontroller",
            "Integrates gas sensing hardware to detect and track methane concentration levels",
            "Leverages the ESP32 for processing, alerting, and wireless telemetry"
        ]
    elif "raspberry pi" in p_lower or "fusion" in p_lower:
        topic = "Raspberry Pi Camera Enclosure in Fusion 360"
        points = [
            "Designed a custom enclosure modeled directly inside Fusion 360",
            "Tailored dimensions to secure and protect the Raspberry Pi camera module",
            "Engineered for functional 3D printing and clean hardware mounting"
        ]
    elif "modular monolith" in p_lower:
        topic = "Modular Monolith Architecture for AI SaaS"
        points = [
            "Strict domain boundaries eliminate unnecessary distributed networking friction",
            "Streamlines developer productivity and simplifies deployment cycles",
            "Preserves reliable data transactions without complex event buses"
        ]
    elif "TOPIC / CONTENT DESCRIPTION:" in prompt:
        topic_part = prompt.split("TOPIC / CONTENT DESCRIPTION:")[1].strip().split("\n")[0].strip()
        topic = topic_part[:60]
        points = [f"Key implementation of {topic}", f"Technical details of {topic}"]
    elif "TOPIC / CONCEPT:" in prompt:
        topic_part = prompt.split("TOPIC / CONCEPT:")[1].strip().split("\n")[0].strip()
        topic = topic_part[:60]
        points = [f"Key implementation of {topic}", f"Technical details of {topic}"]
    else:
        # Fallback: extract topic directly from prompt text
        topic = "Creator Innovation Project"
        for line in prompt.split("\n"):
            line_str = line.strip()
            if line_str and not line_str.startswith(("You are", "Write", "Guidelines", "Format", "GROUNDING", "Tone", "Target", "Generate")):
                topic = line_str.replace("Source Content:", "").replace("Topic:", "").strip()[:60]
                break
        points = [
            f"Focused implementation based on {topic}",
            f"Key technical and creative decisions for {topic}"
        ]
    return topic, points

class MockAIProvider(BaseAIProvider):
    def __init__(self, model_name: str = "mock-model", api_key: Optional[str] = None):
        super().__init__(model_name=model_name, api_key=api_key or "mock-key")

    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> ModelResponse:
        start_time = time.time()
        time.sleep(0.02)  # Simulate small async delay
        
        topic, points = extract_subject(prompt)

        p_lower = prompt.lower()
        if "instagram" in p_lower:
            content = (
                f"Slide 1: How I Built a {topic} 🛠️\n"
                f"Slide 2: The Core Architecture: {points[0]}\n"
                f"Slide 3: Implementation Details: {points[1]}\n"
                f"Slide 4: Key Insights: {points[2] if len(points) > 2 else points[0]}\n"
                f"Slide 5: What's next for this build? Save & share!\n\n"
                f"Caption: An inside look at building a {topic}. What would you add to this setup? #{topic.replace(' ', '')} #BuildInPublic"
            )
        elif "twitter" in p_lower or "viral x" in p_lower or "x thread" in p_lower:
            content = (
                f"1/ I recently built a {topic}. Here is a quick breakdown of how it works:\n\n"
                f"2/ {points[0]}\n\n"
                f"3/ {points[1]}\n\n"
                f"4/ {points[2] if len(points) > 2 else 'Built to be reliable, modular, and easy to reproduce.'}\n\n"
                f"5/ Follow for more technical project breakdowns and hardware builds."
            )
        else:
            # Default to LinkedIn format
            content = (
                f"I recently built a {topic}.\n\n"
                f"Here are the core engineering details behind the build:\n\n"
                + "\n\n".join(f"• {p}" for p in points) + "\n\n"
                f"Excited to continue iterating on this project. Have you worked with similar setups?\n\n"
                f"#{topic.split()[0]} #Engineering #Hardware #Innovation"
            )
        
        return ModelResponse(
            raw_content=content,
            structured_data=None,
            usage=ModelUsageMetadata(
                input_tokens=150,
                output_tokens=75,
                total_tokens=225,
                latency_ms=int((time.time() - start_time) * 1000)
            ),
            provider="mock",
            model=self.model_name
        )

    async def generate_structured(
        self,
        prompt: str,
        schema: Type[BaseModel],
        system_prompt: Optional[str] = None
    ) -> ModelResponse:
        start_time = time.time()
        time.sleep(0.02)
        
        topic, points = extract_subject(prompt)
        schema_name = getattr(schema, "__name__", str(schema))

        if schema == ContentAnalysis or schema_name == "ContentAnalysis":
            mock_data = ContentAnalysis(
                topic=topic,
                target_audience="Engineers, Makers, and Creators",
                content_type="Technical Project",
                key_points=points,
                core_message=f"Building and deploying a {topic}."
            ).model_dump()
        elif schema == YouTubeOutput:
            mock_data = YouTubeOutput(
                title=f"Building a {topic} (Full Build Breakdown)",
                description=f"In this video, I walk through the full process of building a {topic}.\n\nKey aspects covered:\n" + "\n".join(f"- {p}" for p in points),
                tags=[w.lower() for w in topic.split() if len(w) > 2][:6],
                outline=f"00:00 - Project Overview\n01:15 - Architecture & Components\n03:30 - Assembly & Testing\n05:45 - Final Demo & Takeaways"
            ).model_dump()
        elif getattr(schema, "__name__", "") == "IdeaListOutput":
            mock_ideas = [
                {
                    "title": f"The Blueprint for Building a {topic}",
                    "idea": f"A comprehensive look at developing and optimizing a {topic}.",
                    "hook": f"Most creators struggle with {topic} until they realize this one key principle.",
                    "description": f"Deep dive into the architecture and execution of {points[0] if points else topic}.",
                    "target_audience": "Engineers, builders, and technical creators",
                    "platform": "YouTube",
                    "rationale": "Strong hook creates an irresistible curiosity gap while technical grounding builds lasting credibility."
                },
                {
                    "title": f"5 Lessons Learned From Developing {topic}",
                    "idea": f"Case study sharing key takeaways from working on {topic}.",
                    "hook": f"I spent weeks building {topic} so you don't make the same mistakes.",
                    "description": f"Actionable breakdown detailing {points[1] if len(points) > 1 else topic}.",
                    "target_audience": "Innovators and technical professionals",
                    "platform": "LinkedIn",
                    "rationale": "First-person case studies consistently outperform generic advice on professional feeds."
                },
                {
                    "title": f"The Ultimate Checklist for {topic}",
                    "idea": f"Actionable, beginner-to-advanced checklist for {topic}.",
                    "hook": f"Thinking about building a {topic}? Save this 5-point checklist before starting.",
                    "description": f"Quick, punchy breakdown covering {points[0] if points else topic}.",
                    "target_audience": "Tech enthusiasts and creators",
                    "platform": "X",
                    "rationale": "Checklists generate high bookmark and retweet velocity due to high perceived utility."
                }
            ]
            mock_data = {
                "ideas": mock_ideas,
                "summary": f"Strategic high-engagement concepts centered on {topic}."
            }
        elif getattr(schema, "__name__", "") == "HookListOutput":
            mock_hooks = [
                {
                    "id": 1,
                    "style": "Curiosity",
                    "hook": f"There is an unspoken engineering secret about {topic} that changes everything.",
                    "platform": "YouTube",
                    "rationale": "High curiosity gap triggers immediate interest and prevents early scroll-away."
                },
                {
                    "id": 2,
                    "style": "Question",
                    "hook": f"Are you still trying to deploy {topic} without real-time edge processing?",
                    "platform": "LinkedIn",
                    "rationale": "Provocative open question engages self-reflection among target practitioners."
                },
                {
                    "id": 3,
                    "style": "Contrarian",
                    "hook": f"Most engineers overcomplicate {topic}. Here is why simple edge nodes beat complex cloud stacks.",
                    "platform": "X/Twitter",
                    "rationale": "Attacking conventional wisdom generates high comment debate and algorithmic reach."
                },
                {
                    "id": 4,
                    "style": "Bold Claim",
                    "hook": f"Building an autonomous {topic} is the best way to master modern IoT architecture.",
                    "platform": "LinkedIn",
                    "rationale": "Authoritative assertion creates an immediate anchor for thought leadership."
                },
                {
                    "id": 5,
                    "style": "Statistic/Data",
                    "hook": f"The telemetry data behind {topic} reveals how dramatically sensor drift impacts field reliability.",
                    "platform": "LinkedIn",
                    "rationale": "Data-oriented framing demonstrates technical rigor without inventing fake statistics."
                },
                {
                    "id": 6,
                    "style": "Story",
                    "hook": f"I deployed my prototype {topic} into the field, and within 48 hours everything failed.",
                    "platform": "Instagram",
                    "rationale": "Vulnerable narrative opening draws readers into the post-mortem journey."
                },
                {
                    "id": 7,
                    "style": "Problem/Pain Point",
                    "hook": f"The hardest challenge when building a {topic} is sensor calibration—here is how to fix it.",
                    "platform": "YouTube",
                    "rationale": "Targeting an acute technical pain point guarantees qualified viewer retention."
                },
                {
                    "id": 8,
                    "style": "Fear/Urgency",
                    "hook": f"If you deploy a {topic} without local watchdog timers, your system will eventually lock up.",
                    "platform": "TikTok",
                    "rationale": "Warning of costly mistakes sparks urgent attention and bookmark saves."
                },
                {
                    "id": 9,
                    "style": "Future/Possibility",
                    "hook": f"Imagine an autonomous {topic} running continuously on ultra-low power for under $20.",
                    "platform": "YouTube",
                    "rationale": "Painting an inspiring future outcome generates excitement and aspirational engagement."
                },
                {
                    "id": 10,
                    "style": "Surprise/Twist",
                    "hook": f"I expected {topic} to cost hundreds of dollars—until I switched to edge microcontrollers.",
                    "platform": "X/Twitter",
                    "rationale": "Subverting expectation delivers an unexpected payoff that drives shares."
                }
            ]
            mock_data = {
                "hooks": mock_hooks,
                "topic": topic,
                "platform": "All Platforms",
                "tone": "Engaging"
            }
        elif getattr(schema, "__name__", "") == "ReelScriptOutput":
            mock_scenes = [
                {
                    "scene_number": 1,
                    "timestamp": "0:00 - 0:05",
                    "dialogue": f"Most engineers build {topic} completely wrong.",
                    "visual_direction": "Extreme close-up on hardware prototype. Quick snap zoom to speaker.",
                    "on_screen_text": f"STOP DOING THIS WITH {topic[:25].upper()}"
                },
                {
                    "scene_number": 2,
                    "timestamp": "0:05 - 0:25",
                    "dialogue": f"Instead of relying on fragile cloud APIs, you can process sensor telemetry right on the edge with local anomaly models.",
                    "visual_direction": "B-roll montage showing logic analyzer traces and live serial monitor debugging.",
                    "on_screen_text": "LOCAL EDGE PROCESSING"
                },
                {
                    "scene_number": 3,
                    "timestamp": "0:25 - 0:50",
                    "dialogue": f"This cuts alert latency down to milliseconds and prevents false alarms from internet dropouts. Here is the schematic breakdown.",
                    "visual_direction": "Overhead bench shot pointing directly to sensor pinout and microcontroller GPIO.",
                    "on_screen_text": "ZERO LATENCY ALERTS"
                },
                {
                    "scene_number": 4,
                    "timestamp": "0:50 - 1:00",
                    "dialogue": f"Want the full wiring diagram and code repository for {topic}? Drop a comment below and follow for part two.",
                    "visual_direction": "Direct-to-camera engaging smile with pointing gesture down toward comments.",
                    "on_screen_text": "COMMENT FOR SCHEMATICS"
                }
            ]
            mock_data = {
                "title": f"How to Build {topic} Like a Pro",
                "hook": f"Most engineers build {topic} completely wrong.",
                "body": f"Instead of relying on fragile cloud APIs, you can process sensor telemetry right on the edge with local anomaly models. This cuts alert latency down to milliseconds and prevents false alarms from internet dropouts.",
                "cta": f"Want the full wiring diagram and code repository for {topic}? Drop a comment below and follow for part two.",
                "duration": "30-60s",
                "scenes": mock_scenes,
                "caption_suggestion": f"Full teardown of {topic}. Link to repository in bio! #IoT #Hardware #Engineering #EdgeAI",
                "estimated_word_count": 115,
                "thoughts": [
                    f"Analyzed topic '{topic}' for technical clarity and audience retention.",
                    "Planned 4-beat structure: Hook (0-5s), Core Value (5-25s), Deep Dive (25-50s), CTA (50-60s).",
                    "Calibrated spoken word pacing to ~115 words for a punchy 60-second delivery."
                ]
            }
        elif getattr(schema, "__name__", "") == "CaptionOutput":
            mock_variants = [
                {
                    "label": "Take 1: Story-Led Technical Journey",
                    "hook": f"Can a tiny microcontroller change how we monitor {topic}?",
                    "body": f"Most people assume industrial monitoring requires thousands of dollars in proprietary infrastructure. By running lightweight edge anomaly models locally on hardware, we can process gas telemetry in real time without cloud latency or connection dropouts.",
                    "cta": "Would you deploy edge intelligence for critical infrastructure? Drop your thoughts below.",
                    "hashtags": ["IoT", "EdgeAI", "EmbeddedSystems", "HardwareEngineering", "TechInnovation"],
                    "keywords": ["edge anomaly detection", "real-time telemetry"],
                    "reach_score": 94,
                    "why": "Opens with an intriguing cost/capability contrast, provides high-density technical value, and finishes with a conversation-sparking question.",
                    "extra": "Reel audio tip: Use an upbeat synth or focused lo-fi background track."
                },
                {
                    "label": "Take 2: Direct Problem-Solution Hook",
                    "hook": f"Why traditional setups fail when monitoring {topic}.",
                    "body": "When a leak occurs, waiting on cloud roundtrips can be disastrous. Local processing detects spikes in milliseconds. Here is how edge architecture transforms telemetry.",
                    "cta": "Bookmark this breakdown for your next IoT build.",
                    "hashtags": ["IoT", "Microcontrollers", "Hardware", "EdgeComputing"],
                    "keywords": ["low latency monitoring", "hardware architecture"],
                    "reach_score": 88,
                    "why": "Clear urgency-driven opening with a high-intent save/bookmark trigger.",
                    "extra": "Carousel idea: Make slide 1 a high-contrast wiring diagram."
                },
                {
                    "label": "Take 3: Behind-The-Scenes Engineer Build",
                    "hook": f"Behind the scenes building an intelligent {topic} from scratch.",
                    "body": "From sensor calibration and analog-to-digital filtering to quantization of tiny ML models, this project demonstrates the power of combining low-power hardware with Edge AI.",
                    "cta": "Follow for the full schematic teardown in part 2.",
                    "hashtags": ["Makers", "IoTDevelopment", "OpenSourceHardware", "Electronics"],
                    "keywords": ["sensor calibration", "tinyML"],
                    "reach_score": 85,
                    "why": "Appeals directly to builder curiosity and drives profile follow intent.",
                    "extra": "Posting tip: Post between 11 AM and 1 PM for maximum developer engagement."
                }
            ]
            primary_cap = (
                f"{mock_variants[0]['hook']}\n\n"
                f"{mock_variants[0]['body']}\n\n"
                f"{mock_variants[0]['cta']}\n\n"
                f"{' '.join(['#' + t for t in mock_variants[0]['hashtags']])}"
            )
            mock_data = {
                "caption": primary_cap,
                "hook": mock_variants[0]["hook"],
                "body": mock_variants[0]["body"],
                "call_to_action": mock_variants[0]["cta"],
                "hashtags": mock_variants[0]["hashtags"],
                "platform": "Instagram",
                "tone": "Engaging",
                "content_goal": "Saves",
                "caption_length": "Medium",
                "character_count": len(primary_cap),
                "variants": mock_variants,
                "recommended_variant_index": 0,
                "recommend_reason": "Take 1 combines the strongest curiosity hook with high-density technical substance and a comment-stimulating call to action.",
                "planning_trace": "Selected Story-Led angle as primary due to strong technical grounding and high comment retention potential."
            }
        elif schema_name == "CTAGeneratorLLMOutput":
            mock_data = {
                "ctas": [
                    {
                        "text": f"Drop a comment below with '{topic.split()[0]}' and I'll send you the complete build notes.",
                        "placement": "End of caption / Pinned comment",
                        "category": "High-Intent Lead & Conversation",
                        "why_it_works": "Low-friction keyword trigger that sparks algorithmic comment velocity.",
                        "character_count": 85
                    },
                    {
                        "text": f"Bookmark this post so you have the reference architecture for your next {topic} build.",
                        "placement": "Slide 10 outro / Caption close",
                        "category": "Resource Bookmark",
                        "why_it_works": "Direct utility reminder capitalizing on high educational value.",
                        "character_count": 78
                    },
                    {
                        "text": f"Follow for part 2 where we run real-world field telemetry benchmarks on {topic}.",
                        "placement": "Final video frame",
                        "category": "Follow & Continuity",
                        "why_it_works": "Creates an open loop driving high-conviction profile visits.",
                        "character_count": 82
                    }
                ],
                "recommended_cta_index": 0,
                "recommended_reason": "Keyword comment triggers yield the highest platform distribution multiplier.",
                "placement_strategy": "Place as the final sentence in your post and mirror it in your first pinned comment."
            }
        elif schema_name == "CommentAnalysisLLMOutput":
            mock_data = {
                "overall_sentiment": "Inquisitive & Enthusiastic",
                "sentiment_distribution": {
                    "positive": 72,
                    "neutral": 20,
                    "critical": 8
                },
                "key_themes": [
                    {
                        "theme": f"Hardware Implementation of {topic}",
                        "description": "Questions regarding bill of materials, circuit wiring, and component sourcing.",
                        "volume_level": "High"
                    },
                    {
                        "theme": "Field Reliability & Telemetry",
                        "description": "Inquiries about battery longevity, wireless range, and environmental enclosure design.",
                        "volume_level": "Medium"
                    }
                ],
                "top_questions": [
                    f"Can this {topic} be deployed outdoors on solar power?",
                    f"What is the sampling frequency and accuracy of {topic}?",
                    "Where can we find the open source firmware repository?"
                ],
                "objections_and_critiques": [
                    f"Skeptical about sensor drift over prolonged operation in humid environments.",
                    "Concerns regarding power consumption during continuous Wi-Fi transmission."
                ],
                "audience_insights": [
                    "Audience consists primarily of hands-on embedded developers, IoT tinkerers, and engineering students.",
                    "Strong appetite for deep technical schematics over superficial marketing overviews."
                ],
                "actionable_recommendations": [
                    f"Record a dedicated follow-up addressing sensor calibration and power optimization for {topic}.",
                    "Pin a comment linking directly to GitHub documentation and wiring diagrams."
                ],
                "notable_quotes": [
                    f"Finally someone shows real code for {topic}!",
                    "This is the cleanest hardware teardown I have seen this month."
                ]
            }
        elif schema_name == "CommentToContentLLMOutput":
            mock_data = {
                "ideas": [
                    {
                        "title": f"Addressing the #1 Question: How to Calibrate {topic}",
                        "angle": "Direct Technical Tutorial",
                        "format": "60s Vertical Reel / Short",
                        "hook": f"Everyone in the comments asked how we calibrated {topic} without an expensive lab...",
                        "key_talking_points": [
                            "Step 1: Baseline zero-point calibration in clean air",
                            "Step 2: Voltage curve mapping to ADC readings",
                            "Step 3: Temperature compensation in firmware"
                        ],
                        "caption_draft": f"Replying to your questions on {topic}. Here is the exact 3-step calibration framework. Save for your build!",
                        "call_to_action": "Drop your calibration questions in the comments for part 2.",
                        "why_it_converts": "Directly resolves high-volume community confusion using organic social proof."
                    },
                    {
                        "title": f"3 Mistakes People Make When Building {topic}",
                        "angle": "Mythbusting & Teardown",
                        "format": "7-Slide Carousel",
                        "hook": f"Don't build {topic} until you avoid these 3 fatal wiring errors.",
                        "key_talking_points": [
                            "Mistake 1: Ignoring analog noise on ADC pins",
                            "Mistake 2: Inadequate voltage regulation under peak transmit",
                            "Mistake 3: Unvented enclosures trapping heat"
                        ],
                        "caption_draft": f"We tested dozens of iterations of {topic} so you don't have to repeat our mistakes. Swipe through the breakdown.",
                        "call_to_action": "Bookmark this guide before ordering your components.",
                        "why_it_converts": "Loss-aversion framing generates exceptionally high save rates."
                    }
                ],
                "recommended_idea_index": 0,
                "strategic_summary": "Answering community questions in short video format maximizes creator authority and community trust."
            }
        elif schema_name == "ContentRecyclerLLMOutput":
            mock_data = {
                "refreshed_angles_summary": f"Refreshed core thesis of {topic} from retrospective project summary into an actionable engineering blueprint and multi-slide carousel.",
                "variations": [
                    {
                        "format_name": "7-Slide Educational Carousel",
                        "angle_description": "Visual Architecture Blueprint",
                        "hook": f"The complete schematic architecture for {topic} in 7 slides.",
                        "content_body": f"Slide 1: Overview\nSlide 2: Component Breakdown\nSlide 3: Firmware Stack\nSlide 4: Telemetry Pipeline\nSlide 5: Test Results\nSlide 6: Lessons Learned\nSlide 7: Summary",
                        "cta": "Swipe back and save this carousel for your next hardware sprint."
                    },
                    {
                        "format_name": "High-Density X / Twitter Thread",
                        "angle_description": "First-Principles Technical Breakdown",
                        "hook": f"1/ How we designed and validated {topic} from the ground up (and what failed first):\n\n🧵 A technical deep-dive:",
                        "content_body": f"2/ The Core Sensor: Precision analog calibration\n\n3/ Edge Processing: Filtering raw ADC spikes\n\n4/ The Output: Sub-second warning alerts",
                        "cta": "Retweet the first post if you love open hardware documentation."
                    }
                ],
                "recommended_variation_index": 0,
                "republishing_schedule_advice": "Republish as a carousel on LinkedIn on Tuesday morning, followed by the thread format on X 48 hours later."
            }
        elif schema_name == "BrandPitchLLMOutput":
            mock_data = {
                "email_subject_lines": [
                    f"Partnership: Authentic Developer Showcase for [Brand Product]",
                    f"Collaborating on High-Impact Technical Content with {topic}",
                    f"Bridging Hardware Engineering & [Brand Product] to 25k+ Builders"
                ],
                "outreach_email_body": f"Hi [Brand Team],\n\nI love how [Brand Product] simplifies hardware workflows. My community of engineers and builders is deeply engaged in projects like {topic}.\n\nI would love to feature [Brand Product] in an upcoming dedicated build breakdown showing real-world implementation.\n\nWould you be open to exploring a brief collaboration this quarter?\n\nBest,\n[Creator]",
                "executive_summary": f"Creator proposing a high-intent technical sponsorship featuring [Brand Product] integrated into an active {topic} build.",
                "campaign_concepts": [
                    {
                        "title": f"Hands-on Build: Powering {topic} with [Brand Product]",
                        "concept_summary": "Demonstrating realistic end-to-end integration with transparent benchmarks.",
                        "suggested_platform": "YouTube / LinkedIn",
                        "why_it_fits": "Audience trusts technical demonstrations over scripted product endorsements."
                    }
                ],
                "recommended_deliverables": [
                    {
                        "format": "Dedicated YouTube Video / Case Study",
                        "scope": "10-12 min comprehensive build documentation with prominent link in description.",
                        "estimated_timeline": "10 business days"
                    }
                ],
                "pricing_and_roi_framing": "Positioned around high conversion and long-term organic search evergreen value rather than short-lived viral spikes.",
                "followup_timeline_advice": "Send a polite 1-paragraph bump email 5 business days after initial outreach if no reply."
            }
        elif schema_name == "CollaborationFinderLLMOutput":
            mock_data = {
                "creator_positioning_analysis": f"Strong technical positioning in hands-on hardware builds, embedded prototyping, and real-world projects like {topic}.",
                "ideal_partner_criteria": [
                    "Complementary technical skills (e.g. 3D printing/CAD, cloud backend, front-end dashboards)",
                    "High audience engagement rate (>5%) over vanity follower counts",
                    "Commitment to open source and educational documentation",
                    "Active posting cadence on YouTube or X"
                ],
                "partner_archetypes": [
                    {
                        "partner_niche": "CAD Modeling & 3D Printing Creators",
                        "audience_synergy_reason": "Electronics builders constantly need custom enclosures, and CAD enthusiasts need circuits to house.",
                        "suggested_format": "Cross-over Build: 'I Built the Circuit, They Built the Enclosure'",
                        "win_win_value_proposition": "Both channels gain cross-pollinated subscribers with 100% thematic relevance."
                    },
                    {
                        "partner_niche": "Cloud & Data Engineering Creators",
                        "audience_synergy_reason": "IoT hardware requires robust cloud pipelines and analytics dashboards.",
                        "suggested_format": "Edge-to-Cloud Livestream Workshop",
                        "win_win_value_proposition": "Demonstrates full full-stack capability to both developer communities."
                    }
                ],
                "collaboration_ideas": [
                    {
                        "title": f"The Ultimate Smart Enclosure for {topic}",
                        "pitch_angle": "Dual-channel build challenge with cross-promotion.",
                        "outreach_dm_template": f"Hey! Love your CAD design videos. I just finished prototyping {topic} and would love to collaborate on a custom enclosure build video. Let me know if you're interested!"
                    }
                ],
                "outreach_strategy_tips": [
                    "Engage thoughtfully with 2-3 of their recent videos before reaching out.",
                    "Keep the initial outreach DM under 4 sentences with a zero-pressure question."
                ]
            }
        elif schema_name == "DailyPlannerLLMOutput":
            mock_data = {
                "strategic_overview": f"A balanced 7-day cadence centering around {topic}, distributing technical education, storytelling, and audience Q&A across platforms.",
                "schedule": [
                    {
                        "day": f"Day {i+1}",
                        "time_window": "09:00 AM - 10:30 AM",
                        "platform": "LinkedIn" if i % 2 == 0 else "Instagram",
                        "content_pillar": "Technical Deep-Dive" if i % 2 == 0 else "Behind-The-Scenes",
                        "post_title_concept": f"Engineering Milestone {i+1} of {topic}",
                        "format": "Carousel" if i % 2 == 0 else "Reel",
                        "primary_objective": "Saves & Engagement"
                    }
                    for i in range(7)
                ],
                "production_milestones": [
                    "Monday Morning: Batch script all hooks and outlines",
                    "Tuesday Afternoon: Record B-roll and screen captures",
                    "Wednesday: Finalize graphics and schedule distribution"
                ],
                "consistency_tip": "Never write and record on the same day. Decouple ideation from production to maintain quality."
            }
        elif schema_name == "ThumbnailIdeatorLLMOutput":
            mock_data = {
                "concepts": [
                    {
                        "title": "Extreme Close-Up Curiosity",
                        "visual_focal_point": f"Microcontroller board for {topic} with glowing indicator LED",
                        "background_and_lighting": "Dark moody studio setting with neon cyan backlight",
                        "text_overlay": "DOES IT WORK?",
                        "creator_expression": "Intense focused inspection",
                        "color_palette": ["Neon Cyan", "Matte Black", "Bright Amber"],
                        "ctr_psychology_rationale": "High contrast creates immediate stopping power on mobile feeds.",
                        "image_generation_prompt": f"Macro photograph of {topic} circuit board, glowing LEDs, dark background, cinematic volumetric lighting, 8k resolution, photorealistic"
                    },
                    {
                        "title": "Before vs After Shock",
                        "visual_focal_point": "Split screen comparing raw prototype wiring vs sleek finished build",
                        "background_and_lighting": "Split lighting with warm desk lamp on left, crisp white studio light on right",
                        "text_overlay": "30 DAYS LATER",
                        "creator_expression": "Proud presentation gesture",
                        "color_palette": ["Vibrant Orange", "Clean White", "Deep Slate"],
                        "ctr_psychology_rationale": "Transformation format leverages curiosity gap about the iteration journey.",
                        "image_generation_prompt": f"Split screen comparison of messy prototype hardware versus clean industrial design for {topic}, highly detailed, tech studio lighting"
                    }
                ],
                "recommended_concept_index": 0,
                "a_b_testing_hypothesis": "Test Extreme Close-Up (high contrast hardware) against Split Screen (transformation story).",
                "title_thumbnail_synergy_tip": "If the title states what the project is, the thumbnail must ask an emotional question."
            }
        elif schema_name == "CreatorResearchLLMOutput":
            mock_data = {
                "executive_brief": f"Comprehensive creator intelligence teardown analyzing market positioning, content tropes, and audience whitespace for {topic}.",
                "technical_pillars": [
                    {
                        "heading": f"First-Principles Architecture of {topic}",
                        "key_findings": [
                            f"Edge sensor integration requires careful analog noise filtering and ADC calibration for {topic}.",
                            "Local anomaly classification removes cloud API dependency, slashing telemetry latency.",
                            "Power optimization enables battery or solar harvesting longevity in remote deployments."
                        ],
                        "content_implications": "Creators can showcase oscilloscope waveforms and live sensor charts to establish rock-solid technical credibility."
                    }
                ],
                "competitor_landscape": [
                    {
                        "angle_title": "Generic Unboxing & Surface Overview",
                        "critique_or_gap": "Most existing videos stop at unboxing without showing long-term field stability or code architecture.",
                        "recommended_differentiation": "Position your content as the rigorous engineering build with open source schematics and failure post-mortems."
                    }
                ],
                "content_angle_recommendations": [
                    f"Why 90% of {topic} projects fail in the first 48 hours (and how to fix it).",
                    f"Building {topic} from scratch for under $25.",
                    f"The math and firmware logic behind {topic} explained in 60 seconds."
                ],
                "cautions_and_misconceptions": [
                    "Never claim industrial calibration accuracy without laboratory sensor calibration chambers.",
                    "Avoid overpromising battery life without stating transmission sleep duty cycles."
                ]
            }
        elif schema_name == "SecondBrainSynthesisLLMOutput":
            mock_data = {
                "direct_answer": f"Based on your second brain repository, your notes on {topic} emphasize low-power edge processing, modular sensor enclosures, and iterative hardware debugging.",
                "connected_themes": [
                    "Edge Computing & Microcontroller Telemetry",
                    "Iterative Hardware Prototyping",
                    "Open Hardware Documentation"
                ],
                "suggested_content_hooks": [
                    f"Here is the one hardware principle from my notes that solved {topic} forever.",
                    f"Connecting 3 separate ideas from my engineering journal into one prototype for {topic}."
                ],
                "referenced_item_titles": [
                    f"Architecture notes for {topic}",
                    "Low power sleep modes in embedded systems"
                ]
            }
        elif schema_name == "VoiceReplicatorLLMOutput":
            mock_data = {
                "style_profile": {
                    "tone_signature": "Pragmatic, Direct, Technical, and No-Nonsense",
                    "sentence_structure_style": "Short punchy hooks followed by dense explanatory paragraphs with bulleted technical checkpoints",
                    "vocabulary_and_jargon": ["first-principles", "telemetry", "firmware", "edge-case", "bottleneck"],
                    "signature_phrases": ["Here's the honest truth", "Let's look at the schematics", "Don't overcomplicate this"]
                },
                "generated_content": f"Most creators overthink {topic}. They spend weeks tuning cloud pipelines when all they needed was a robust local watchdog loop and proper ADC grounding. Here is the exact blueprint I use on every build.",
                "style_alignment_score": 96,
                "reusable_voice_guidelines": [
                    "Lead with direct technical assertions rather than generic pleasantries.",
                    "Always mention a real-world constraint or edge-case failure mode.",
                    "Keep calls-to-action focused on code repositories and technical discussion."
                ]
            }
        elif schema_name == "PodcastPlanningLLMOutput":
            mock_data = {
                "episode_title_options": [
                    f"Episode 42: Demystifying {topic} from the Ground Up",
                    f"The Hard Truth About Building {topic} at Scale",
                    f"Why Edge Hardware is Eating Cloud Computing: A {topic} Case Study"
                ],
                "recommended_title_index": 0,
                "episode_description": f"In this deep-dive episode, we break down the engineering triumphs, catastrophic failures, and practical realities of building {topic}. Whether you're an embedded developer or tech founder, this conversation provides an unvarnished masterclass.",
                "host_guest_talking_points": [
                    f"Origin story: Why we decided to tackle {topic}",
                    "The hardest technical roadblock and the breakthrough schematic",
                    "Audience Q&A and predictions for the next 3 years"
                ],
                "timed_segments": [
                    {
                        "timestamp_range": "00:00 - 05:00",
                        "segment_title": "Cold Open & The Big Problem",
                        "summary_and_questions": f"Hook the listener with the core stakes of {topic}. What happens when systems fail?"
                    },
                    {
                        "timestamp_range": "05:00 - 25:00",
                        "segment_title": "The Technical Architecture Teardown",
                        "summary_and_questions": "Walking through microcontrollers, sensor selection, firmware stack, and data pipelines."
                    },
                    {
                        "timestamp_range": "25:00 - 40:00",
                        "segment_title": "Lessons Learned & Audience Q&A",
                        "summary_and_questions": "Answering listener questions, trade-offs, and open source repository walkthrough."
                    }
                ],
                "show_notes_markdown": f"## Show Notes: Demystifying {topic}\n\n- Overview of the system\n- Bill of materials\n- Key links and repository",
                "social_promotional_snippets": [
                    f"🎙️ New Episode: Everything you need to know about building {topic}. Listen now on Spotify & Apple Podcasts!",
                    f"Why do most IoT builds fail? In our latest podcast, we break down the real telemetry behind {topic}."
                ]
            }
        elif schema_name == "ClipFinderLLMOutput":
            mock_data = {
                "analysis_summary": f"Identified 3 viral high-retention vertical clip moments from the transcript centered on {topic}.",
                "clips": [
                    {
                        "start_timestamp": "02:15",
                        "end_timestamp": "03:05",
                        "duration_seconds": 50,
                        "viral_potential_score": 94,
                        "suggested_title": f"The #1 Mistake Everyone Makes with {topic}",
                        "hook_quote": f"I watched 10 teams try to deploy {topic}, and 9 of them made the exact same mistake.",
                        "reasoning": "High tension opening followed by rapid-fire practical takeaway ideal for TikTok/Reels.",
                        "recommended_aspect_ratio": "9:16",
                        "suggested_caption": f"Avoid this mistake when building {topic}! Full episode in bio. #Engineering #Makers"
                    },
                    {
                        "start_timestamp": "14:20",
                        "end_timestamp": "15:05",
                        "duration_seconds": 45,
                        "viral_potential_score": 88,
                        "suggested_title": "How to Calibrate Sensors in Seconds",
                        "hook_quote": "Most people think sensor calibration takes days. Here is the 10-second firmware shortcut.",
                        "reasoning": "Demonstrates immediate tangible utility that triggers bookmark saves.",
                        "recommended_aspect_ratio": "9:16",
                        "suggested_caption": f"Save this shortcut for {topic} sensor calibration! #IoT #TechTips"
                    }
                ],
                "recommended_clip_index": 0
            }
        elif schema_name in ("ContentDirectorLLMOutput", "GuruvelahDirectorLLMOutput"):
            is_guruvelah = "Guruvelah" in schema_name
            mock_data = {
                "campaign_title": f"{'Guruvelah Autonomous Direction' if is_guruvelah else 'AI Content Direction'}: {topic}",
                "strategic_thesis": f"An authoritative multi-channel thought leadership sprint demonstrating deep domain mastery of {topic}.",
                "workflow_steps_executed": [
                    "Idea Conceptualization",
                    "Hook Generation & Viral Angle Screening",
                    "Reel Script Blueprinting",
                    "Multi-Platform Caption Drafting",
                    "Conversion CTA Optimization"
                ],
                "directed_package": {
                    "concept": f"The First-Principles Blueprint for {topic}",
                    "hook": f"Stop building {topic} like it's 2018. Here is modern edge engineering.",
                    "script_summary": "4-beat vertical short video breaking down hardware, firmware, and field alerts.",
                    "caption_summary": "Educational carousel caption with technical breakdown and comment keyword trigger.",
                    "primary_cta": f"Comment '{topic.split()[0]}' for schematics and source code."
                },
                "production_readiness_score": 98,
                "guruvelah_principles": [
                    "Clarity over sensationalism",
                    "Uncompromising technical grounding",
                    "Actionable developer utility"
                ] if is_guruvelah else []
            }
        elif schema_name == "ScreenplayLLMOutput":
            mock_data = {
                "title": f"The Signal of {topic}",
                "logline": f"An obsessive hardware engineer uncovers an anomalous telemetry signature while calibrating {topic}, triggering a high-stakes investigation.",
                "genre": "Sci-Fi / Tech Thriller",
                "character_profiles": [
                    {
                        "name": "Dr. Elena Vance",
                        "role": "Lead Hardware Architect",
                        "motivation": "Proving that edge sensors detected an unrecorded subterranean atmospheric event",
                        "arc_description": "From isolated bench researcher to defiant whistleblower"
                    },
                    {
                        "name": "Marcus Kane",
                        "role": "Chief Safety Inspector",
                        "motivation": "Protecting company liability and covering up sensor anomalies",
                        "arc_description": "From corporate loyalist to realizing the catastrophic danger"
                    }
                ],
                "beat_sheet": [
                    "Beat 1: The Zero-Point Calibration - Elena notices unexpected sensor oscillations.",
                    "Beat 2: The Refusal - Management dismisses the reading as ambient hardware noise.",
                    "Beat 3: The Proof - Elena deploys a rogue autonomous edge node to confirm the spike."
                ],
                "scene_script": f"SCENE 1 - INT. LAB BENCH - NIGHT\n\nThe ambient glow of an oscilloscope cuts through the dark workshop.\n\nELENA (30s, exhausted, eyes bloodshot) adjusts the potentiometer on the prototype of {topic}.\n\nELENA\n(whispering)\nThat's impossible. Baseline was cleared two hours ago.\n\nThe serial monitor spits out erratic hex values. She leans in.",
                "director_notes": "Emphasize practical physical tactile props, clacking mechanical keyboards, and high-contrast moody blue workshop lighting."
            }
        elif schema_name == "AutonomousPipelineLLMOutput":
            mock_data = {
                "pipeline_id": "pipe_auto_98231",
                "status": "completed",
                "stages_completed": [
                    "Stage 1: Niche Research & Audience Profiling",
                    "Stage 2: Core Concept Formulation",
                    "Stage 3: Multi-Platform Hook Generation",
                    "Stage 4: Script & Storyboard Synthesis",
                    "Stage 5: Caption & Tag Generation",
                    "Stage 6: CTA & Conversion Hook Alignment",
                    "Stage 7: Autonomous Quality & Grounding Audit"
                ],
                "output_bundle": {
                    "topic": topic,
                    "title": f"Autonomous Master Package: {topic}",
                    "primary_script": f"Hook: Everyone misunderstands {topic}.\nBody: Here is how edge architecture transforms real-time processing.\nCTA: Save this for your build.",
                    "caption": f"The full guide to {topic}. Link to repository in bio!",
                    "hashtags": ["Engineering", "Hardware", "IoT"]
                },
                "audit_verdict": "Passed - 100% grounded in input topic without hallucinated claims."
            }
        elif schema_name == "CreativeProducerLLMOutput":
            mock_data = {
                "production_package_title": f"Executive Creative Direction: {topic}",
                "creative_vision": f"Cinematic industrial documentary style showcasing hands-on prototyping of {topic}.",
                "visual_style_guide": {
                    "color_grading": "Cool steel cyan shadows with warm 3200K desk lamp highlights",
                    "camera_movement": "Smooth motorized macro slider passes over circuit traces",
                    "audio_design": "Rhythmic mechanical switch clicks, subtle high-frequency telemetry hum"
                },
                "shot_list": [
                    {
                        "shot_number": 1,
                        "shot_type": "Macro Probe Close-Up",
                        "description": f"Multimeter probe touching test point on {topic} board.",
                        "equipment_recommendation": "100mm macro lens on tripod"
                    },
                    {
                        "shot_number": 2,
                        "shot_type": "Wide Workshop Master",
                        "description": "Creator soldering under fume extractor, illuminated by warm bench light.",
                        "equipment_recommendation": "35mm prime, f/1.8"
                    }
                ],
                "distribution_strategy": "Launch 60s vertical teaser on Instagram & TikTok, follow with 12-minute documentary on YouTube 2 days later."
            }
        else:
            mock_data = {
                "result": f"Structured mock output for {topic}",
                "status": "success"
            }

        return ModelResponse(
            raw_content=str(mock_data),
            structured_data=mock_data,
            usage=ModelUsageMetadata(
                input_tokens=220,
                output_tokens=110,
                total_tokens=330,
                latency_ms=int((time.time() - start_time) * 1000)
            ),
            provider="mock",
            model=self.model_name
        )
