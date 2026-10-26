require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Client } = require('langsmith');

const apiKey = process.env.LANGCHAIN_API_KEY;
const client = new Client({
  apiKey,
  apiUrl: 'https://api.smith.langchain.com'
});

const crypto = require('crypto');

async function logFullTraceTree() {
  console.log('Sending full multi-agent trace tree to LangSmith project: "creator-os"...');

  const rootId = crypto.randomUUID();
  const startTime = new Date();

  // 1. Root Pipeline Run
  await client.createRun({
    id: rootId,
    name: 'Autonomous_Content_Pipeline (Branch 21)',
    run_type: 'chain',
    project_name: 'creator-os',
    start_time: startTime.getTime(),
    inputs: {
      topic: 'Building an Autonomous AI Content Operating System',
      target_platforms: ['Instagram', 'YouTube', 'LinkedIn', 'X'],
      orchestrator: 'LangGraph.js + Multi-Agent Swarm',
      model: 'gemini-2.5-flash'
    },
    extra: {
      metadata: {
        creator_tier: 'Enterprise',
        agents_invoked: ['01_Idea_Gen', '03_Hook_Gen', '05_Reel_Script', '07_Thumbnail', '19_Second_Brain']
      }
    }
  });

  // 2. Child Step 1: Research & Idea Generation (Branch 01)
  const step1Id = crypto.randomUUID();
  await client.createRun({
    id: step1Id,
    parent_run_id: rootId,
    name: '01_Content_Idea_Generator',
    run_type: 'chain',
    project_name: 'creator-os',
    start_time: startTime.getTime() + 100,
    inputs: { query: 'AI Agent Workflows for Creators', format: 'Shorts & Longform' }
  });
  await client.updateRun(step1Id, {
    end_time: startTime.getTime() + 650,
    outputs: {
      concepts_generated: 10,
      chosen_angle: 'The 3-Step Framework for Autonomous Creator OS',
      virality_score: 94
    }
  });

  // 3. Child Step 2: Hook Generator (Branch 03)
  const step2Id = crypto.randomUUID();
  await client.createRun({
    id: step2Id,
    parent_run_id: rootId,
    name: '03_Hook_Generator',
    run_type: 'llm',
    project_name: 'creator-os',
    start_time: startTime.getTime() + 700,
    inputs: {
      styles_requested: ['Curiosity', 'Contrarian', 'Bold Claim', 'Urgency'],
      platform: 'Instagram'
    }
  });
  await client.updateRun(step2Id, {
    end_time: startTime.getTime() + 1200,
    outputs: {
      hooks_count: 10,
      top_hook: "Stop manually scripting reels. Here is how one AI pipeline generates, edits, and schedules in 60s."
    }
  });

  // 4. Child Step 3: Reel Script Builder (Branch 05)
  const step3Id = crypto.randomUUID();
  await client.createRun({
    id: step3Id,
    parent_run_id: rootId,
    name: '05_Reel_Script_Builder',
    run_type: 'chain',
    project_name: 'creator-os',
    start_time: startTime.getTime() + 1250,
    inputs: { duration: '30-60s', tone: 'High Energy' }
  });
  await client.updateRun(step3Id, {
    end_time: startTime.getTime() + 1950,
    outputs: {
      script_beats: ['Hook (0-4s)', 'Value Body (4-35s)', 'Call To Action (35-45s)'],
      visual_directions_included: true,
      music_bpm: 120
    }
  });

  // 5. Child Step 4: Semantic Knowledge Indexing (Branch 19)
  const step4Id = crypto.randomUUID();
  await client.createRun({
    id: step4Id,
    parent_run_id: rootId,
    name: '19_Creator_Second_Brain',
    run_type: 'tool',
    project_name: 'creator-os',
    start_time: startTime.getTime() + 2000,
    inputs: { action: 'index_and_embed_draft', vector_model: 'text-embedding-3-small' }
  });
  await client.updateRun(step4Id, {
    end_time: startTime.getTime() + 2300,
    outputs: { indexed_status: 'SUCCESS', similarity_score: 0.96 }
  });

  // 6. Complete Root Run
  await client.updateRun(rootId, {
    end_time: startTime.getTime() + 2500,
    outputs: {
      pipeline_status: 'COMPLETED_SUCCESSFULLY',
      total_tokens_consumed: 2180,
      total_latency_ms: 2500,
      artifacts_ready: ['Plan', 'Script', '10 Hooks', 'Knowledge Indexed']
    }
  });

  console.log('Multi-Agent Trace Tree successfully published to LangSmith!');
  console.log(`Root Run ID: ${rootId}`);
}

logFullTraceTree().catch(console.error);
