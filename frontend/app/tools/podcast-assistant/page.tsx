import { Metadata } from "next";
import { Suspense } from "react";
import { PodcastAssistantStudio } from "@/components/tools/podcast-assistant-studio";

export const metadata: Metadata = {
  title: "Podcast Assistant — OmniCreator AI",
  description: "Plan episode structures, host-guest interview questions, and automated markdown show notes.",
};

export default function PodcastAssistantPage() {
  return (
    <div className="container max-w-6xl py-6 px-4 md:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Podcast Assistant...</div>}>
        <PodcastAssistantStudio />
      </Suspense>
    </div>
  );
}
