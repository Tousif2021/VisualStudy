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
  Loader2
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

  useEffect(() => {
    if (documentId) {
      loadFlashcards();
    } else {
      setLoading(false);
    }
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
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Interactive Flashcards</h2>
            <p className="text-sm text-gray-600">
              {flashcards.length > 0 
                ? `Practice with ${flashcards.length} flashcards` 
                : "Generate flashcards to enhance your learning"}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowGenerator(true)}
          leftIcon={<Plus size={16} />}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
        >
          {flashcards.length > 0 ? "Create More" : "Generate Flashcards"}
        </Button>
      </CardHeader>
      
      <CardBody>
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
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadFlashcards} 
              className="mt-2"
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
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 flex items-center justify-center"
            >
              <Sparkles size={32} className="text-indigo-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Flashcards Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create interactive flashcards to test your knowledge and improve retention through active recall.
            </p>
            <Button
              onClick={() => setShowGenerator(true)}
              leftIcon={<Plus size={16} />}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
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
                  className={`absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-indigo-200 shadow-lg flex flex-col ${flipped ? 'pointer-events-none' : 'pointer-events-auto'}`}
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
                    <p className="text-sm text-indigo-600">Click to see answer</p>
                  </div>
                </div>

                {/* Back */}
                <div 
                  className={`absolute inset-0 backface-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg flex flex-col rotateY-180 ${flipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
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
                    <p className="text-sm text-blue-600">Click to see question</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation and Save Controls */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevCard}
                disabled={currentIndex === 0}
                leftIcon={<ChevronLeft size={16} />}
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {flashcards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFlipped(false);
                      setTimeout(() => setCurrentIndex(idx), 200);
                    }}
                    className={`w-2.5 h-2.5 rounded-full ${
                      idx === currentIndex
                        ? 'bg-indigo-600'
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