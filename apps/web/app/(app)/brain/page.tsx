'use client';

import React, { useState } from 'react';

interface KnowledgeItem {
  id: string;
  title: string;
  type: string;
  similarity: number;
  preview: string;
  suggestedAction: string;
}

export default function CreatorSecondBrainPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<KnowledgeItem[] | null>(null);

  const sampleQueries = [
    'Have I talked about LangChain agent checkpointers before?',
    'What old scripts can be turned into a 30s Instagram reel?',
    'What was my highest performing hook style last month?',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setResults([
        {
          id: 'kb_01',
          title: 'Deep Dive: State Management in Autonomous LLM Workflows',
          type: 'Past YouTube Script (12 mins)',
          similarity: 96,
          preview:
            'In section 3 of this video, you explained how state snapshots allow human-in-the-loop approvals before content is dispatched to social channels.',
          suggestedAction: 'Extract Section 3 into a 45s Reel script using Branch 05.',
        },
        {
          id: 'kb_02',
          title: 'LinkedIn Post: 5 Mistakes Creators Make When Automating',
          type: 'Published LinkedIn Post',
          similarity: 88,
          preview:
            'Point #2 discussed rate limits on LLMs and why queuing requests prevents 429 exceptions.',
          suggestedAction: 'Turn into a carousel post for Instagram.',
        },
      ]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#FF69B4] uppercase tracking-wider">
          <span>Branch 19</span>
          <span>•</span>
          <span>Central Knowledge Engine</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mt-1">Creator Second Brain</h1>
        <p className="text-[#9BA8AB] mt-2">
          Ask semantic questions across everything you have ever written, drafted, or published. Retrieve past angles and find reuse opportunities instantly.
        </p>
      </div>

      {/* Semantic Search Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-[#11212D]/60 backdrop-blur-xl border border-[#4A5C6A]/40 rounded-2xl p-6 shadow-2xl space-y-4"
      >
        <div className="relative">
          <input
            type="text"
            required
            placeholder="Ask your Second Brain: 'Have I talked about this before?' or 'What can become a reel?'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#06141B]/80 border border-[#4A5C6A]/50 rounded-xl px-5 py-4 text-white placeholder:text-[#4A5C6A] text-lg focus:outline-none focus:border-[#FF69B4] transition shadow-inner"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 px-6 rounded-lg bg-gradient-to-r from-[#FF69B4] to-[#C24366] text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Searching Brain...' : 'Recall'}
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-2 pt-2 items-center">
          <span className="text-xs text-[#9BA8AB] mr-1">Try asking:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(q);
              }}
              className="text-xs bg-[#06141B]/60 hover:bg-[#253745] text-[#CCD0CF] px-3 py-1 rounded-full border border-[#4A5C6A]/30 transition"
            >
              {q}
            </button>
          ))}
        </div>
      </form>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Semantic Memory Hits ({results.length})</h2>

          <div className="space-y-4">
            {results.map((item) => (
              <div
                key={item.id}
                className="bg-[#11212D]/40 border border-[#4A5C6A]/30 rounded-2xl p-6 hover:border-[#FF69B4]/50 transition group space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-[#9BA8AB] uppercase tracking-wider">{item.type}</span>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#FF69B4] transition mt-1">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {item.similarity}% Semantic Match
                  </span>
                </div>

                <p className="text-sm text-[#CCD0CF] leading-relaxed bg-[#06141B]/50 p-4 rounded-xl border border-[#4A5C6A]/20">
                  {item.preview}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2 text-xs text-[#9BA8AB]">
                    <span className="w-2 h-2 rounded-full bg-[#FF69B4]"></span>
                    <span>AI Recommendation: {item.suggestedAction}</span>
                  </div>

                  <a
                    href={`/reels?topic=${encodeURIComponent(item.title)}`}
                    className="text-xs font-semibold text-[#FF69B4] hover:underline"
                  >
                    Open in Reel Builder →
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
