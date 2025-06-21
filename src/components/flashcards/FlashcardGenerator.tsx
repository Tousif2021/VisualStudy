import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  X, 
  Loader2, 
  Zap, 
  BookOpen, 
  Send, 
  RotateCw, 
  Save, 
  Download, 
  Copy, 
  Check,
  Sparkles,
  Lightbulb,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/cButton';
import { Input } from '../ui/CInput';
import { Textarea } from '../ui/Textarea';
import { Card, CardBody, CardHeader } from '../ui/Card';

interface FlashcardGeneratorProps {
  onClose: () => void;
  onSave: (flashcards: Flashcard[]) => void;
  initialContent?: string;
  documentId?: string;
}

export interface Flashcard {
  id?: string;
  front: string;
  back: string;
  document_id?: string;
}

export const FlashcardGenerator: React.FC<FlashcardGeneratorProps> = ({
  onClose,
  onSave,
  initialContent = '',
  documentId
}) => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'topic' | 'content'>(initialContent ? 'content' : 'topic');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

  const generateFlashcards = async () => {
    if ((activeTab === 'topic' && !topic.trim()) || 
        (activeTab === 'content' && !content.trim())) {
      setError('Please provide either a topic or content to generate flashcards.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log(`Sending request to ${apiBaseUrl}/api/flashcards/generate`);
      
      const response = await fetch(`${apiBaseUrl}/api/flashcards/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: activeTab === 'topic' ? topic : undefined,
          content: activeTab === 'content' ? content : undefined,
        }),
      });

      console.log('Response status:', response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse.substring(0, 200));
        throw new Error('Server returned non-JSON response. Please check if the API server is running correctly.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (!data.flashcards || !Array.isArray(data.flashcards) || data.flashcards.length === 0) {
        throw new Error('No flashcards were generated. Please try again with different input.');
      }

      // Add document_id to each flashcard if provided
      const processedFlashcards = data.flashcards.map((card: Flashcard) => ({
        ...card,
        document_id: documentId
      }));

      setFlashcards(processedFlashcards);
      setCurrentCardIndex(0);
      setFlipped(false);
    } catch (err) {
      console.error('Flashcard generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveFlashcards = async () => {
    setIsSaving(true);
    try {
      // Add any pre-save processing here if needed
      onSave(flashcards);
    } catch (err) {
      console.error('Error saving flashcards:', err);
      setError('Failed to save flashcards. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    const flashcardsText = flashcards.map(card => 
      `Q: ${card.front}\nA: ${card.back}\n`
    ).join('\n');
    
    navigator.clipboard.writeText(flashcardsText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
      }, 200);
    } else {
      setCurrentCardIndex(0); // Loop back to the first card
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex - 1);
      }, 200);
    } else {
      setCurrentCardIndex(flashcards.length - 1); // Loop to the last card
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex justify-between items-center border-b bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 flex items-center justify-center pulse-glow">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 bg-clip-text text-transparent">AI Flashcard Generator</h2>
              <p className="text-sm text-gray-600">Create flashcards from any topic or content</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </Button>
        </CardHeader>

        <CardBody className="p-0 overflow-auto max-h-[calc(90vh-80px)]">
          {flashcards.length === 0 ? (
            <div className="p-6">
              {/* Input Tabs */}
              <div className="flex border-b mb-6">
                <button
                  onClick={() => setActiveTab('topic')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'topic'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Generate by Topic
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'content'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Generate from Content
                </button>
              </div>

              {/* Topic Input */}
              {activeTab === 'topic' && (
                <div className="space-y-4">
                  <Input
                    label="Enter a Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Photosynthesis, World War II, Machine Learning..."
                    fullWidth
                  />
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex items-start gap-3">
                      <Lightbulb size={18} className="text-indigo-600 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        Enter any topic and our AI will generate flashcards with key concepts, definitions, and applications. Try specific topics for more focused cards.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Input */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <Textarea
                    label="Paste Your Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste text from your notes, textbooks, or any learning material..."
                    rows={8}
                    fullWidth
                  />
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Lightbulb size={18} className="text-blue-600 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        Paste your study material and our AI will extract key concepts and create targeted flashcards. The more specific your content, the better the flashcards.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={generateFlashcards}
                  isLoading={isGenerating}
                  leftIcon={isGenerating ? undefined : <Sparkles size={16} />}
                  className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-200/50"
                >
                  {isGenerating ? 'Generating...' : 'Generate Flashcards'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                  Generated Flashcards ({currentCardIndex + 1}/{flashcards.length})
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
                    className={copied ? "text-green-600 border-green-300" : ""}
                  >
                    {copied ? "Copied!" : "Copy All"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFlashcards([]);
                      setActiveTab(initialContent ? 'content' : 'topic');
                    }}
                    leftIcon={<RotateCw size={14} />}
                  >
                    Start Over
                  </Button>
                </div>
              </div>

              {/* Flashcard Display */}
              <div className="mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCardIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="perspective-1000"
                  >
                    <div className="relative w-full h-[300px] group">
                      <motion.div
                        className="w-full h-full relative preserve-3d transition-all duration-500"
                        animate={{ rotateY: flipped ? 180 : 0 }}
                      >
                        {/* Front of Card */}
                        <div 
                          className={`absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 shadow-lg flex flex-col ${flipped ? 'pointer-events-none' : 'pointer-events-auto'} hover:shadow-xl transition-shadow duration-300`}
                          onClick={() => setFlipped(true)}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <BookOpen size={18} className="text-indigo-600" />
                            <h4 className="font-semibold text-indigo-800">Question</h4>
                          </div>
                          <div className="flex-1 flex items-center justify-center">
                            <p className="text-xl font-medium text-center text-gray-800">
                              {flashcards[currentCardIndex].front}
                            </p>
                          </div>
                          <div className="text-center mt-4">
                            <motion.p 
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-sm text-indigo-600 font-medium"
                            >
                              Click to reveal answer
                            </motion.p>
                          </div>
                        </div>

                        {/* Back of Card */}
                        <div 
                          className={`absolute inset-0 backface-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg flex flex-col rotateY-180 ${flipped ? 'pointer-events-auto' : 'pointer-events-none'} hover:shadow-xl transition-shadow duration-300`}
                          onClick={() => setFlipped(false)}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Zap size={18} className="text-blue-600" />
                            <h4 className="font-semibold text-blue-800">Answer</h4>
                          </div>
                          <div className="flex-1 overflow-auto">
                            <p className="text-gray-800 leading-relaxed">
                              {flashcards[currentCardIndex].back}
                            </p>
                          </div>
                          <div className="text-center mt-4">
                            <motion.p 
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-sm text-blue-600 font-medium"
                            >
                              Click to see question
                            </motion.p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={prevCard}
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    leftIcon={<ChevronLeft size={16} />}
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {flashcards.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setFlipped(false);
                          setTimeout(() => setCurrentCardIndex(idx), 200);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          idx === currentCardIndex
                            ? 'bg-indigo-600 scale-125'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={nextCard}
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    rightIcon={<ChevronRight size={16} />}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveFlashcards}
                  isLoading={isSaving}
                  leftIcon={isSaving ? undefined : <Save size={16} />}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-green-200/50"
                >
                  {isSaving ? 'Saving...' : 'Save Flashcards'}
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </motion.div>
    </motion.div>
  );
};