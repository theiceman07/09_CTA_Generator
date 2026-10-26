import { Metadata } from "next";
import { Suspense } from "react";
import { VoiceReplicatorStudio } from "@/components/tools/voice-replicator-studio";

export const metadata: Metadata = {
  title: "Voice Replicator — OmniCreator AI",
  description: "Extract creator stylistic signatures and draft new content matching authentic author voice.",
};

export default function VoiceReplicatorPage() {
  return (
    <div className="container max-w-6xl py-6 px-4 md:px-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Voice Replicator...</div>}>
        <VoiceReplicatorStudio />
      </Suspense>
    </div>
  );
}
