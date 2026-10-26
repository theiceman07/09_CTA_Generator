import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic, audience, niche, tone, length } = await req.json();

    if (!topic || !audience) {
      return NextResponse.json({ error: 'Topic and Audience are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({
        source: 'mock_fallback',
        ideas: [
          {
            type: 'Myth Buster',
            title: `Stop Believing This About ${topic}`,
            hook: `Everyone says you need X for ${topic}. They are completely wrong.`,
            thumbnail: { visual: 'Split screen comparison of wrong way vs right way', overlay: 'STOP DOING THIS' },
            why: 'High curiosity gap and challenges prevailing industry wisdom.',
            format: 'Vertical Short 30-60s',
            effort: 'Easy',
            score: 89,
          },
          {
            type: 'Case Study',
            title: `How One Creator Mastered ${topic}`,
            hook: `This creator figured out an untapped loophole in ${topic}.`,
            thumbnail: { visual: 'Analytics dashboard graph shooting upwards', overlay: '10K IN 30 DAYS' },
            why: 'Concrete proof and practical timeline trigger algorithmic virality.',
            format: 'Vertical Short 30-60s',
            effort: 'Medium',
            score: 94,
          },
          {
            type: 'Step-by-Step Tutorial',
            title: `The 3-Step Framework for ${topic}`,
            hook: `If I had to restart ${topic} from zero, here is step one.`,
            thumbnail: { visual: 'Numbered 1-2-3 checklist with checkmarks', overlay: 'DO THIS FIRST' },
            why: 'Actionable guidance delivers high bookmark and save rates.',
            format: 'Vertical Short 30-60s',
            effort: 'Medium',
            score: 91,
          },
        ],
      });
    }

    const prompt = `You are an elite YouTube creator consultant and algorithm strategist.
Generate exactly 6 distinct, high-CTR video concepts for:
Topic: "${topic}"
Audience: "${audience}"
Niche: "${niche || 'Tech & AI'}"
Tone: "${tone || 'Casual'}"
Format: "${length || 'Shorts'}"

CRITICAL RULES:
1. No emojis and no em dashes in titles. Under 60 characters.
2. Spoken hook for the first 15 seconds.
3. Realistic visual composition for thumbnail + max 3 words for text overlay.
4. Output STRICTLY as valid JSON matching this schema:
{
  "ideas": [
    {
      "type": "Myth Buster",
      "title": "Title here",
      "hook": "Spoken hook here",
      "thumbnail": { "visual": "Composition description", "overlay": "3 WORDS MAX" },
      "why": "One sentence psychological reason",
      "format": "Vertical Short 30-60s",
      "effort": "Easy",
      "score": 88
    }
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
      ideas: parsed.ideas || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate ideas',
        ideas: [],
      },
      { status: 200 }
    );
  }
}
