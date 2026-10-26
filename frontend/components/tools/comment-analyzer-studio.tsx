"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, CommentAnalyzerResponse } from "@/types";
import {
  MessageSquare,
  Sparkles,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ThumbsUp,
  Quote,
  ShieldAlert,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

const SAMPLE_COMMENTS = [
  "Does this ESP32 methane sensor work with 3.3V battery power, or do you need a step-up converter?",
  "Can you share the wiring schematic and CAD files for the 3D printed housing?",
  "Great project! What detection threshold does it trigger at for safety alerts?",
  "I tried building something similar but had huge issues with sensor drift after 2 weeks in humidity.",
  "How much does the total bill of materials cost including the gas sensor?",
  "Would love to see a tutorial on setting up the MQTT telemetry dashboard next!",
  "Is this safe to use in an actual industrial facility or only for hobbyist monitoring?"
];

export function CommentAnalyzerStudio() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    searchParams.get("projectId") || ""
  );

  const [commentsText, setCommentsText] = useState("");
  const [platform, setPlatform] = useState("YouTube");
  const [contentContext, setContentContext] = useState("ESP32 IoT Methane Monitoring System");
  const [focusArea, setFocusArea] = useState("Comprehensive");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CommentAnalyzerResponse | null>(null);

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

  const handleLoadSample = () => {
    setCommentsText(SAMPLE_COMMENTS.join("\n"));
    setPlatform("YouTube");
    setContentContext("ESP32 IoT Methane Monitoring System");
    setFocusArea("Comprehensive");
    setError(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError("Please select or create a project first.");
      return;
    }
    const parsedComments = commentsText
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c.length > 3);

    if (parsedComments.length === 0) {
      setError("Please enter at least one comment to analyze (one per line).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await api.request<CommentAnalyzerResponse>("/api/v1/tools/comments/analyze", {
        method: "POST",
        body: JSON.stringify({
          project_id: selectedProjectId,
          comments: parsedComments,
          platform,
          content_context: contentContext.trim() || undefined,
          focus_area: focusArea,
        }),
      });

      setResult(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to analyze comments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Form */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              Community Comments Input
            </h2>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              Load Sample Data
            </button>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Project Workspace
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
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
                Paste Comments (one per line) *
              </label>
              <textarea
                value={commentsText}
                onChange={(e) => setCommentsText(e.target.value)}
                rows={7}
                placeholder="Paste comments here, one per line..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="X">X / Twitter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Analysis Focus
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Comprehensive">Comprehensive</option>
                  <option value="Questions Only">Questions Only</option>
                  <option value="Objections & Skepticism">Objections & Skepticism</option>
                  <option value="Content Requests">Content Requests</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Post / Video Context (optional)
              </label>
              <input
                type="text"
                value={contentContext}
                onChange={(e) => setContentContext(e.target.value)}
                placeholder="e.g. Methane Sensor Teardown Video"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
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
              className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-all duration-200 shadow-lg shadow-sky-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Extracting Intelligence...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze Community Comments
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
            {/* Sentiment Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Overall Sentiment
                  </span>
                  <div className="text-base font-bold text-white mt-0.5">
                    {result.overall_sentiment}
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {result.total_comments_analyzed} Comments Analyzed
                </div>
              </div>

              {/* Sentiment Bar */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-slate-950 rounded-full flex overflow-hidden">
                  <div
                    style={{ width: `${result.sentiment_distribution.positive}%` }}
                    className="bg-emerald-500 h-full"
                    title={`Positive: ${result.sentiment_distribution.positive}%`}
                  />
                  <div
                    style={{ width: `${result.sentiment_distribution.neutral}%` }}
                    className="bg-slate-500 h-full"
                    title={`Neutral: ${result.sentiment_distribution.neutral}%`}
                  />
                  <div
                    style={{ width: `${result.sentiment_distribution.critical}%` }}
                    className="bg-rose-500 h-full"
                    title={`Critical: ${result.sentiment_distribution.critical}%`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-medium">
                    Positive {result.sentiment_distribution.positive}%
                  </span>
                  <span className="text-slate-400 font-medium">
                    Neutral {result.sentiment_distribution.neutral}%
                  </span>
                  <span className="text-rose-400 font-medium">
                    Critical {result.sentiment_distribution.critical}%
                  </span>
                </div>
              </div>
            </div>

            {/* Key Themes */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                Recurring Community Themes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.key_themes.map((th, i) => (
                  <div key={i} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{th.theme}</span>
                      <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-800/40">
                        {th.volume_level}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{th.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Questions */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Top Audience Questions
              </h3>
              <div className="space-y-2">
                {result.top_questions.map((q, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-slate-200 flex items-start gap-2.5"
                  >
                    <span className="text-amber-400 font-bold text-xs shrink-0">Q{i + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                Actionable Creator Next Steps
              </h3>
              <ul className="space-y-2">
                {result.actionable_recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-lg text-xs text-emerald-300 flex items-start gap-2"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-12 text-center text-slate-500 space-y-3">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-slate-400">No Comments Analyzed</h3>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              Paste audience feedback or comments on the left to extract qualitative themes, sentiment breakdown, and content opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
