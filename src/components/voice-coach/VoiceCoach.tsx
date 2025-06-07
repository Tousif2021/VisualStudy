import React, { useState, useRef } from "react";
import { Button } from "../ui/Button";
import { Loader2, Mic, StopCircle, Send } from "lucide-react";

// Fake: Replace with your real ElevenLabs + backend logic!
const elevenLabsTextToSpeech = async (text: string): Promise<string> => {
  // Should return the audio URL for playback.
  // Here, just simulating with a delay.
  return new Promise((resolve) =>
    setTimeout(() => resolve("/dummy-audio.mp3"), 1000)
  );
};

export const VoiceChatUI: React.FC = () => {
  const [messages, setMessages] = useState<
    { from: "user" | "ai"; text: string; audioUrl?: string }[]
  >([
    {
      from: "ai",
      text: "Hey there! 👋 I'm your AI Voice Coach. Ask me anything or tap the mic to start!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dummy record logic (replace with real browser Speech Recognition)
  const handleRecord = async () => {
    setIsRecording(true);
    setTimeout(() => {
      setInput("What's the best way to prepare for exams?");
      setIsRecording(false);
    }, 3000); // Simulate 3 seconds recording
  };

  const handleStop = () => {
    setIsRecording(false);
  };

  const sendMessage = async (message: string) => {
    setError("");
    setIsLoading(true);
    setMessages((msgs) => [...msgs, { from: "user", text: message }]);
    setInput("");
    try {
      // Replace with your backend AI chat function
      const aiReply = "Great question! Break your study into small, focused chunks. Stay consistent. Need a detailed plan?";
      const audioUrl = await elevenLabsTextToSpeech(aiReply);
      setMessages((msgs) => [
        ...msgs,
        { from: "ai", text: aiReply, audioUrl },
      ]);
      // Auto-play the voice answer
      setTimeout(() => {
        audioRef.current?.play();
      }, 500);
    } catch (err) {
      setError("Failed to get a response. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
    }
  };

  return (
    <div className="flex flex-col rounded-2xl shadow-xl bg-white/70 border backdrop-blur p-4 gap-3">
      <div className="h-72 overflow-y-auto flex flex-col gap-2 mb-2 px-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-2xl px-4 py-2 max-w-xs shadow ${
                msg.from === "user"
                  ? "bg-primary text-white rounded-br-sm"
                  : "bg-muted text-primary rounded-bl-sm"
              }`}
            >
              {msg.text}
              {msg.audioUrl && (
                <audio
                  ref={audioRef}
                  src={msg.audioUrl}
                  controls
                  className="mt-2 w-full"
                />
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-2 rounded-2xl flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" /> AI is thinking...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleInputSend} className="flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something or press the mic..."
          className="flex-1 px-4 py-2 rounded-lg border outline-none focus:ring"
          disabled={isLoading || isRecording}
        />
        <Button
          type="button"
          variant={isRecording ? "destructive" : "secondary"}
          onClick={isRecording ? handleStop : handleRecord}
          disabled={isLoading}
          className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
        >
          {isRecording ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
        >
          <Send className="w-6 h-6" />
        </Button>
      </form>
      {error && (
        <div className="text-destructive text-sm mt-1">{error}</div>
      )}
      <div className="text-xs text-muted-foreground mt-2 text-right">
        Powered by ElevenLabs • Try "Explain binary search" or "Give me a study plan"
      </div>
    </div>
  );
};