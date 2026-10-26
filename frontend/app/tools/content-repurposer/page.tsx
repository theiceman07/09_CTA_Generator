"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ContentRepurposerStudio } from "@/components/tools/content-repurposer-studio";

export default function ContentRepurposerToolPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "AI Tools" },
        { label: "Content Repurposer" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Content Repurposer Studio</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate high-performing social copy and video outlines tailored for LinkedIn, X, Instagram, and YouTube.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500">Loading Content Repurposer...</div>}>
          <ContentRepurposerStudio />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
