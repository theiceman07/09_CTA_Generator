require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const apiKey = process.env.LANGCHAIN_API_KEY;
const client = new Client({
  apiKey,
  apiUrl: 'https://api.smith.langchain.com'
});

async function checkLangSmith() {
  try {
    console.log('=== 1. CHECKING LANGSMITH PROJECTS ===');
    const projects = [];
    for await (const p of client.listProjects()) {
      projects.push(p);
      console.log(`- Project: "${p.name}" | ID: ${p.id}`);
    }

    console.log('\n=== 2. CHECKING RUNS IN PROJECT [creator-os] ===');
    let runCount = 0;
    try {
      for await (const run of client.listRuns({ projectName: 'creator-os' })) {
        runCount++;
        console.log(`\n[Run #${runCount}]`);
        console.log(`  Name: ${run.name}`);
        console.log(`  Type: ${run.run_type}`);
        console.log(`  Status: ${run.status}`);
        console.log(`  ID: ${run.id}`);
        console.log(`  Start Time: ${run.start_time}`);
        console.log(`  Inputs:`, JSON.stringify(run.inputs, null, 2));
        console.log(`  Outputs:`, JSON.stringify(run.outputs, null, 2));
        if (runCount >= 5) break;
      }
    } catch (e) {
      console.log('Error querying runs for creator-os:', e.message);
    }

    if (runCount === 0) {
      console.log('No runs found in creator-os.');
    }
  } catch (err) {
    console.error('LangSmith Error:', err.message);
  }
}

checkLangSmith();
