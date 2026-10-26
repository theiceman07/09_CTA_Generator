"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CollaborationFinderStudio } from "@/components/tools/collaboration-finder-studio";

export default function CollaborationFinderPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "AI Tools" },
        { label: "Creator Collaboration Finder" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Creator Collaboration Finder Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Identify high-synergy creator niches, establish complementary partner screening criteria, and generate high-response DM outreach scripts powered by Google Gemini and LangChain.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500">Loading Collaboration Finder Studio...</div>}>
          <CollaborationFinderStudio />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
