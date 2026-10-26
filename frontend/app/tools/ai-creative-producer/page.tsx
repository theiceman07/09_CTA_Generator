import { Metadata } from "next";
import { Suspense } from "react";
import { AICreativeProducerStudio } from "@/components/tools/ai-creative-producer-studio";

export const metadata: Metadata = {
  title: "AI Creative Producer — OmniCreator AI",
  description: "Executive creative direction, cinematic shot list planning, and visual style guides.",
};

export default function AICreativeProducerPage() {
  return (
    <div className="container max-w-6xl py-6 px-4 md:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Creative Producer...</div>}>
        <AICreativeProducerStudio />
      </Suspense>
    </div>
  );
}
