"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, ScreenplayWorkspaceResponse } from "@/types";
import {
  Film,
  Sparkles,
  Copy,
  Check,
  FolderKanban,
  AlertCircle,
  Users,
  ListOrdered,
  FileText,
  Video,
} from "lucide-react";

const SAMPLE_INPUT = {
  premise:
    "An isolated hardware engineer calibrating autonomous gas monitoring nodes in a remote valley detects an unrecorded subterranean acoustic vibration. When her company orders the nodes wiped, she must build a covert edge mesh to prove an imminent seismic disaster before communication lines are severed.",
  genre: "Sci-Fi / Tech Thriller",
  target_format: "Short Film (10-15 mins)",
  tone: "Suspenseful & High-Stakes",
};

const GENRES = ["Sci-Fi / Tech Thriller", "Cyberpunk", "Drama", "Documentary Narrative", "Comedy / Satire"];
const FORMATS = ["Short Film (10-15 mins)", "Episodic Pilot (25-30 mins)", "Feature Teaser Scene"];

export function ScreenplayWorkspaceStudio({ initialProjectId }: { initialProjectId?: string }) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [premise, setPremise] = useState(searchParams.get("premise") || "");
  const [genre, setGenre] = useState("Sci-Fi / Tech Thriller");
  const [format, setFormat] = useState("Short Film (10-15 mins)");
  const [tone, setTone] = useState("Suspenseful & High-Stakes");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScreenplayWorkspaceResponse | null>(null);
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

  const loadSample = () => {
    setPremise(SAMPLE_INPUT.premise);
    setGenre(SAMPLE_INPUT.genre);
    setFormat(SAMPLE_INPUT.target_format);
    setTone(SAMPLE_INPUT.tone);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDevelop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !premise.trim()) {
      setError("Please select a project and provide a story premise.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.request<ScreenplayWorkspaceResponse>(
        "/api/v1/tools/screenplay-workspace/develop",
        {
          method: "POST",
          body: JSON.stringify({
            project_id: selectedProjectId,
            premise: premise.trim(),
            genre,
            target_format: format,
            tone,
          }),
        }
      );

      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Failed to develop screenplay.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Film className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">AI Screenplay Workspace</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Narrative story architecture: character ensemble bibles, structural beat sheets, formatted industry scene scripts, and camera blocking notes.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs font-medium transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Thriller Premise
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Screenplay Development Failed</p>
            <p className="text-xs opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <form onSubmit={handleDevelop} className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-slate-400" /> Project Scope
                  </span>
                  <Link href="/projects" className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline">
                    + New
                  </Link>
                </span>
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                required
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Story Premise / Dramatic Concept
              </label>
              <textarea
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                placeholder="What is the story about? Who is the protagonist and what is at stake?"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Dramatic Tone
              </label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !premise.trim() || !selectedProjectId}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Developing Characters & Script...
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" /> Develop Screenplay
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Title & Logline */}
              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                    {result.genre} • {result.title}
                  </span>
                  <button
                    onClick={() => handleCopy(result.scene_script, "script")}
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKey === "script" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Script
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Script
                      </>
                    )}
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-white">{result.title}</h3>
                <p className="text-xs text-slate-300 italic">Logline: "{result.logline}"</p>
              </div>

              {/* Characters */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-red-400" /> Character Ensemble
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.character_profiles.map((char, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-1"
                    >
                      <div className="font-semibold text-xs text-white">
                        {char.name}{" "}
                        <span className="font-normal text-slate-400">({char.role})</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        <span className="font-medium text-slate-300">Objective:</span> {char.motivation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formatted Script */}
              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-red-400" /> Formatted Scene Script
                </span>
                <pre className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {result.scene_script}
                </pre>
              </div>

              {/* Director Notes */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 space-y-1">
                <span className="font-semibold uppercase tracking-wider text-white">
                  🎬 Director & Blocking Notes:
                </span>
                <p className="text-slate-400">{result.director_notes}</p>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-3">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No Screenplay Developed Yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-1">
                Enter your story concept on the left to develop character arcs, 3-act beat sheets, and formatted scenes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
