"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CommentAnalyzerStudio } from "@/components/tools/comment-analyzer-studio";

export default function CommentAnalyzerPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "AI Tools" },
        { label: "Comment Analyzer" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Comment Analyzer Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze audience reactions, sentiment distribution, high-frequency questions, and strategic content opportunities powered by Google Gemini and LangChain.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500">Loading Comment Analyzer Studio...</div>}>
          <CommentAnalyzerStudio />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
