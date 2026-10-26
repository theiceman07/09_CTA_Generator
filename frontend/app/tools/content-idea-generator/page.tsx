"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ContentIdeaGeneratorStudio } from "@/components/tools/content-idea-generator-studio";

export default function ContentIdeaGeneratorPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "AI Tools" },
        { label: "Content Idea Generator" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Content Idea Generator Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Brainstorm viral, niche-targeted content concepts, topics, and video angles powered by Google Gemini and LangChain.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500">Loading Content Idea Generator...</div>}>
          <ContentIdeaGeneratorStudio />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
