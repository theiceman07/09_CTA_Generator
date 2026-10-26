"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DailyContentPlannerStudio } from "@/components/tools/daily-content-planner-studio";

export default function DailyContentPlannerPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "AI Tools" },
        { label: "Daily Content Planner" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Daily Content Planner Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Structure your multi-week cross-platform content matrix, distribution windows, and batch production milestones powered by Google Gemini and LangChain.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500">Loading Daily Content Planner Studio...</div>}>
          <DailyContentPlannerStudio />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
