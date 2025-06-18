import React, { useState, useRef, useEffect } from "react";
import { Mic, StopCircle, Loader2, Volume2, Brain, MessageCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { useAppStore } from "../../lib/store";
const API_BASE = import.meta.env.VITE_API_BASE;


const examplePrompts = [
  "How do I focus better while studying?",
  "Give me a study plan for exams.",
  "What's the best way to memorize things?",
  "Explain binary search algorithm",
  "Help me with time management"
];

export const VoiceCoachAssistant: React.FC = () => {
  const { user } = useAppStore();
  const [isRecording, setIsRecording] = useState(false);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [aiAudioUrl, setAiAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [hasAudioSupport, setHasAudioSupport] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = 
      // @ts-ignore
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setHasAudioSupport(true);
    } else {
      setError("Voice recognition not supported in this browser. Try Chrome or Edge.");
    }
  }, []);

  // Voice-to-text (browser SpeechRecognition)
  const startRecording = () => {
    if (!hasAudioSupport) {
      setError("Voice recognition not available. Please type your question instead.");
      return;
    }

    setTranscript("");
    setAiReply("");
    setAiAudioUrl("");
    setError("");
    setIsRecording(true);
    setListening(true);

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
      setIsRecording(false);
      handleAI(text);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = "Voice recognition failed. ";
      
      switch (event.error) {
        case 'no-speech':
          errorMessage += "No speech detected. Try speaking louder.";
          break;
        case 'audio-capture':
          errorMessage += "Microphone not accessible. Check permissions.";
          break;
        case 'not-allowed':
          errorMessage += "Microphone access denied. Please click the microphone icon in your browser's address bar and allow microphone access for this site, then refresh the page and try again.";
          break;
        case 'network':
          errorMessage += "Network error. Check your internet connection.";
          break;
        default:
          errorMessage += "Please try again or type your question.";
      }
      
      setError(errorMessage);
      setIsRecording(false);
      setListening(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setListening(false);
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (err) {
      setError("Failed to start voice recognition. Please try again.");
      setIsRecording(false);
      setListening(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setListening(false);
    }
  };

  // Handle prompt click
  const promptClick = (prompt: string) => {
    setTranscript(prompt);
    setAiReply("");
    setAiAudioUrl("");
    setError("");
    handleAI(prompt);
  };

  // Talk to your AI, get reply, then TTS
  const handleAI = async (text: string) => {
    setProcessing(true);
    setError("");
    setAiReply("");
    setAiAudioUrl("");
    
    try {
      // Call your AI backend (replace with your actual AI service)
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: text }),
      });


      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      const aiText = data.answer || "I'm sorry, I couldn't process that. Could you try rephrasing your question?";
      
      setAiReply(aiText);

      // Try to generate voice using Supabase Edge Function
      try {
        cconst ttsResponse = await fetch(`${import.meta.env.VITE_API_BASE}/api/tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text: aiText,
            userId: user?.id,
          }),
        });



        if (ttsResponse.ok) {
          const audioBlob = await ttsResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          setAiAudioUrl(audioUrl);
          
          // Play audio when ready
          setTimeout(() => {
            audioRef.current?.play().catch(() => {
              // Audio play failed, but that's okay
            });
          }, 400);
        }
      } catch (ttsError) {
        console.warn('Text-to-speech failed:', ttsError);
        // Continue without audio - text response is still available
      }

    } catch (err) {
      console.error('AI processing error:', err);
      setError("AI service is currently unavailable. Please try again later.");
      
      // Provide a fallback response
      const fallbackResponse = getFallbackResponse(text);
      setAiReply(fallbackResponse);
    }
    
    setProcessing(false);
  };

  // Fallback responses when AI service is unavailable
  const getFallbackResponse = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("focus") || lowerText.includes("concentration")) {
      return "To improve focus: 1) Remove distractions, 2) Use the Pomodoro technique (25min work, 5min break), 3) Set clear goals, 4) Take regular breaks.";
    }
    if (lowerText.includes("study plan") || lowerText.includes("schedule")) {
      return "Create a study plan: 1) List all topics, 2) Prioritize by difficulty/importance, 3) Allocate time slots, 4) Include breaks, 5) Review regularly.";
    }
    if (lowerText.includes("memorize") || lowerText.includes("memory")) {
      return "Memory techniques: 1) Spaced repetition, 2) Create mnemonics, 3) Use visual associations, 4) Practice active recall, 5) Teach others.";
    }
    if (lowerText.includes("time management")) {
      return "Time management tips: 1) Use a calendar, 2) Prioritize tasks (urgent vs important), 3) Break large tasks into smaller ones, 4) Eliminate time wasters.";
    }
    
    return "I'm here to help with your studies! Try asking about focus techniques, study plans, memory improvement, or time management.";
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-lg shadow-2xl px-8 py-10 flex flex-col items-center relative border border-white/20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 pointer-events-none"></div>
      
      <div className="flex flex-col items-center mb-8 relative z-10">
        <div className={`rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 relative
        ${isRecording || listening ? "animate-pulse" : ""} `}
        style={{
          width: 100, 
          height: 100, 
          boxShadow: isRecording ? "0 0 30px 8px rgba(99, 102, 241, 0.4)" : "0 10px 25px rgba(0,0,0,0.1)"
        }}>
          {isRecording || listening ? (
            <Mic className="w-12 h-12 text-white animate-bounce" />
          ) : processing ? (
            <Brain className="w-12 h-12 text-white animate-spin" />
          ) : (
            <MessageCircle className="w-12 h-12 text-white" />
          )}
          
          {/* Sound wave rings */}
          {(isRecording || listening) && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
        </div>
        
        <div className="font-bold text-xl text-gray-800 text-center mb-2">
          {isRecording ? "Listening..." : processing ? "AI is thinking..." : "AI Study Coach"}
        </div>
        <div className="text-gray-600 text-center text-sm">
          {isRecording
            ? "Speak now. Ask anything about studies."
            : processing
            ? "Generating your personalized response..."
            : "Tap the mic to start talking, or try a suggestion below."}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-center mb-4 p-3 bg-red-50 rounded-lg border border-red-200 text-sm relative z-10">
          {error}
        </div>
      )}

      <div className="w-full flex flex-col items-center mb-6 relative z-10">
        <Button
          size="lg"
          variant={isRecording ? "danger" : "primary"}
          className="rounded-full px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={processing || !hasAudioSupport}
        >
          {isRecording ? (
            <span className="flex gap-2 items-center">
              <StopCircle className="w-6 h-6" />
              Stop Listening
            </span>
          ) : (
            <span className="flex gap-2 items-center">
              <Mic className="w-6 h-6" />
              {hasAudioSupport ? "Start Talking" : "Voice Unavailable"}
            </span>
          )}
        </Button>
        
        {processing && (
          <div className="mt-4 flex flex-col items-center">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
            <span className="text-blue-700 mt-2 text-sm">Processing your question...</span>
          </div>
        )}
      </div>

      {transcript && (
        <div className="mb-4 w-full text-center text-base font-medium border-b border-gray-200 pb-3 text-gray-800 relative z-10">
          <div className="mb-1 text-xs uppercase text-blue-600 font-semibold">You asked:</div>
          <div className="bg-blue-50 p-3 rounded-lg">{transcript}</div>
        </div>
      )}

      {aiReply && (
        <div className="mb-6 w-full text-center border-t border-gray-200 pt-4 relative z-10">
          <div className="mb-2 text-xs uppercase text-purple-600 font-semibold">AI Coach says:</div>
          <div className="text-base text-gray-800 mb-3 bg-purple-50 p-4 rounded-lg leading-relaxed">{aiReply}</div>
          {aiAudioUrl && (
            <div className="mt-3">
              <audio
                ref={audioRef}
                src={aiAudioUrl}
                controls
                className="w-full rounded-lg"
                style={{ height: '40px' }}
              />
            </div>
          )}
        </div>
      )}

      <div className="w-full flex flex-col items-center mt-2 relative z-10">
        <div className="text-xs text-gray-500 mb-3 font-medium">Try asking:</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {examplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => promptClick(prompt)}
              disabled={processing || isRecording}
              className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-full text-xs shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-3 right-4 text-xs text-gray-400">
        AI-Powered Voice Coach
      </div>
    </div>
  );
};