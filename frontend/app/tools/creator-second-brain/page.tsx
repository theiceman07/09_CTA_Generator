import { Metadata } from "next";
import { Suspense } from "react";
import { CreatorSecondBrainStudio } from "@/components/tools/creator-second-brain-studio";

export const metadata: Metadata = {
  title: "Creator Second Brain — OmniCreator AI",
  description: "Persistent memory vault for storing creator frameworks and synthesizing grounded insights.",
};

export default function CreatorSecondBrainPage() {
  return (
    <div className="container max-w-6xl py-6 px-4 md:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Creator Second Brain...</div>}>
        <CreatorSecondBrainStudio />
      </Suspense>
    </div>
  );
}
