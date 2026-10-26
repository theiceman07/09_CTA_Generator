'use client';

import React, { useState } from 'react';

interface ThumbnailConcept {
  conceptName: string;
  visualComposition: string;
  overlayText: string;
  colorContrastSuggestion: string;
  emotionalTrigger: string;
}

export default function ThumbnailIdeatorPage() {
  const [videoTitle, setVideoTitle] = useState('');
  const [niche, setNiche] = useState('Tech');
  const [loading, setLoading] = useState(false);
  const [concepts, setConcepts] = useState<ThumbnailConcept[] | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) return;

    setLoading(true);
    // Simulation / Gemini generation
    setTimeout(() => {
      setConcepts([
        {
          conceptName: 'Curiosity Shock',
          visualComposition: 'Close-up of face looking stunned at a glowing laptop screen with blurred code in background.',
          overlayText: 'DON\'T DO THIS',
          colorContrastSuggestion: 'Deep navy background with neon crimson and electric yellow text.',
          emotionalTrigger: 'Fear of missing out and avoiding a critical industry trap.',
        },
        {
          conceptName: 'Before vs. After Transformation',
          visualComposition: 'Split frame: Left side messy red-tinted timeline with 10 tabs; Right side sleek green 1-click dashboard.',
          overlayText: '10X FASTER',
          colorContrastSuggestion: 'Split dark red and vibrant emerald green for maximum timeline feed contrast.',
          emotionalTrigger: 'Desire for efficiency and professional mastery.',
        },
        {
          conceptName: 'The Secret Artifact',
          visualComposition: 'Holding a glowing USB drive or folder labeled "TOP SECRET" with blurred document icons floating.',
          overlayText: 'THE CHEAT CODE',
          colorContrastSuggestion: 'High-contrast monochrome subject with vibrant glowing cyan accent lighting.',
          emotionalTrigger: 'Exclusivity and insider knowledge.',
        },
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#FF69B4] uppercase tracking-wider">
          <span>Branch 07</span>
          <span>•</span>
          <span>Visual & Production Suite</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mt-1">Thumbnail Ideator</h1>
        <p className="text-[#9BA8AB] mt-2">
          Convert any video title or concept into high-CTR visual packaging directions, text overlays, and composition breakdowns.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleGenerate}
        className="bg-[#11212D]/60 backdrop-blur-xl border border-[#4A5C6A]/40 rounded-2xl p-6 shadow-2xl space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#CCD0CF]">Video Title or Concept *</label>
          <input
            type="text"
            required
            placeholder="e.g. How I Automated My Entire YouTube Channel Using AI Agents"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-4 py-3 text-white placeholder:text-[#4A5C6A] focus:outline-none focus:border-[#FF69B4] transition"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF69B4] to-[#C24366] text-white font-semibold shadow-lg shadow-[#FF69B4]/20 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Designing Visual Concepts...' : 'Generate 3 Thumbnail Concepts →'}
          </button>
        </div>
      </form>

      {/* Output */}
      {concepts && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Visual Thumbnail Directions ({concepts.length})</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {concepts.map((c, idx) => (
              <div
                key={idx}
                className="bg-[#11212D]/40 border border-[#4A5C6A]/30 rounded-2xl p-5 hover:border-[#FF69B4]/50 transition group flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#253745] text-[#FF69B4] border border-[#FF69B4]/20">
                    {c.conceptName}
                  </span>

                  <div className="bg-[#06141B]/70 aspect-video rounded-xl border border-[#4A5C6A]/30 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group-hover:border-[#FF69B4]/40 transition">
                    <span className="text-xl font-black text-white tracking-widest drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                      &ldquo;{c.overlayText}&rdquo;
                    </span>
                    <span className="text-[10px] text-[#9BA8AB] mt-2 font-mono">Max 3 Words Bold</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-[#CCD0CF] uppercase tracking-wider font-semibold">
                      Composition:
                    </span>
                    <p className="text-xs text-[#9BA8AB] leading-relaxed">{c.visualComposition}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-[#CCD0CF] uppercase tracking-wider font-semibold">
                      Colors & Contrast:
                    </span>
                    <p className="text-xs text-[#9BA8AB] leading-relaxed">{c.colorContrastSuggestion}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#4A5C6A]/20 text-[11px] text-[#FF69B4]">
                  Trigger: {c.emotionalTrigger}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
