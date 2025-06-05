import React from 'react';
import { VoiceCoach as VoiceCoachComponent } from '../components/voice-coach/VoiceCoach';

export const VoiceCoach: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Voice Coach</h1>
      <VoiceCoachComponent />
    </div>
  );
};