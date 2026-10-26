import { Metadata } from "next";
import { Suspense } from "react";
import { AIContentDirectorStudio } from "@/components/tools/ai-content-director-studio";

export const metadata: Metadata = {
  title: "AI Content Director — OmniCreator AI",
  description: "End-to-end multi-stage LangGraph content orchestration engine.",
};

export default function AIContentDirectorPage() {
  return (
    <div className="container max-w-6xl py-6 px-4 md:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading AI Content Director...</div>}>
        <AIContentDirectorStudio />
      </Suspense>
    </div>
  );
}
