import { Metadata } from "next";
import { Suspense } from "react";
import { ScreenplayWorkspaceStudio } from "@/components/tools/screenplay-workspace-studio";

export const metadata: Metadata = {
  title: "AI Screenplay Workspace — OmniCreator AI",
  description: "Long-form storytelling workspace with scene breakdown, character bible, and dialogue.",
};

export default function ScreenplayWorkspacePage() {
  return (
    <div className="container max-w-6xl py-6 px-4 md:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Screenplay Workspace...</div>}>
        <ScreenplayWorkspaceStudio />
      </Suspense>
    </div>
  );
}
