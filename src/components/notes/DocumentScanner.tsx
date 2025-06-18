import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, Check, Upload, Loader2, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { useAppStore } from '../../lib/store';
import { createNote } from '../../lib/supabase';

interface DocumentScannerProps {
  onClose: () => void;
  onSave: () => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({ onClose, onSave }) => {
  const { user, courses } = useAppStore();
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'course-selection' | 'camera' | 'preview'>('course-selection');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Course options for the select dropdown
  const courseOptions = [
    { value: '', label: 'No Course (Uncategorized)' },
    ...courses.map(course => ({
      value: course.id,
      label: course.name
    }))
  ];

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStep('camera');
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions and try again.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64 image
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    
    // Stop camera and move to preview
    stopCamera();
    setStep('preview');
    setIsCapturing(false);
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Save note with image
  const saveNote = async () => {
    if (!user || !capturedImage || !noteTitle.trim()) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Convert base64 to blob for potential upload
      // For now, we'll store the base64 directly in the note content
      const noteContent = `
        <div class="scanned-document">
          <h3>Scanned Document</h3>
          <img src="${capturedImage}" alt="Scanned document" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
          <p><em>Captured on ${new Date().toLocaleString()}</em></p>
        </div>
      `;
      
      const { error } = await createNote(
        user.id,
        noteTitle,
        noteContent,
        selectedCourseId || undefined
      );
      
      if (error) throw error;
      
      onSave();
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-white shadow-2xl">
            <CardHeader className="flex justify-between items-center border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Camera size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Scan Document</h2>
                  <p className="text-sm text-gray-600">
                    {step === 'course-selection' && 'Select course and enter title'}
                    {step === 'camera' && 'Position document and capture'}
                    {step === 'preview' && 'Review and save your scan'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </Button>
            </CardHeader>

            <CardBody className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Step 1: Course Selection */}
              {step === 'course-selection' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Input
                    label="Note Title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Enter a title for your scanned document..."
                    required
                    fullWidth
                  />
                  
                  <Select
                    label="Course (Optional)"
                    value={selectedCourseId}
                    onChange={setSelectedCourseId}
                    options={courseOptions}
                    placeholder="Select a course"
                    fullWidth
                  />

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      onClick={startCamera}
                      disabled={!noteTitle.trim()}
                      leftIcon={<Camera size={16} />}
                    >
                      Start Camera
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Camera View */}
              {step === 'camera' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-96 object-cover"
                    />
                    
                    {/* Camera overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-4 border-2 border-white/50 rounded-lg"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 border-2 border-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-600 mb-4">
                    Position your document within the frame and tap capture
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        stopCamera();
                        setStep('course-selection');
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={capturePhoto}
                      disabled={isCapturing}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      leftIcon={isCapturing ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                    >
                      {isCapturing ? 'Capturing...' : 'Capture'}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preview */}
              {step === 'preview' && capturedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-gray-100 rounded-lg p-4">
                    <img
                      src={capturedImage}
                      alt="Captured document"
                      className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={16} className="text-gray-600" />
                      <span className="font-medium">Note Details</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Title:</strong> {noteTitle}</div>
                      <div><strong>Course:</strong> {selectedCourseId ? courses.find(c => c.id === selectedCourseId)?.name : 'Uncategorized'}</div>
                      <div><strong>Date:</strong> {new Date().toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-3">
                    <Button
                      variant="outline"
                      onClick={retakePhoto}
                      leftIcon={<RotateCcw size={16} />}
                    >
                      Retake
                    </Button>
                    <Button
                      onClick={saveNote}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      leftIcon={isSaving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                    >
                      {isSaving ? 'Saving...' : 'Save Note'}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Hidden canvas for image capture */}
              <canvas ref={canvasRef} className="hidden" />
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};