"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, ThumbnailIdeatorResponse, ThumbnailConcept } from "@/types";
import {
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Palette,
  Eye,
  Camera,
  Layers,
  TrendingUp,
} from "lucide-react";

export function ThumbnailIdeatorStudio() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    searchParams.get("projectId") || ""
  );

  const [titleOrConcept, setTitleOrConcept] = useState(
    "I Built an Autonomous Methane Detection Station for Under $10 using ESP32"
  );
  const [platform, setPlatform] = useState("YouTube");
  const [targetAudience, setTargetAudience] = useState("Makers, tech hobbyists, and electrical engineers");
  const [includeFace, setIncludeFace] = useState(true);
  const [stylePreference, setStylePreference] = useState("High-Contrast & Clean");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ThumbnailIdeatorResponse | null>(null);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

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
    if (!titleOrConcept.trim()) {
      setError("Please provide a video title or concept.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await api.request<ThumbnailIdeatorResponse>("/api/v1/tools/thumbnail-ideator/generate", {
        method: "POST",
        body: JSON.stringify({
          project_id: selectedProjectId,
          video_title_or_concept: titleOrConcept.trim(),
          platform,
          target_audience: targetAudience.trim() || undefined,
          include_creator_face: includeFace,
          style_preference: stylePreference,
        }),
      });

      setResult(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to generate thumbnail concepts.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptIndex(idx);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
            <ImageIcon className="w-4 h-4 text-pink-400" />
            Visual Thumbnail Parameters
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Project Workspace
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
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
                Video Title or Concept *
              </label>
              <textarea
                value={titleOrConcept}
                onChange={(e) => setTitleOrConcept(e.target.value)}
                rows={3}
                placeholder="What is your video title or main topic?"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram Reel">Instagram Reel</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Visual Style
                </label>
                <select
                  value={stylePreference}
                  onChange={(e) => setStylePreference(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="High-Contrast & Clean">High-Contrast & Clean</option>
                  <option value="Cinematic & Moody">Cinematic & Moody</option>
                  <option value="Bold Typography & Graphics">Bold Graphics</option>
                  <option value="Minimalist Mystery">Minimalist Mystery</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="includeFace"
                checked={includeFace}
                onChange={(e) => setIncludeFace(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-pink-500 focus:ring-0 w-4 h-4"
              />
              <label htmlFor="includeFace" className="text-xs text-slate-300">
                Include creator expression / face
              </label>
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
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-all duration-200 shadow-lg shadow-pink-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Designing Visual Packaging...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate High-CTR Concepts
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
            {/* Strategy & A/B Hypothesis */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="text-xs font-semibold text-pink-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                A/B Testing Hypothesis
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.a_b_testing_hypothesis}
              </p>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                <strong>Title Synergy:</strong> {result.title_thumbnail_synergy_tip}
              </div>
            </div>

            {/* Concepts */}
            <div className="space-y-4">
              {result.concepts.map((concept, idx) => {
                const isRecommended = concept.title === result.recommended_concept.title;
                return (
                  <div
                    key={idx}
                    className={`bg-slate-900 border rounded-xl p-5 space-y-3 transition-all ${
                      isRecommended
                        ? "border-pink-500/50 shadow-md shadow-pink-950/30"
                        : "border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{concept.title}</span>
                        {isRecommended && (
                          <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                            Highest Expected CTR
                          </span>
                        )}
                      </div>
                      {concept.text_overlay && (
                        <span className="text-[10px] bg-slate-950 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-black tracking-wider uppercase">
                          TEXT: "{concept.text_overlay}"
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                        <span className="text-[10px] text-slate-500 font-semibold block">
                          VISUAL FOCAL POINT
                        </span>
                        <p className="text-slate-200">{concept.visual_focal_point}</p>
                      </div>

                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                        <span className="text-[10px] text-slate-500 font-semibold block">
                          LIGHTING & PALETTE
                        </span>
                        <p className="text-slate-200">{concept.background_and_lighting}</p>
                        <div className="flex gap-1.5 pt-1">
                          {concept.color_palette.map((col, cIdx) => (
                            <span
                              key={cIdx}
                              className="text-[10px] px-1.5 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-700"
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Prompt Box */}
                    <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-pink-400 font-semibold flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          Generative AI Image Prompt
                        </span>
                        <button
                          onClick={() => handleCopyPrompt(concept.image_generation_prompt, idx)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedPromptIndex === idx ? (
                            <span className="text-emerald-400">Copied</span>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Prompt</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                        {concept.image_generation_prompt}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <strong>Psychology:</strong> {concept.ctr_psychology_rationale}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-12 text-center text-slate-500 space-y-3">
            <ImageIcon className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-slate-400">No Thumbnail Concepts Yet</h3>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              Enter your video title or premise on the left to generate high-CTR composition layouts, contrast color palettes, and AI image prompts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
