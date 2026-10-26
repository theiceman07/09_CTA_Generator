import { NextRequest, NextResponse } from 'next/server';

const REQUIRED_STYLES = [
  'Curiosity',
  'Question',
  'Contrarian',
  'Bold Claim',
  'Statistic/Data',
  'Story',
  'Problem/Pain Point',
  'Fear/Urgency',
  'Future/Possibility',
  'Surprise/Twist',
];

export async function POST(req: NextRequest) {
  try {
    const { topic, audience, platform, tone } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Return structured demo hooks if key not set yet
      return NextResponse.json({
        source: 'mock_fallback',
        hooks: REQUIRED_STYLES.map((style) => ({
          style,
          hook: `[${style}] Stop making this mistake with ${topic} if you are a ${audience || 'creator'}! Here is what works now in 2026.`,
        })),
      });
    }

    // Call Gemini 1.5 Flash / 2.0 Flash REST endpoint directly
    const prompt = `You are an elite hook strategist for content creators.
Generate exactly 10 distinct, scroll-stopping hooks for:
Topic: "${topic}"
Target Audience: "${audience || 'General Creators'}"
Platform: "${platform || 'Instagram'}"
Tone: "${tone || 'Bold'}"

You MUST generate exactly 10 hooks corresponding to these 10 styles in order:
1. Curiosity
2. Question
3. Contrarian
4. Bold Claim
5. Statistic/Data
6. Story
7. Problem/Pain Point
8. Fear/Urgency
9. Future/Possibility
10. Surprise/Twist

Format your response STRICTLY as valid JSON matching this structure:
{
  "hooks": [
    { "style": "Curiosity", "hook": "spoken hook here under 2 sentences" },
    ...
  ]
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
      hooks: parsed.hooks || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate hooks',
        hooks: REQUIRED_STYLES.map((style) => ({
          style,
          hook: `[${style}] Stop making this mistake with the topic! Here is what works now.`,
        })),
      },
      { status: 200 }
    );
  }
}
