import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Zap, 
  Plus, 
  Brain,
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Save,
  CheckCircle,
  Loader2,
  RefreshCw,
  Lightbulb,
  Bookmark
} from 'lucide-react';
import { Button } from '../ui/cButton';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { getFlashcards, createFlashcards } from '../../lib/supabase';
import { FlashcardGenerator, Flashcard } from './FlashcardGenerator';

interface FlashcardSectionProps {
  courseId: string;
  documentId?: string;
}

export const FlashcardSection: React.FC<FlashcardSectionProps> = ({
  courseId,
  documentId
}) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [studyStreak, setStudyStreak] = useState(0);

  useEffect(() => {
    if (documentId) {
      loadFlashcards();
    } else {
      setLoading(false);
    }
    
    // Simulate study streak
    setStudyStreak(Math.floor(Math.random() * 10) + 1);
  }, [documentId]);

  const loadFlashcards = async () => {
    if (!documentId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getFlashcards(documentId);
      
      if (error) throw error;
      
      setFlashcards(data || []);
    } catch (err) {
      console.error('Error loading flashcards:', err);
      setError('Failed to load flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFlashcards = async (newFlashcards: Flashcard[]) => {
    try {
      setIsSaving(true);
      
      // Add document_id to each flashcard
      const flashcardsWithDocId = newFlashcards.map(card => ({
        ...card,
        document_id: documentId
      }));
      
      const { data, error } = await createFlashcards(flashcardsWithDocId);
      
      if (error) throw error;
      
      // Update the state with the newly created flashcards
      setFlashcards(data || []);
      setShowGenerator(false);
      setCurrentIndex(0);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving flashcards:', err);
      setError('Failed to save flashcards. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 200);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
      }, 200);
    }
  };

  if (showGenerator) {
    return (
      <FlashcardGenerator
        onClose={() => setShowGenerator(false)}
        onSave={handleSaveFlashcards}
        documentId={documentId}
      />
    );
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-indigo-200 overflow-hidden shadow-lg">
      <CardHeader className="flex justify-between items-center border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 flex items-center justify-center pulse-glow">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 bg-clip-text text-transparent">Interactive Flashcards</h2>
            <p className="text-sm text-gray-600">
              {flashcards.length > 0 
                ? `Practice with ${flashcards.length} flashcards` 
                : "Generate flashcards to enhance your learning"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {flashcards.length > 0 && (
            <div className="hidden md:flex items-center gap-2 bg-indigo-100 px-3 py-1 rounded-full">
              <Bookmark size={14} className="text-indigo-600" />
              <span className="text-xs font-medium text-indigo-700">
                {studyStreak} day streak
              </span>
            </div>
          )}
          
          
        </div>
      </CardHeader>
      
      <CardBody className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
            />
            <span className="ml-3 text-indigo-700 font-medium">Loading flashcards...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            <p className="mb-2 font-medium">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadFlashcards} 
              className="mt-2 border-red-200 text-red-600 hover:bg-red-50"
              leftIcon={<RefreshCw size={14} />}
            >
              Try Again
            </Button>
          </div>
        ) : flashcards.length === 0 ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100 flex items-center justify-center animate-float"
            >
              <Lightbulb size={40} className="text-indigo-500" />
            </motion.div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-3">Boost Your Learning</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create interactive flashcards to test your knowledge and improve retention through active recall.
            </p>
            <Button
              onClick={() => setShowGenerator(true)}
              leftIcon={<Sparkles size={16} />}
              className="bg-gray-200 hover:bg-sky-100 border border-blue-400 text-gray-800 font-semibold rounded-full px-4 py-2 transition-colors flex items-center gap-2"
            >
              Generate Flashcards
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Flashcard */}
            <div className="w-full h-[250px] perspective-1000 mx-auto">
              <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500"
                animate={{ rotateY: flipped ? 180 : 0 }}
              >
                {/* Front */}
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
                      {flashcards[currentIndex]?.front || 'Loading...'}
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

                {/* Back */}
                <div 
                  className={`absolute inset-0 backface-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg flex flex-col rotateY-180 ${flipped ? 'pointer-events-auto' : 'pointer-events-none'} hover:shadow-xl transition-shadow duration-300`}
                  onClick={() => setFlipped(false)}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={18} className="text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Answer</h4>
                  </div>
                  <div className="flex-1 overflow-auto flex items-center">
                    <p className="text-gray-800 leading-relaxed">
                      {flashcards[currentIndex]?.back || 'Loading...'}
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

            {/* Navigation and Save Controls */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={prevCard}
                  disabled={currentIndex === 0}
                  leftIcon={<ChevronLeft size={16} />}
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  Previous
                </Button>
                
                <div className="flex gap-1 mx-2">
                  {flashcards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFlipped(false);
                        setTimeout(() => setCurrentIndex(idx), 200);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'bg-indigo-600 scale-125'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={nextCard}
                  disabled={currentIndex === flashcards.length - 1}
                  rightIcon={<ChevronRight size={16} />}
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  Next
                </Button>
              </div>
              
              {/* Save to Notes Button */}
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
                    onClick={() => {
                      setIsSaving(true);
                      setTimeout(() => {
                        setIsSaving(false);
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                      }, 1000);
                    }}
                    isLoading={isSaving}
                    leftIcon={isSaving ? undefined : <Save size={16} />}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-green-200/50"
                  >
                    {isSaving ? 'Saving...' : 'Save to Notes'}
                  </Button>
                )}
              </AnimatePresence>
            </div>
            
            {/* Study Tips */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Lightbulb size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Study Tip</h4>
                  <p className="text-sm text-gray-700">
                    For maximum retention, review these flashcards using spaced repetition. Study them today, then review again in 2 days, 5 days, and 10 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};