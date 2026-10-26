"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ContentRecyclerStudio } from "@/components/tools/content-recycler-studio";

export default function ContentRecyclerPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "AI Tools" },
        { label: "Content Recycler" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Content Recycler Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Transform past successful content into fresh, multi-format assets with modernized hooks and updated angles powered by Google Gemini and LangChain.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500">Loading Content Recycler Studio...</div>}>
          <ContentRecyclerStudio />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
