"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, CommentToContentResponse, FollowupContentIdea } from "@/types";
import {
  MessageSquareShare,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Video,
  FileText,
  Lightbulb,
} from "lucide-react";

export function CommentToContentStudio() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    searchParams.get("projectId") || ""
  );

  const [comment, setComment] = useState(
    searchParams.get("comment") ||
      "How do you calibrate the analog sensor without expensive gas canisters?"
  );
  const [platform, setPlatform] = useState("Instagram");
  const [formatType, setFormatType] = useState("Short-form Video");
  const [tone, setTone] = useState("Educational");
  const [creatorContext, setCreatorContext] = useState("Hardware & Embedded Engineering");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CommentToContentResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.getProjects();
        setProjects(data);
        if (!selectedProjectId && data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err: any) {
        console.error("Failed to load projects", err);
      }
    }
    loadProjects();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError("Please select or create a project first.");
      return;
    }
    if (!comment.trim()) {
      setError("Please enter the comment to transform.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await api.request<CommentToContentResponse>("/api/v1/tools/comment-to-content/generate", {
        method: "POST",
        body: JSON.stringify({
          project_id: selectedProjectId,
          comment: comment.trim(),
          platform,
          format_type: formatType,
          tone,
          creator_context: creatorContext.trim() || undefined,
        }),
      });

      setResult(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to transform comment into content.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
            <MessageSquareShare className="w-4 h-4 text-purple-400" />
            Comment Transformation Parameters
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Project Workspace
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Audience Comment to Answer *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="e.g. Can you explain how you handled the 3.3V power regulator?"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Target Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="X">X / Twitter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Format Type
                </label>
                <select
                  value={formatType}
                  onChange={(e) => setFormatType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Short-form Video">Short-form Video</option>
                  <option value="7-Slide Carousel">7-Slide Carousel</option>
                  <option value="High-Density Post">High-Density Post</option>
                  <option value="FAQ Breakdown">FAQ Breakdown</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Creator / Brand Context (optional)
              </label>
              <input
                type="text"
                value={creatorContext}
                onChange={(e) => setCreatorContext(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-all duration-200 shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Generating Follow-up Post...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Transform into Content Concepts
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Output Panel */}
      <div className="lg:col-span-7 space-y-4">
        {result ? (
          <div className="space-y-4">
            <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-4">
              <div className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Strategic Follow-up Blueprint
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.strategic_summary}
              </p>
            </div>

            <div className="space-y-4">
              {result.ideas.map((idea, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-800/40 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                        {idea.format} • {idea.angle}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5">{idea.title}</h3>
                    </div>
                    <button
                      onClick={() => handleCopy(idea.hook + "\n\n" + idea.caption_draft, idx)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Copy Post</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Hook */}
                  <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg">
                    <span className="text-[10px] text-amber-400 font-semibold block mb-0.5">
                      REPLY HOOK
                    </span>
                    <p className="text-xs text-white font-medium">"{idea.hook}"</p>
                  </div>

                  {/* Talking points */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                      KEY TALKING POINTS
                    </span>
                    <ul className="space-y-1">
                      {idea.key_talking_points.map((pt, pIdx) => (
                        <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Closing CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <span className="text-slate-400">
                      CTA: <span className="text-white font-medium">{idea.call_to_action}</span>
                    </span>
                    <Link
                      href={`/tools/reel-script-builder?projectId=${selectedProjectId}&concept=${encodeURIComponent(
                        idea.title
                      )}`}
                      className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      Build Full Script <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-12 text-center text-slate-500 space-y-3">
            <MessageSquareShare className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-slate-400">No Content Generated</h3>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              Provide an audience comment on the left to transform it into complete videos, carousels, and follow-up posts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
