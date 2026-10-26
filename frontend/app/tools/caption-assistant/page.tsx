"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CaptionAssistantStudio } from "@/components/tools/caption-assistant-studio";

export default function CaptionAssistantPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "AI Tools" },
        { label: "Caption Assistant" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Caption Assistant Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate high-performing social media captions with scroll-stopping hooks, algorithm-calibrated reach angles, and SEO hashtags powered by Google Gemini and LangChain.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500">Loading Caption Assistant Studio...</div>}>
          <CaptionAssistantStudio />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
