import { Metadata } from "next";
import { Suspense } from "react";
import { CreatorResearchAssistantStudio } from "@/components/tools/creator-research-assistant-studio";

export const metadata: Metadata = {
  title: "Creator Research — OmniCreator AI",
  description: "Synthesize competitive intelligence and domain insights.",
};

export default function CreatorResearchPage() {
  return (
    <div className="container max-w-6xl py-6 px-4 md:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Creator Research...</div>}>
        <CreatorResearchAssistantStudio />
      </Suspense>
    </div>
  );
}
