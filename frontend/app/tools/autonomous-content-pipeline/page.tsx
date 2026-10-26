import { Metadata } from "next";
import { Suspense } from "react";
import { AutonomousContentPipelineStudio } from "@/components/tools/autonomous-content-pipeline-studio";

export const metadata: Metadata = {
  title: "Autonomous Content Pipeline — OmniCreator AI",
  description: "End-to-end multi-stage pipeline: idea -> hook -> script -> repurpose -> queue.",
};

export default function AutonomousContentPipelinePage() {
  return (
    <div className="container max-w-6xl py-6 px-4 md:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Autonomous Pipeline...</div>}>
        <AutonomousContentPipelineStudio />
      </Suspense>
    </div>
  );
}
