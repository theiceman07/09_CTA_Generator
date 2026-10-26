import { Metadata } from "next";
import { Suspense } from "react";
import { ClipFinderStudio } from "@/components/tools/clip-finder-studio";

export const metadata: Metadata = {
  title: "Clip Finder — OmniCreator AI",
  description: "Extract high-impact moments and highlight timestamps from video and audio transcripts.",
};

export default function ClipFinderPage() {
  return (
    <div className="container max-w-6xl py-6 px-4 md:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Clip Finder...</div>}>
        <ClipFinderStudio />
      </Suspense>
    </div>
  );
}
