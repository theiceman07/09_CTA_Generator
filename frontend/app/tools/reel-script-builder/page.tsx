"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ReelScriptBuilderStudio } from "@/components/tools/reel-script-builder-studio";

export default function ReelScriptBuilderPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "AI Tools" },
        { label: "Reel Script Builder" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Reel Script Builder Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build high-retention short-form video scripts with visual direction, scene pacing, and hooks powered by Google Gemini and LangChain.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500">Loading Reel Script Studio...</div>}>
          <ReelScriptBuilderStudio />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
