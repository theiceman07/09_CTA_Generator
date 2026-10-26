'use client';

import React, { useState } from 'react';

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

export default function HookGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Bold');
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState<Array<{ style: string; hook: string }> | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/agents/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience, platform, tone }),
      });
      const data = await res.json();
      if (data.hooks) {
        setHooks(data.hooks);
      } else {
        // Fallback demo hooks if no API key is configured yet
        setHooks(
          REQUIRED_STYLES.map((style) => ({
            style,
            hook: `[${style} Hook for ${platform}] Stop ignoring ${topic} if you are a ${audience || 'creator'}! Here is why...`,
          }))
        );
      }
    } catch {
      // Offline fallback
      setHooks(
        REQUIRED_STYLES.map((style) => ({
          style,
          hook: `[${style} Hook for ${platform}] Stop ignoring ${topic} if you are a ${audience || 'creator'}! Here is why...`,
        }))
      );
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#FF69B4] uppercase tracking-wider">
          <span>Branch 03</span>
          <span>•</span>
          <span>Copywriting Suite</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mt-1">Hook Generator</h1>
        <p className="text-[#9BA8AB] mt-2">
          Generate 10 high-converting hooks across psychological styles (Curiosity, Contrarian, Urgency) tailored for your platform and audience.
        </p>
      </div>

      {/* Input Form Card */}
      <form
        onSubmit={handleGenerate}
        className="bg-[#11212D]/60 backdrop-blur-xl border border-[#4A5C6A]/40 rounded-2xl p-6 shadow-2xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CCD0CF]">Topic or Idea *</label>
            <input
              type="text"
              required
              placeholder="e.g. Why most creators burn out within 6 months"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white placeholder:text-[#4A5C6A] focus:outline-none focus:border-[#FF69B4] transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CCD0CF]">Target Audience</label>
            <input
              type="text"
              placeholder="e.g. Aspiring digital creators, freelance videographers"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white placeholder:text-[#4A5C6A] focus:outline-none focus:border-[#FF69B4] transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CCD0CF]">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF69B4] transition"
            >
              <option value="Instagram">Instagram (Reels / Carousel)</option>
              <option value="YouTube">YouTube (Shorts / Long-form)</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="X/Twitter">X / Twitter</option>
              <option value="TikTok">TikTok</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CCD0CF]">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF69B4] transition"
            >
              <option value="Bold">Bold</option>
              <option value="Professional">Professional</option>
              <option value="Funny">Funny / Satirical</option>
              <option value="Educational">Educational</option>
              <option value="Emotional">Emotional / Relatable</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF69B4] to-[#C24366] text-white font-semibold shadow-lg shadow-[#FF69B4]/20 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Crafting 10 Hooks with Gemini...' : 'Generate 10 Hooks →'}
          </button>
        </div>
      </form>

      {/* Generated Hooks Output */}
      {hooks && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Generated Hook Angles ({hooks.length})</h2>
            <span className="text-xs text-[#9BA8AB]">Click any hook to copy or send to Script Studio</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hooks.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#11212D]/40 border border-[#4A5C6A]/30 rounded-xl p-4 hover:border-[#FF69B4]/50 transition group flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#253745] text-[#FF69B4] border border-[#FF69B4]/20">
                    {item.style}
                  </span>
                  <p className="text-sm text-[#CCD0CF] mt-2 font-medium leading-relaxed group-hover:text-white transition">
                    &ldquo;{item.hook}&rdquo;
                  </p>
                </div>
                <div className="flex justify-end space-x-2 pt-2 border-t border-[#4A5C6A]/20">
                  <button
                    onClick={() => navigator.clipboard.writeText(item.hook)}
                    className="text-xs text-[#9BA8AB] hover:text-white transition px-2 py-1 rounded bg-[#06141B]/40"
                  >
                    Copy Hook
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
