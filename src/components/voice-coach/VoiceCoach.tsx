import React, { useState, useRef } from "react";
import { Mic, StopCircle, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const examplePrompts = [
  "How do I focus better while studying?",
  "Give me a study plan for exams.",
  "Explain binary search in a simple way.",
  "What's the best way to memorize things?",
];

const ELEVENLABS_VOICE_ID = "your-elevenlabs-voice-id"; // change this
const ELEVENLABS_API_KEY = "your-elevenlabs-api-key"; // never expose in frontend in production!

export const VoiceCoachAssistant: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [aiAudioUrl, setAiAudioUrl] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Voice-to-text (browser SpeechRecognition)
  const startRecording = () => {
    setTranscript("");
    setAiReply("");
    setAiAudioUrl("");
    setError("");
    setIsRecording(true);
    setListening(true);

    // Native browser speech recognition (works in Chrome, Edge)
    const SpeechRecognition =
      // @ts-ignore
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Your browser does not support voice recognition.");
      setIsRecording(false);
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
      setIsRecording(false);
      handleAI(text);
    };
    recognition.onerror = () => {
      setError("Couldn't recognize your voice. Try again!");
      setIsRecording(false);
      setListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
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

  // Talk to your AI, get reply (fake for now), then TTS
  const handleAI = async (text: string) => {
    setProcessing(true);
    setError("");
    setAiReply("");
    setAiAudioUrl("");
    try {
      // --- REPLACE THIS with your real AI endpoint call ---
      // Simulate API call
      const aiText =
        text.toLowerCase().includes("focus")
          ? "To focus better, remove distractions, set small goals, and take breaks."
          : text.toLowerCase().includes("binary search")
          ? "Binary search is an efficient way to find an item in a sorted list. I can explain more if you want!"
          : text.toLowerCase().includes("study plan")
          ? "Here's a simple study plan: Review topics daily, practice old exams, and take regular breaks."
          : "Let me think... Can you ask again or clarify?";
      setAiReply(aiText);

      // Send to ElevenLabs for voice (using fetch)
      const ttsAudioUrl = await fetchElevenLabsTTS(aiText);
      setAiAudioUrl(ttsAudioUrl);

      // Play audio when ready
      setTimeout(() => {
        audioRef.current?.play();
      }, 400);
    } catch (err) {
      setError("AI or voice service failed.");
    }
    setProcessing(false);
  };

  // ElevenLabs TTS fetch (use proxy or serverless backend in production!!)
  async function fetchElevenLabsTTS(text: string): Promise<string> {
    // For demo purposes only. In production, NEVER expose API keys in frontend!
    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        voice_settings: { stability: 0.5, similarity_boost: 0.7 },
      }),
    });
    if (!resp.ok) throw new Error("Failed to fetch audio from ElevenLabs");
    const blob = await resp.blob();
    return URL.createObjectURL(blob);
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white/80 shadow-2xl px-8 py-10 flex flex-col items-center relative">
      <div className="flex flex-col items-center mb-8">
        <div className={`rounded-full bg-indigo-200 flex items-center justify-center mb-3
        ${isRecording || listening ? "animate-pulse" : ""} `}
        style={{
          width: 100, height: 100, boxShadow: isRecording ? "0 0 20px 6px #818cf8" : undefined
        }}>
          {isRecording || listening ? (
            <Mic className="w-14 h-14 text-indigo-700" />
          ) : (
            <Volume2 className="w-14 h-14 text-indigo-700" />
          )}
        </div>
        <div className="font-semibold text-xl text-indigo-800 text-center mb-2">
          {isRecording ? "Listening..." : "Talk to your AI Coach"}
        </div>
        <div className="text-muted-foreground text-center mb-1">
          {isRecording
            ? "Speak now. Ask anything about studies or life."
            : "Tap the mic and start talking, or try a suggestion below."}
        </div>
      </div>

      {error && <div className="text-red-500 text-center mb-2">{error}</div>}

      <div className="w-full flex flex-col items-center mb-6">
        <Button
          size="lg"
          variant={isRecording ? "destructive" : "default"}
          className="rounded-full px-8 py-4 text-xl font-bold shadow-lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={processing}
        >
          {isRecording ? (
            <span className="flex gap-2 items-center">
              <StopCircle className="w-6 h-6" />
              Stop
            </span>
          ) : (
            <span className="flex gap-2 items-center">
              <Mic className="w-6 h-6 animate-bounce" />
              Start
            </span>
          )}
        </Button>
        {processing && (
          <div className="mt-4 flex flex-col items-center">
            <Loader2 className="animate-spin w-7 h-7 text-indigo-600" />
            <span className="text-indigo-700 mt-2">AI is thinking & generating answer...</span>
          </div>
        )}
      </div>

      {transcript && (
        <div className="mb-4 w-full text-center text-base font-medium border-b pb-2 text-indigo-900">
          <div className="mb-1 text-xs uppercase text-indigo-400">You said:</div>
          {transcript}
        </div>
      )}

      {aiReply && (
        <div className="mb-6 w-full text-center border-t pt-3">
          <div className="mb-1 text-xs uppercase text-indigo-400">AI says:</div>
          <div className="text-lg font-semibold text-indigo-800 mb-2">{aiReply}</div>
          {aiAudioUrl && (
            <audio
              ref={audioRef}
              src={aiAudioUrl}
              controls
              autoPlay
              className="w-full mt-1"
            />
          )}
        </div>
      )}

      <div className="w-full flex flex-col items-center mt-2">
        <div className="text-xs text-gray-400 mb-2">Try asking:</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {examplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => promptClick(p)}
              disabled={processing || isRecording}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-sm shadow-sm transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute bottom-2 right-4 text-xs text-gray-300">Powered by ElevenLabs</div>
    </div>
  );
};