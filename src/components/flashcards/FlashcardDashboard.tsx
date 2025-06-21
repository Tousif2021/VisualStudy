import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Zap, 
  Plus, 
  Search, 
  RotateCw, 
  Save, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/cButton';
import { Input } from '../ui/CInput';
import { Textarea } from '../ui/Textarea';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { useAppStore } from '../../lib/store';
import { createFlashcards } from '../../lib/supabase';

interface Flashcard {
  id?: string;
  front: string;
  back: string;
  document_id?: string;
}

export const FlashcardDashboard: React.FC = () => {
  const { user } = useAppStore();
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [savedSets, setSavedSets] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [inputMode, setInputMode] = useState<'topic' | 'content'>('topic');

  const apiBaseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

  // Fetch saved flashcard sets count
  useEffect(() => {
    const fetchSavedSets = async () => {
      if (!user) return;
      
      try {
        const { supabase } = await import('../../lib/supabase');
        const { count, error } = await supabase
          .from('flashcards')
          .select('document_id', { count: 'exact', head: true })
          .is('document_id', null);
        
        if (error) throw error;
        setSavedSets(count || 0);
      } catch (err) {
        console.error('Error fetching flashcard sets:', err);
      }
    };
    
    fetchSavedSets();
  }, [user]);

  const generateFlashcards = async () => {
    if ((inputMode === 'topic' && !topic.trim()) || 
        (inputMode === 'content' && !content.trim())) {
      setError('Please provide either a topic or content to generate flashcards.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/flashcards/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: inputMode === 'topic' ? topic : undefined,
          content: inputMode === 'content' ? content : undefined,
        }),
      });
      
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
      
      if (!data.flashcards || !Array.isArray(data.flashcards) || data.flashcards.length === 0) {
        throw new Error('No flashcards were generated. Please try again with different input.');
      }

      setFlashcards(data.flashcards);
      setCurrentCardIndex(0);
      setFlipped(false);
    } catch (err) {
      console.error('Flashcard generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToNotes = async () => {
    if (!user || flashcards.length === 0) return;
    
    setIsSaving(true);
    try {
      // Save flashcards to database
      const { data, error } = await createFlashcards(
        flashcards.map(card => ({
          document_id: null, // Not associated with a document
          front: card.front,
          back: card.back
        }))
      );
      
      if (error) throw error;
      
      // Show success message
      setSaveSuccess(true);
      setSavedSets(prev => prev + 1);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving flashcards:', err);
      setError('Failed to save flashcards. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
      }, 200);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex - 1);
      }, 200);
    }
  };

  const resetGenerator = () => {
    setFlashcards([]);
    setTopic('');
    setContent('');
    setError(null);
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Create & Practice Flashcards</h2>
            <p className="text-sm text-gray-600">
              Need flashcards? Enter any content or topic to generate interactive study cards
            </p>
          </div>
        </div>
        {savedSets > 0 && (
          <div className="bg-amber-100 px-3 py-1 rounded-full text-amber-800 text-sm font-medium">
            {savedSets} saved {savedSets === 1 ? 'set' : 'sets'}
          </div>
        )}
      </CardHeader>
      
      <CardBody>
        {flashcards.length === 0 ? (
          <div className="space-y-6">
            {/* Input Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setInputMode('topic')}
                className={`px-4 py-2 font-medium ${
                  inputMode === 'topic'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Generate by Topic
              </button>
              <button
                onClick={() => setInputMode('content')}
                className={`px-4 py-2 font-medium ${
                  inputMode === 'content'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Generate from Content
              </button>
            </div>

            {/* Topic Input */}
            {inputMode === 'topic' && (
              <div className="space-y-4">
                <Input
                  label="Enter a Topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Photosynthesis, World War II, Machine Learning..."
                  fullWidth
                />
                <p className="text-sm text-gray-600">
                  Enter any topic and our AI will generate flashcards with key concepts, definitions, and applications.
                </p>
              </div>
            )}

            {/* Content Input */}
            {inputMode === 'content' && (
              <div className="space-y-4">
                <Textarea
                  label="Paste Your Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste text from your notes, textbooks, or any learning material..."
                  rows={6}
                  fullWidth
                />
                <p className="text-sm text-gray-600">
                  Paste your study material and our AI will extract key concepts and create targeted flashcards.
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={generateFlashcards}
                isLoading={isGenerating}
                leftIcon={isGenerating ? undefined : <Zap size={16} />}
                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                {isGenerating ? 'Generating...' : 'Generate Flashcards'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Flashcard Display */}
            <div className="relative">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Flashcard {currentCardIndex + 1} of {flashcards.length}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetGenerator}
                  leftIcon={<RotateCw size={14} />}
                  className="border-gray-300"
                >
                  Start Over
                </Button>
              </div>

              {/* Flashcard */}
              <div className="w-full h-[250px] perspective-1000 mx-auto mb-4">
                <motion.div
                  className="w-full h-full relative preserve-3d transition-all duration-500"
                  animate={{ rotateY: flipped ? 180 : 0 }}
                >
                  {/* Front */}
                  <div 
                    className={`absolute inset-0 backface-hidden bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 shadow-lg flex flex-col ${flipped ? 'pointer-events-none' : 'pointer-events-auto'}`}
                    onClick={() => setFlipped(true)}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen size={18} className="text-amber-600" />
                      <h4 className="font-semibold text-amber-800">Question</h4>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-xl font-medium text-center text-gray-800">
                        {flashcards[currentCardIndex]?.front || 'Loading...'}
                      </p>
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-sm text-amber-600">Click to see answer</p>
                    </div>
                  </div>

                  {/* Back */}
                  <div 
                    className={`absolute inset-0 backface-hidden bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200 shadow-lg flex flex-col rotateY-180 ${flipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    onClick={() => setFlipped(false)}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={18} className="text-orange-600" />
                      <h4 className="font-semibold text-orange-800">Answer</h4>
                    </div>
                    <div className="flex-1 overflow-auto flex items-center">
                      <p className="text-gray-800 leading-relaxed">
                        {flashcards[currentCardIndex]?.back || 'Loading...'}
                      </p>
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-sm text-orange-600">Click to see question</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={prevCard}
                  disabled={currentCardIndex === 0}
                  leftIcon={<ChevronLeft size={16} />}
                  className="border-amber-200 text-amber-600 hover:bg-amber-50"
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
                      className={`w-2.5 h-2.5 rounded-full ${
                        idx === currentCardIndex
                          ? 'bg-amber-600'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={nextCard}
                  disabled={currentCardIndex === flashcards.length - 1}
                  rightIcon={<ChevronRight size={16} />}
                  className="border-amber-200 text-amber-600 hover:bg-amber-50"
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Save to Notes Button */}
            <div className="flex justify-end">
              <AnimatePresence>
                {saveSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg"
                  >
                    <CheckCircle size={16} />
                    <span>Flashcards saved successfully!</span>
                  </motion.div>
                ) : (
                  <Button
                    onClick={handleSaveToNotes}
                    isLoading={isSaving}
                    leftIcon={isSaving ? undefined : <Save size={16} />}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isSaving ? 'Saving...' : 'Save to Notes'}
                  </Button>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};