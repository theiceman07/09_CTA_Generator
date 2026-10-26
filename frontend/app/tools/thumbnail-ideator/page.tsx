"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ThumbnailIdeatorStudio } from "@/components/tools/thumbnail-ideator-studio";

export default function ThumbnailIdeatorPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "AI Tools" },
        { label: "Thumbnail Ideator" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Thumbnail Ideator Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Formulate high-CTR visual packaging, high-contrast composition palettes, and ready-to-run generative image prompts powered by Google Gemini and LangChain.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500">Loading Thumbnail Ideator Studio...</div>}>
          <ThumbnailIdeatorStudio />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
