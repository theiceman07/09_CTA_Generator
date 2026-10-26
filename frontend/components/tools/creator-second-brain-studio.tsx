"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import {
  Project,
  SecondBrainItemResponse,
  SecondBrainQueryResponse,
} from "@/types";
import {
  Brain,
  Sparkles,
  Search,
  Plus,
  Copy,
  Check,
  FolderKanban,
  Tag,
  BookOpen,
  ArrowRight,
  Lightbulb,
  Layers,
  AlertCircle,
} from "lucide-react";

const CATEGORIES = ["framework", "story", "idea", "research", "quote", "statistic"];

const SAMPLE_NOTE = {
  title: "ESP32 ADC Linearity & Noise Workaround",
  content:
    "The internal ADC on ESP32 exhibits significant non-linearity below 0.1V and above 2.8V. When sampling delicate analog gas sensors, always use multislope piecewise calibration curves in firmware, or offload to an external I2C ADS1115 ADC.",
  category: "framework",
  tags: "esp32, adc, sensors, hardware",
  source_ref: "Hardware Lab Bench Notes #42",
};

export function CreatorSecondBrainStudio({ initialProjectId }: { initialProjectId?: string }) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [activeTab, setActiveTab] = useState<"query" | "capture" | "repository">("query");

  // Query state
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState<SecondBrainQueryResponse | null>(null);

  // Capture state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState("framework");
  const [noteTags, setNoteTags] = useState("");
  const [noteSource, setNoteSource] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Items list
  const [items, setItems] = useState<SecondBrainItemResponse[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.getProjects();
        setProjects(data || []);
        if (!selectedProjectId && data && data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err: any) {
        console.error("Failed to load projects", err);
      }
    }
    loadProjects();
  }, [selectedProjectId]);

  const fetchItems = async () => {
    if (!selectedProjectId) return;
    setIsLoadingItems(true);
    try {
      const q = searchFilter ? `&query=${encodeURIComponent(searchFilter)}` : "";
      const cat = categoryFilter ? `&category=${encodeURIComponent(categoryFilter)}` : "";
      const data = await api.request<SecondBrainItemResponse[]>(
        `/api/v1/tools/second-brain/items?project_id=${selectedProjectId}${q}${cat}`
      );
      setItems(data || []);
    } catch (err: any) {
      console.error("Failed to load second brain items", err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchItems();
    }
  }, [selectedProjectId, searchFilter, categoryFilter]);

  const loadSample = () => {
    setNoteTitle(SAMPLE_NOTE.title);
    setNoteContent(SAMPLE_NOTE.content);
    setNoteCategory(SAMPLE_NOTE.category);
    setNoteTags(SAMPLE_NOTE.tags);
    setNoteSource(SAMPLE_NOTE.source_ref);
    setActiveTab("capture");
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !noteTitle.trim() || !noteContent.trim()) return;

    setIsSaving(true);
    setError(null);
    try {
      const tagsArray = noteTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await api.request("/api/v1/tools/second-brain/items", {
        method: "POST",
        body: JSON.stringify({
          project_id: selectedProjectId,
          title: noteTitle.trim(),
          content: noteContent.trim(),
          category: noteCategory,
          tags: tagsArray,
          source_ref: noteSource.trim() || undefined,
        }),
      });

      setNoteTitle("");
      setNoteContent("");
      setNoteTags("");
      setNoteSource("");
      fetchItems();
      setActiveTab("repository");
    } catch (err: any) {
      setError(err?.message || "Failed to save note to Second Brain.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !query.trim()) return;

    setIsQuerying(true);
    setError(null);
    try {
      const data = await api.request<SecondBrainQueryResponse>(
        "/api/v1/tools/second-brain/query",
        {
          method: "POST",
          body: JSON.stringify({
            project_id: selectedProjectId,
            query: query.trim(),
            category_filter: categoryFilter || undefined,
          }),
        }
      );
      setQueryResult(data);
    } catch (err: any) {
      setError(err?.message || "Failed to query Creator Second Brain.");
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Brain className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">Creator Second Brain</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Persistent associative memory workspace. Store your engineering principles, frameworks, and notes, and synthesize grounded answers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="rounded-xl border border-slate-700/80 bg-slate-900 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                📁 {p.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={loadSample}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-medium transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Sample Memory
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab("query")}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === "query"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          🔍 Synthesize & Ask Brain
        </button>
        <button
          onClick={() => setActiveTab("capture")}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === "capture"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          ✍️ Record New Memory
        </button>
        <button
          onClick={() => setActiveTab("repository")}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === "repository"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          📚 Memory Vault ({items.length})
        </button>
      </div>

      {/* TAB 1: Query Brain */}
      {activeTab === "query" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleQuery} className="lg:col-span-5 space-y-6">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-slate-400" /> Search / Synthesis Query
                  </span>
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., How do my notes recommend handling ESP32 ADC non-linearity?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Optional Category Filter
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isQuerying || !query.trim() || !selectedProjectId}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isQuerying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Synthesizing Memories...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" /> Query Second Brain
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="lg:col-span-7 space-y-6">
            {queryResult ? (
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                {/* Direct Answer */}
                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5" /> Grounded Brain Synthesis
                    </span>
                    <button
                      onClick={() => handleCopy(queryResult.direct_answer, "brain-answer")}
                      className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedKey === "brain-answer" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Answer
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {queryResult.direct_answer}
                  </p>
                </div>

                {/* Connected Themes */}
                <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Associative Connected Themes
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {queryResult.connected_themes.map((th, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      >
                        {th}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Content Hooks */}
                <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> Hooks Derived from Memory
                  </span>
                  <div className="space-y-2">
                    {queryResult.suggested_content_hooks.map((hk, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-sm flex items-center justify-between gap-3"
                      >
                        <span className="text-xs text-slate-300">{hk}</span>
                        <Link
                          href={`/tools/reel-script-builder?hook=${encodeURIComponent(hk)}&projectId=${selectedProjectId}`}
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline shrink-0"
                        >
                          Build Script <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white">Ask Your Second Brain</h3>
                <p className="text-sm text-slate-400 max-w-sm mt-1">
                  Query stored knowledge notes to extract connections, answers, and content hooks.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Capture New Memory */}
      {activeTab === "capture" && (
        <form onSubmit={handleSaveNote} className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Record Knowledge Item
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Note / Principle Title
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="e.g. ESP32 Analog Noise Filter"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Knowledge Body / Framework / Takeaway
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Detail the technical truth, failure lesson, or reproducible takeaway..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Category
                </label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  placeholder="hardware, esp32, telemetry"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Source Reference or Lab URL (Optional)
              </label>
              <input
                type="text"
                value={noteSource}
                onChange={(e) => setNoteSource(e.target.value)}
                placeholder="Lab bench journal, paper DOI, or book reference"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving || !noteTitle.trim() || !noteContent.trim() || !selectedProjectId}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving to Vault...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Save to Second Brain
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Vault Repository */}
      {activeTab === "repository" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search notes by keyword or tag..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-700/80 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl border border-slate-800 bg-[#0f172a] space-y-3 flex flex-col justify-between hover:border-slate-700/80 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm mt-2 text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.content}
                    </p>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {item.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => handleCopy(item.content, item.id)}
                      className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedKey === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                    <Link
                      href={`/tools/hook-generator?content=${encodeURIComponent(item.content)}&projectId=${selectedProjectId}`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1"
                    >
                      Generate Hook <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-dashed border-slate-800 text-center bg-slate-900/30 space-y-2">
              <p className="text-sm font-medium text-white">No notes found matching your filter.</p>
              <p className="text-xs text-slate-400">
                Click "Record New Memory" above to document principles and takeaways.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
