import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Play, Pause, Download, Trash2, Volume2, RefreshCw } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { useAppStore } from '../../lib/store';

interface VoiceCoachProps {
  onSave?: () => void;
}

export const VoiceCoach: React.FC<VoiceCoachProps> = ({ onSave }) => {
  const { user, createVoiceScript } = useAppStore();
  const [title, setTitle] = useState('');
  const [script, setScript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (waveformRef.current && audioUrl) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorColor: '#4F46E5',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 80,
        barGap: 3,
      });
      
      wavesurfer.current.load(audioUrl);
      
      return () => {
        wavesurfer.current?.destroy();
      };
    }
  }, [audioUrl]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      mediaRecorder.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to access microphone');
      console.error(err);
    }
  };
  
  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };
  
  const togglePlayback = () => {
    if (wavesurfer.current) {
      if (isPlaying) {
        wavesurfer.current.pause();
      } else {
        wavesurfer.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const generateVoiceover = async () => {
    if (!script.trim()) {
      setError('Please enter some text first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/elevenlabs/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: script }),
      });
      
      if (!response.ok) throw new Error('Failed to generate audio');
      
      const blob = await response.blob();
      setGeneratedAudioUrl(URL.createObjectURL(blob));
      
      // Save to Supabase
      if (title && script) {
        await createVoiceScript(title, script);
        if (onSave) onSave();
      }
    } catch (err) {
      setError('Failed to generate audio. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadAudio = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Voice Coach</h2>
          <p className="text-sm text-gray-500">
            Practice your presentation with AI-powered voice coaching
          </p>
        </CardHeader>
        
        <CardBody className="space-y-6">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your script..."
          />
          
          <Textarea
            label="Script"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Type or paste your presentation script here..."
            rows={6}
          />
          
          <div className="flex gap-4">
            <Button
              onClick={generateVoiceover}
              isLoading={isLoading}
              leftIcon={<Volume2 size={16} />}
              disabled={!script.trim()}
            >
              Generate Voice
            </Button>
            
            <Button
              variant="outline"
              onClick={isRecording ? stopRecording : startRecording}
              leftIcon={<Mic size={16} />}
              className={isRecording ? 'bg-red-50 text-red-600' : ''}
            >
              {isRecording ? 'Stop Recording' : 'Record Your Version'}
            </Button>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          
          {/* Waveform Display */}
          {audioUrl && (
            <div className="space-y-4">
              <div ref={waveformRef} className="w-full" />
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayback}
                  leftIcon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadAudio(audioUrl, 'recording.webm')}
                  leftIcon={<Download size={16} />}
                >
                  Download
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAudioUrl(null)}
                  leftIcon={<Trash2 size={16} />}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
          
          {/* Generated Audio Player */}
          {generatedAudioUrl && (
            <div className="space-y-4">
              <h3 className="font-medium">AI Generated Version</h3>
              <audio controls className="w-full">
                <source src={generatedAudioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAudio(generatedAudioUrl, 'ai-voice.mp3')}
                leftIcon={<Download size={16} />}
              >
                Download AI Version
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};