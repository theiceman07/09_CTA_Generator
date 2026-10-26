'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PlanSection {
  title: string;
  claims: Array<{
    text: string;
    citationIds: string[];
  }>;
}

export default function CommandCenterPage() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<{ sections: PlanSection[] } | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'actions'>('plan');

  const suggestions = [
    'Why 90% of AI startups fail within their first 12 months',
    'How to automate your entire YouTube & Instagram workflow using LangGraph',
    '5 High-income skills that cannot be replaced by AI in 2026',
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan);
      }
    } catch (err) {
      console.error('Plan generation failed:', err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero & Pipeline Stepper */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 mb-1">
              <span>CONTENTYOU ENGINE</span>
              <span>•</span>
              <span className="text-emerald-400">ACTIVE PIPELINE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Autonomous Content Command Center
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Turn a single core premise into verified research, production-ready video scripts, 3 Instagram Reels, and cross-platform publishing assets.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono bg-zinc-900/80 border border-white/[0.08] px-3 py-2 rounded-lg self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-zinc-300">22 Agents Ready</span>
          </div>
        </div>

        {/* 4-Step Interactive Workflow Pipeline Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { step: '01', title: 'Idea & Research', desc: 'Validates trends with Google citations', active: true },
            { step: '02', title: 'Script Studio', desc: 'Hooks, body narrative, teleprompter', active: !!plan },
            { step: '03', title: 'Video & Visuals', desc: 'Thumbnails, B-roll, camera directions', active: !!plan },
            { step: '04', title: 'Multi-Platform', desc: '3x Reels, X thread, publishing calendar', active: !!plan },
          ].map((s, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                s.active
                  ? 'bg-indigo-950/20 border-indigo-500/30 text-white'
                  : 'bg-zinc-900/40 border-white/[0.04] text-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className={s.active ? 'text-indigo-400 font-semibold' : 'text-zinc-600'}>
                  STEP {s.step}
                </span>
                {s.active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
              </div>
              <p className="text-xs font-semibold text-zinc-200">{s.title}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Execution Box */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative bg-[#0D0F17] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Core Premise / Target Concept
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              Powered by Gemini 2.5 Flash
            </span>
          </div>

          <textarea
            rows={3}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Type your idea... e.g. How to use LangGraph to build multi-agent autonomous content pipelines for YouTube and Instagram"
            className="w-full bg-zinc-950/60 border border-white/[0.06] rounded-xl p-4 text-sm md:text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/80 transition resize-none"
          />

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-zinc-500">Try these:</span>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIdea(s)}
                className="text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-2.5 py-1 rounded-md border border-white/[0.06] transition"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <span>{loading ? 'Agents researching & synthesizing plan...' : 'Ready for generation'}</span>
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={loading || !idea.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs md:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Running Pipeline...
                </>
              ) : (
                <>
                  Run Autonomous Pipeline →
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Plan Results Section */}
      {plan && (
        <div className="bg-[#0D0F17] border border-white/[0.08] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <span>STAGE 1 COMPLETE</span>
                <span>•</span>
                <span>VERIFIABLE PLAN READY</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Multi-Stage Content Architecture</h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const markdown = plan.sections
                    .map(
                      (s) =>
                        `## ${s.title}\n` +
                        s.claims.map((c) => `- ${c.text} (Citations: ${c.citationIds.join(', ')})`).join('\n')
                    )
                    .join('\n\n');
                  navigator.clipboard.writeText(markdown);
                }}
                className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-white/[0.08] transition"
              >
                Copy Markdown
              </button>

              <Link
                href={`/reels?topic=${encodeURIComponent(idea)}`}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                Pass to Script Studio →
              </Link>
            </div>
          </div>

          {/* Section Breakdown Cards */}
          <div className="space-y-6">
            {plan.sections.map((section, idx) => (
              <div key={idx} className="bg-zinc-950/60 border border-white/[0.04] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    {section.title}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {section.claims.length} Actionable Beats
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {section.claims.map((claim, cidx) => (
                    <div key={cidx} className="flex items-start space-x-3 text-xs leading-relaxed group">
                      <span className="text-indigo-400 font-mono mt-0.5">•</span>
                      <div className="flex-1 space-y-1">
                        <p className="text-zinc-300 group-hover:text-white transition">{claim.text}</p>
                        {claim.citationIds && claim.citationIds.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {claim.citationIds.map((cite, k) => (
                              <span
                                key={k}
                                className="text-[9px] font-mono bg-zinc-900 text-zinc-500 px-1.5 py-0.2 rounded border border-white/[0.04]"
                              >
                                src: {cite}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Agent Launch Dock */}
      <div className="space-y-4 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono">
            Specialized Creator Suite
          </h2>
          <span className="text-xs text-zinc-500">Direct Tool Launch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Hook Generator',
              badge: 'Branch 03',
              desc: '10 viral psychological hook styles for any platform',
              href: '/hooks',
              color: 'text-indigo-400',
            },
            {
              title: 'Reel Script Studio',
              badge: 'Branch 05',
              desc: '30–60s video breakdown with timed beats & teleprompter',
              href: '/reels',
              color: 'text-pink-400',
            },
            {
              title: 'Idea Generator',
              badge: 'Branch 01',
              desc: '10 high-CTR video concepts with thumbnail directions',
              href: '/ideas',
              color: 'text-purple-400',
            },
            {
              title: 'Second Brain',
              badge: 'Branch 19',
              desc: 'Semantic recall across all previous scripts & notes',
              href: '/brain',
              color: 'text-emerald-400',
            },
          ].map((agent, i) => (
            <Link
              key={i}
              href={agent.href}
              className="bg-[#0D0F17] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-4 transition-all duration-200 group flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-semibold ${agent.color}`}>
                    {agent.badge}
                  </span>
                  <span className="text-zinc-600 group-hover:text-zinc-400 transition">→</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-1 group-hover:text-indigo-300 transition">
                  {agent.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {agent.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
