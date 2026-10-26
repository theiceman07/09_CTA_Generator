import { Metadata } from "next";
import { Suspense } from "react";
import { CreatorWorkspaceStudio } from "@/components/tools/creator-workspace-studio";

export const metadata: Metadata = {
  title: "Creator Workspace — OmniCreator AI",
  description: "Unified creator production hub connecting project assets, research, scripts, and workflows.",
};

export default function CreatorWorkspacePage() {
  return (
    <div className="container max-w-6xl py-6 px-4 md:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Creator Workspace...</div>}>
        <CreatorWorkspaceStudio />
      </Suspense>
    </div>
  );
}
