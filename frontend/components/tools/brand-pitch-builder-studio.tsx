"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, BrandPitchBuilderResponse } from "@/types";
import {
  Briefcase,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Mail,
  DollarSign,
  Send,
  Package,
  Clock,
  Lightbulb,
} from "lucide-react";

export function BrandPitchBuilderStudio() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    searchParams.get("projectId") || ""
  );

  const [creatorName, setCreatorName] = useState("Alex Rivers");
  const [creatorNiche, setCreatorNiche] = useState("Hardware Engineering & IoT Systems");
  const [primaryPlatform, setPrimaryPlatform] = useState("YouTube");
  const [brandName, setBrandName] = useState("Espressif Systems");
  const [brandProduct, setBrandProduct] = useState("ESP32-S3 Microcontroller Board");
  const [metricsSummary, setMetricsSummary] = useState("25k Subscribers, 8.5% engagement rate, 45k monthly impressions");
  const [deliverablesRequested, setDeliverablesRequested] = useState("1 Dedicated build video + 2 YouTube Shorts cutdowns");
  const [tone, setTone] = useState("Professional & Collaborative");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BrandPitchBuilderResponse | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

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
    if (!brandName.trim() || !brandProduct.trim()) {
      setError("Please specify the brand and product being pitched.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await api.request<BrandPitchBuilderResponse>("/api/v1/tools/brand-pitch/generate", {
        method: "POST",
        body: JSON.stringify({
          project_id: selectedProjectId,
          creator_name: creatorName.trim(),
          creator_niche: creatorNiche.trim(),
          primary_platform: primaryPlatform,
          brand_name: brandName.trim(),
          brand_product: brandProduct.trim(),
          metrics_summary: metricsSummary.trim() || undefined,
          deliverables_requested: deliverablesRequested.trim() || undefined,
          tone,
        }),
      });

      setResult(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to generate brand pitch.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-amber-400" />
            Sponsorship Pitch Parameters
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Project Workspace
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Creator Name *
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Platform
                </label>
                <select
                  value={primaryPlatform}
                  onChange={(e) => setPrimaryPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Newsletter">Newsletter</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Creator Niche *
              </label>
              <input
                type="text"
                value={creatorNiche}
                onChange={(e) => setCreatorNiche(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Target Brand Name *
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Product / Service Pitched *
                </label>
                <input
                  type="text"
                  value={brandProduct}
                  onChange={(e) => setBrandProduct(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Audience Metrics (optional - leave blank if none)
              </label>
              <input
                type="text"
                value={metricsSummary}
                onChange={(e) => setMetricsSummary(e.target.value)}
                placeholder="e.g. 20k Subs, 10% Engagement"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
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
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-all duration-200 shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Drafting Sponsorship Proposal...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Brand Sponsorship Pitch
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
            {/* Subject Lines */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                High-Open Subject Line Options
              </span>
              <div className="space-y-1.5">
                {result.email_subject_lines.map((subj, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white flex items-center justify-between"
                  >
                    <span>{subj}</span>
                    <button
                      onClick={() => handleCopy(subj, `subj-${idx}`)}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      {copiedType === `subj-${idx}` ? "Copied" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Body */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-400" />
                  Personalized Cold Outreach Email
                </span>
                <button
                  onClick={() => handleCopy(result.outreach_email_body, "email")}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedType === "email" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy Email</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-mono">
                {result.outreach_email_body}
              </div>
            </div>

            {/* Executive DM Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-orange-400" />
                  Quick DM / LinkedIn Pitch (1-Paragraph)
                </span>
                <button
                  onClick={() => handleCopy(result.executive_summary, "dm")}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedType === "dm" ? (
                    <span className="text-emerald-400 text-[11px]">Copied</span>
                  ) : (
                    <span className="text-[11px]">Copy</span>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-300 p-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed">
                "{result.executive_summary}"
              </p>
            </div>

            {/* Deliverables & Concepts */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-400" />
                Proposed Campaign Concepts & Deliverables
              </span>
              <div className="space-y-2">
                {result.campaign_concepts.map((cc, i) => (
                  <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="text-xs font-bold text-white">{cc.title}</div>
                    <p className="text-[11px] text-slate-400">{cc.concept_summary}</p>
                    <div className="text-[10px] text-emerald-400">{cc.why_it_fits}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-12 text-center text-slate-500 space-y-3">
            <Briefcase className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-slate-400">No Pitch Generated</h3>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              Provide creator and brand information on the left to generate customized sponsorship proposals and outreach emails.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
