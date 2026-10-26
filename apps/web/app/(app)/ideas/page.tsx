'use client';

import React, { useState } from 'react';

interface IdeaItem {
  type: string;
  title: string;
  hook: string;
  thumbnail: { visual: string; overlay: string };
  why: string;
  format: string;
  effort: string;
  score: number;
}

export default function IdeasGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [niche, setNiche] = useState('Tech & AI');
  const [tone, setTone] = useState('Casual');
  const [length, setLength] = useState('Shorts / Reels');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<IdeaItem[] | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/agents/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience, niche, tone, length }),
      });
      const data = await res.json();
      if (data.ideas) {
        setIdeas(data.ideas);
      }
    } catch {
      // Mock fallback
      setIdeas([
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
          title: `How One Creator Made \$10k with ${topic}`,
          hook: `This 19-year old figured out a loophole in ${topic}.`,
          thumbnail: { visual: 'Analytics dashboard graph shooting upwards', overlay: '10K IN 30 DAYS' },
          why: 'Specific dollar figure and tangible proof create viral click signals.',
          format: 'Vertical Short 30-60s',
          effort: 'Medium',
          score: 94,
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#FF69B4] uppercase tracking-wider">
          <span>Branch 01</span>
          <span>•</span>
          <span>Ideation & Research</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mt-1">Content Idea Generator</h1>
        <p className="text-[#9BA8AB] mt-2">
          Turn any topic and audience into 10 high-CTR video concepts complete with spoken hooks, thumbnail directions, and virality scores.
        </p>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleGenerate}
        className="bg-[#11212D]/60 backdrop-blur-xl border border-[#4A5C6A]/40 rounded-2xl p-6 shadow-2xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CCD0CF]">Core Topic *</label>
            <input
              type="text"
              required
              placeholder="e.g. AI Agent Workflows for Beginners"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white placeholder:text-[#4A5C6A] focus:outline-none focus:border-[#FF69B4] transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CCD0CF]">Target Audience *</label>
            <input
              type="text"
              required
              placeholder="e.g. Junior developers and tech creators"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white placeholder:text-[#4A5C6A] focus:outline-none focus:border-[#FF69B4] transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CCD0CF]">Niche / Category</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF69B4] transition"
            >
              <option value="Tech & AI">Tech & AI</option>
              <option value="Business & Finance">Business & Finance</option>
              <option value="Productivity & Habits">Productivity & Habits</option>
              <option value="Fitness & Health">Fitness & Health</option>
              <option value="Content Creation">Content Creation</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CCD0CF]">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF69B4] transition"
            >
              <option value="Casual">Casual & Conversational</option>
              <option value="Educational">Educational & Authoritative</option>
              <option value="Energetic">Energetic & Hype</option>
              <option value="Minimalist">Direct & Minimalist</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CCD0CF]">Format / Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF69B4] transition"
            >
              <option value="Shorts / Reels">Shorts / Reels (30–60s)</option>
              <option value="Long Form">YouTube Video (8–12 mins)</option>
              <option value="Carousel">LinkedIn / IG Carousel</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF69B4] to-[#C24366] text-white font-semibold shadow-lg shadow-[#FF69B4]/20 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Strategizing 10 Concepts with Gemini...' : 'Generate 10 Concepts →'}
          </button>
        </div>
      </form>

      {/* Generated Ideas Output */}
      {ideas && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Generated Video Concepts ({ideas.length})</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#11212D]/40 border border-[#4A5C6A]/30 rounded-2xl p-5 hover:border-[#FF69B4]/50 transition group flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#253745] text-[#FF69B4] border border-[#FF69B4]/20">
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      Virality: {item.score}/100
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF69B4] transition">
                    {item.title}
                  </h3>

                  <div className="bg-[#06141B]/60 p-3 rounded-xl border border-[#4A5C6A]/20 space-y-1">
                    <span className="text-[10px] text-[#9BA8AB] uppercase tracking-wider font-semibold">
                      Spoken Hook:
                    </span>
                    <p className="text-xs text-[#CCD0CF] italic leading-relaxed">&ldquo;{item.hook}&rdquo;</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-[#9BA8AB] uppercase tracking-wider font-semibold">
                      Thumbnail Packaging:
                    </span>
                    <p className="text-xs text-[#9BA8AB]">{item.thumbnail.visual}</p>
                    <span className="inline-block text-[11px] font-bold text-white bg-black/40 px-2 py-0.5 rounded border border-white/10 mt-1">
                      Text: &ldquo;{item.thumbnail.overlay}&rdquo;
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#4A5C6A]/20">
                  <span className="text-xs text-[#9BA8AB]">{item.effort} Effort</span>
                  <a
                    href={`/reels?topic=${encodeURIComponent(item.title)}`}
                    className="text-xs font-medium text-[#FF69B4] hover:underline"
                  >
                    Build Reel Script →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
