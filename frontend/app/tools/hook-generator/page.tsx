"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { HookGeneratorStudio } from "@/components/tools/hook-generator-studio";

export default function HookGeneratorPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "AI Tools" },
        { label: "Hook Generator" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hook Generator Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate high-converting, scroll-stopping hooks tailored to 10 psychological angles powered by Google Gemini and LangChain.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500">Loading Hook Studio...</div>}>
          <HookGeneratorStudio />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
