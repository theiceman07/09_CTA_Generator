import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic, tone, duration } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({
        source: 'mock_fallback',
        script: {
          hook: {
            timing: '00:00 - 00:04',
            spoken: `If you are trying to master ${topic}, stop making this one costly mistake.`,
            visual: 'Fast zoom-in to camera with bold red warning text overlay.',
          },
          body: [
            {
              timing: '00:04 - 00:18',
              spoken: `Most creators waste hours doing this manually. Instead, focus entirely on these two high-leverage frameworks.`,
              visual: 'B-roll screen recording showing workflow breakdown with sound effect.',
            },
            {
              timing: '00:18 - 00:35',
              spoken: `First, set up your core templates. Second, automate your recurring steps so you only do creative work.`,
              visual: 'Side-by-side timer comparison showing 10x speedup.',
            },
          ],
          cta: {
            timing: '00:35 - 00:45',
            spoken: `Comment "SYSTEM" below and I will DM you the free cheat sheet template.`,
            visual: 'Finger pointing down towards comment section with animated arrow.',
          },
          musicRecommendation: 'Upbeat phonk or lo-fi hip hop beat with steady bassline (120 BPM).',
        },
      });
    }

    const prompt = `You are an elite short-form video director and viral scriptwriter for Instagram Reels and TikTok.
Write a structured, word-for-word 30-60 second video script for:
Topic: "${topic}"
Tone: "${tone || 'High Energy'}"
Duration: "${duration || '30-60'} seconds"

CRITICAL RULES:
1. Hook (0-5s): Punchy, curiosity-inducing, spoken directly to camera.
2. Body (5-45s): 2-3 structured narrative beats with precise visual/B-roll directions.
3. Call to Action (final 5s): High-converting comment or follow trigger.
4. Output STRICTLY as valid JSON matching this schema:
{
  "script": {
    "hook": { "timing": "00:00 - 00:04", "spoken": "spoken words", "visual": "visual direction" },
    "body": [
      { "timing": "00:04 - 00:18", "spoken": "spoken words", "visual": "visual direction" },
      { "timing": "00:18 - 00:35", "spoken": "spoken words", "visual": "visual direction" }
    ],
    "cta": { "timing": "00:35 - 00:45", "spoken": "spoken words", "visual": "visual direction" },
    "musicRecommendation": "Recommended genre and BPM"
  }
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.statusText}`);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText || '{}');

    return NextResponse.json({
      source: 'gemini',
      script: parsed.script,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate reel script',
        script: null,
      },
      { status: 200 }
    );
  }
}
