import { Metadata } from "next";
import { Suspense } from "react";
import { AIContentDirectorGuruvelahStudio } from "@/components/tools/ai-content-director-guruvelah-studio";

export const metadata: Metadata = {
  title: "AI Content Director — Guruvelah — OmniCreator AI",
  description: "Specialized philosophical narrative strategy and creative direction engine.",
};

export default function AIContentDirectorGuruvelahPage() {
  return (
    <div className="container max-w-6xl py-6 px-4 md:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Guruvelah Studio...</div>}>
        <AIContentDirectorGuruvelahStudio />
      </Suspense>
    </div>
  );
}
