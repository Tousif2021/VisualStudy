import React from "react";
import { VoiceCoachAssistant } from "../components/voice-coach/VoiceCoach";

export const VoiceCoach: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
    <div className="max-w-2xl mx-auto py-10">
      <div className="flex items-center gap-4 mb-6">
        <img
          src="/ai-avatar.png"
          alt="AI Voice Coach"
          className="w-14 h-14 rounded-full shadow-lg animate-bounce"
        />
        <div>
          <h1 className="text-3xl font-bold">Talk to your AI Coach</h1>
          <p className="text-sm text-muted-foreground">
            Speak or type your questions, get real-time answers. Powered by ElevenLabs.
          </p>
        </div>
      </div>
    </div>
    <VoiceCoachAssistant />
  </div>
);