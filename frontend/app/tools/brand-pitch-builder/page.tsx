"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BrandPitchBuilderStudio } from "@/components/tools/brand-pitch-builder-studio";

export default function BrandPitchBuilderPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "AI Tools" },
        { label: "Brand Pitch Builder" },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Brand Pitch Builder Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate customized sponsorship proposals, high-open cold email templates, and campaign packages tailored to prospective brand partners powered by Google Gemini and LangChain.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-500">Loading Brand Pitch Builder Studio...</div>}>
          <BrandPitchBuilderStudio />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
