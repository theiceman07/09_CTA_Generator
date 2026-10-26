'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface ReelScript {
  hook: { timing: string; spoken: string; visual: string };
  body: Array<{ timing: string; spoken: string; visual: string }>;
  cta: { timing: string; spoken: string; visual: string };
  musicRecommendation: string;
}

function ReelScriptBuilderInner() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic') || '';

  const [topic, setTopic] = useState(initialTopic);
  const [tone, setTone] = useState('High Energy');
  const [duration, setDuration] = useState('30-60');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<ReelScript | null>(null);

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/agents/generate-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone, duration }),
      });
      const data = await res.json();
      if (data.script) {
        setScript(data.script);
      }
    } catch {
      // Mock fallback
      setScript({
        hook: {
          timing: '00:00 - 00:04',
          spoken: `If you are trying to learn ${topic}, stop doing it the hard way.`,
          visual: 'Fast zoom-in to camera with bold red warning text overlay.',
        },
        body: [
          {
            timing: '00:04 - 00:18',
            spoken: `Most people spend hours on generic tutorials. Instead, focus entirely on these two high-leverage frameworks.`,
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
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#FF69B4] uppercase tracking-wider">
          <span>Branch 05</span>
          <span>•</span>
          <span>Scriptwriting Studio</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mt-1">Reel Script Builder</h1>
        <p className="text-[#9BA8AB] mt-2">
          Turn any idea into a structured 30–60 second short-form video script with precise timing, spoken audio lines, and B-roll visual directions.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleGenerate}
        className="bg-[#11212D]/60 backdrop-blur-xl border border-[#4A5C6A]/40 rounded-2xl p-6 shadow-2xl space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#CCD0CF]">Video Topic / Idea *</label>
          <input
            type="text"
            required
            placeholder="e.g. How to use LangGraph with Next.js in 45 seconds"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white placeholder:text-[#4A5C6A] focus:outline-none focus:border-[#FF69B4] transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CCD0CF]">Tone Profile</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF69B4] transition"
            >
              <option value="High Energy">High Energy & Direct</option>
              <option value="Educational">Educational & Calm</option>
              <option value="Storytelling">Storytelling & Suspenseful</option>
              <option value="Contrarian">Contrarian & Critical</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CCD0CF]">Target Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF69B4] transition"
            >
              <option value="30-45">30 – 45 seconds (Fast Paced)</option>
              <option value="45-60">45 – 60 seconds (Standard Reel)</option>
              <option value="60-90">60 – 90 seconds (Deep Dive)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF69B4] to-[#C24366] text-white font-semibold shadow-lg shadow-[#FF69B4]/20 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Structuring Script with Gemini...' : 'Build Reel Script →'}
          </button>
        </div>
      </form>

      {/* Script Output */}
      {script && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Production Script Breakdown</h2>
            <button
              onClick={() => {
                const fullText = `HOOK (${script.hook.timing}):\nSpoken: "${script.hook.spoken}"\nVisual: ${script.hook.visual}\n\nBODY:\n${script.body.map((b) => `${b.timing} - Spoken: "${b.spoken}" | Visual: ${b.visual}`).join('\n')}\n\nCTA (${script.cta.timing}):\nSpoken: "${script.cta.spoken}"\nVisual: ${script.cta.visual}`;
                navigator.clipboard.writeText(fullText);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#253745] hover:bg-[#4A5C6A] text-xs text-white transition border border-[#4A5C6A]/40"
            >
              Copy Full Teleprompter Script
            </button>
          </div>

          <div className="bg-[#11212D]/50 border border-[#4A5C6A]/30 rounded-2xl p-6 space-y-6 shadow-xl">
            {/* Hook Beat */}
            <div className="border-l-4 border-[#FF69B4] pl-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF69B4]">
                  Beat 1: The Hook ({script.hook.timing})
                </span>
              </div>
              <p className="text-base text-white font-medium leading-relaxed">&ldquo;{script.hook.spoken}&rdquo;</p>
              <div className="text-xs text-[#9BA8AB] bg-[#06141B]/40 p-2.5 rounded-lg border border-[#4A5C6A]/20">
                <span className="font-semibold text-[#CCD0CF]">Visual Direction:</span> {script.hook.visual}
              </div>
            </div>

            {/* Body Beats */}
            {script.body.map((beat, i) => (
              <div key={i} className="border-l-4 border-[#243A66] pl-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9BA8AB]">
                    Beat {i + 2}: Core Value ({beat.timing})
                  </span>
                </div>
                <p className="text-sm text-[#CCD0CF] leading-relaxed">&ldquo;{beat.spoken}&rdquo;</p>
                <div className="text-xs text-[#9BA8AB] bg-[#06141B]/40 p-2.5 rounded-lg border border-[#4A5C6A]/20">
                  <span className="font-semibold text-[#CCD0CF]">Visual Direction:</span> {beat.visual}
                </div>
              </div>
            ))}

            {/* CTA Beat */}
            <div className="border-l-4 border-emerald-400 pl-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Final Beat: Call To Action ({script.cta.timing})
                </span>
              </div>
              <p className="text-sm text-white font-medium leading-relaxed">&ldquo;{script.cta.spoken}&rdquo;</p>
              <div className="text-xs text-[#9BA8AB] bg-[#06141B]/40 p-2.5 rounded-lg border border-[#4A5C6A]/20">
                <span className="font-semibold text-[#CCD0CF]">Visual Direction:</span> {script.cta.visual}
              </div>
            </div>

            {/* Audio suggestion */}
            <div className="pt-4 border-t border-[#4A5C6A]/20 flex items-center space-x-3 text-xs text-[#9BA8AB]">
              <span className="font-semibold text-white">Audio / Music:</span>
              <span>{script.musicRecommendation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReelScriptBuilderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-white">Loading Script Studio...</div>}>
      <ReelScriptBuilderInner />
    </Suspense>
  );
}
