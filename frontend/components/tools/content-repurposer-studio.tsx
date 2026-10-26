"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { Project, ContentRepurposerResponse } from "@/types";
import {
  Wand2,
  Copy,
  Check,
  AlertCircle,
  Share2,
  Sparkles,
  RefreshCw,
  FolderKanban,
  Youtube,
  Linkedin,
  Instagram,
  Twitter,
  FileCheck,
} from "lucide-react";

interface ContentRepurposerStudioProps {
  initialProjectId?: string;
  onGenerationComplete?: (res: ContentRepurposerResponse) => void;
}

const SAMPLE_TEXT = `Modern software architectures are increasingly favoring modular monoliths over premature microservices. By enforcing strict domain boundaries and dependency inversion inside a unified codebase, engineering teams eliminate network latency, simplify distributed transactions, and drastically lower deployment friction. Microservices remain valuable for hyperscale teams, but for AI-powered SaaS startups, the speed and maintainability of a modular monolith is unmatched.`;

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-400" },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-400" },
  { id: "x", label: "X (Twitter)", icon: Twitter, color: "text-sky-400" },
  { id: "youtube", label: "YouTube Video", icon: Youtube, color: "text-red-400" },
];

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "educational", label: "Educational" },
  { id: "storytelling", label: "Storytelling" },
  { id: "engaging", label: "Engaging" },
  { id: "casual", label: "Casual" },
];

export function ContentRepurposerStudio({
  initialProjectId,
  onGenerationComplete,
}: ContentRepurposerStudioProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || "");
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "linkedin",
    "instagram",
    "x",
    "youtube",
  ]);
  const [selectedTone, setSelectedTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContentRepurposerResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("linkedin");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load user's projects if not provided or to populate dropdown
  useEffect(() => {
    async function loadProjects() {
      try {
        const list = await api.projects.list();
        setProjects(list);
        if (!selectedProjectId && list.length > 0) {
          setSelectedProjectId(list[0].id);
        }
      } catch (err: any) {
        console.error("Failed to load projects", err);
      }
    }
    loadProjects();
  }, [selectedProjectId]);

  const togglePlatform = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      if (selectedPlatforms.length === 1) return; // Keep at least one
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedProjectId) {
      setError("Please select or create a project first.");
      return;
    }
    if (!content.trim()) {
      setError("Please provide content to repurpose.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError("Please select at least one target platform.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await api.tools.repurposeContent({
        project_id: selectedProjectId,
        content: content.trim(),
        platforms: selectedPlatforms,
        tone: selectedTone,
      });

      setResult(response);
      // Set active tab to the first generated platform
      if (selectedPlatforms.length > 0) {
        setActiveTab(selectedPlatforms[0]);
      }
      if (onGenerationComplete) {
        onGenerationComplete(response);
      }
    } catch (err: any) {
      setError(err.message || "Content generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Input Studio Column */}
      <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Content Repurposer</h2>
              <p className="text-xs text-slate-400">
                Transform any post or article into cross-platform creator assets
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setContent(SAMPLE_TEXT)}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Project Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Target Project *
          </label>
          {projects.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>No projects found. Please create a project first.</span>
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <FolderKanban className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Source Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Source Content *
            </label>
            <span className="text-[11px] text-slate-500">
              {content.length} chars · {content.trim() ? content.trim().split(/\s+/).length : 0} words
            </span>
          </div>
          <textarea
            rows={7}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your blog article, video script, thought leadership notes, or podcast summary here..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Target Platforms Multi-Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Target Platforms (Select Any)
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {PLATFORMS.map((plat) => {
              const Icon = plat.icon;
              const isSelected = selectedPlatforms.includes(plat.id);
              return (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => togglePlatform(plat.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600/15 border-indigo-500 text-white shadow-sm"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-indigo-500/20" : "bg-slate-800"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${plat.color}`} />
                  </div>
                  <span className="flex-1 font-semibold">{plat.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Voice & Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTone(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedTone === t.id
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !content.trim() || !selectedProjectId}
          className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing & Repurposing Content...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Repurpose Across Platforms</span>
            </>
          )}
        </button>
      </div>

      {/* Output / Results Column */}
      <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col min-h-[580px]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Generated Platform Assets</h3>
          </div>
          {result && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Saved to Project</span>
            </div>
          )}
        </div>

        {!result ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-semibold text-slate-300">Ready to Repurpose</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Enter your core content, choose target platforms and tone, then click
              &quot;Repurpose Across Platforms&quot; to generate your campaign assets.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4 pt-4">
            {/* Platform Tabs */}
            <div className="flex border-b border-slate-800 pb-2 gap-2 overflow-x-auto">
              {Object.keys(result.results).map((platformKey) => {
                const platMeta = PLATFORMS.find((p) => p.id === platformKey);
                const Icon = platMeta?.icon || Share2;
                const isActive = activeTab === platformKey;
                return (
                  <button
                    key={platformKey}
                    type="button"
                    onClick={() => setActiveTab(platformKey)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{platMeta?.label || platformKey}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Platform Content Display */}
            <div className="flex-1 bg-slate-900/80 rounded-xl border border-slate-800 p-4 relative overflow-y-auto max-h-[380px]">
              {activeTab === "youtube" && result.results.youtube ? (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-400">Video Title</span>
                    <button
                      onClick={() => handleCopy(result.results.youtube!.title, "yt-title")}
                      className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                      title="Copy Title"
                    >
                      {copiedKey === "yt-title" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {result.results.youtube.title}
                  </p>

                  <div className="flex items-center justify-between pt-2 pb-1 border-b border-slate-800">
                    <span className="font-semibold text-slate-400">Video Description</span>
                    <button
                      onClick={() =>
                        handleCopy(result.results.youtube!.description, "yt-desc")
                      }
                      className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                      title="Copy Description"
                    >
                      {copiedKey === "yt-desc" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {result.results.youtube.description}
                  </p>

                  <div className="pt-2 pb-1 border-b border-slate-800 font-semibold text-slate-400">
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.results.youtube.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 text-[11px] border border-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 pb-1 border-b border-slate-800 font-semibold text-slate-400">
                    Video Outline
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap leading-relaxed font-mono text-[11px]">
                    {result.results.youtube.outline}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {activeTab} Post
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          (result.results as any)[activeTab] || "",
                          activeTab
                        )
                      }
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {copiedKey === activeTab ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-slate-200 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-sans">
                    {(result.results as any)[activeTab] || "No output for this platform."}
                  </div>
                </div>
              )}
            </div>

            {/* Usage Metadata Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-4">
                <span>
                  Tokens:{" "}
                  <strong className="text-slate-400">
                    {result.usage?.total_tokens ?? "Recorded"}
                  </strong>
                </span>
                <span>
                  Gen ID:{" "}
                  <code className="text-slate-400">
                    {result.generation_id.slice(0, 8)}...
                  </code>
                </span>
              </div>
              <span className="text-indigo-400 font-medium">Auto-Synced</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
