import React from "react";
import { Brain, Mic } from "lucide-react";
import { VoiceCoachAssistant } from "../components/voice-coach/VoiceCoach";

export const VoiceCoach: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
    <div className="max-w-2xl mx-auto py-10">
      <div className="flex items-center gap-4 mb-6">
        {/* AI Voice Recognition Icon */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg animate-bounce">
            <Brain size={24} className="text-white" />
          </div>
          {/* Floating mic indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-md animate-pulse">
            <Mic size={12} className="text-white" />
          </div>
          {/* Sound waves animation */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75"></div>
          <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Talk to your AI Coach</h1>
          <p className="text-sm text-muted-foreground">
            Speak your questions or practice your upcoming presentation and get real-time answers and feedback. AI-powered voice recognition with spoken responses.
          </p>
        </div>
      </div>
    </div>
    <VoiceCoachAssistant />
  </div>
);

export default VoiceCoach;