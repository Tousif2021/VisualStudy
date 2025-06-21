import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Trash2, 
  Download, 
  Plus,
  BookOpen,
  Zap,
  Edit2,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { Button } from '../ui/cButton';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { getFlashcards, deleteFlashcard } from '../../lib/supabase';
import { FlashcardGenerator, Flashcard } from './FlashcardGenerator';

interface FlashcardViewerProps {
  documentId: string;
  documentName: string;
  onClose: () => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  documentId,
  documentName,
  onClose
}) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [studyTips] = useState<string[]>([
    "Use active recall by trying to answer before flipping the card",
    "Space out your practice sessions for better long-term retention",
    "Create connections between new information and things you already know",
    "Review difficult cards more frequently than easy ones",
    "Explain concepts out loud to reinforce your understanding"
  ]);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    loadFlashcards();
    
    // Rotate through study tips
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % studyTips.length);
    }, 8000);
    
    return () => clearInterval(tipInterval);
  }, [documentId]);

  const loadFlashcards = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getFlashcards(documentId);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setFlashcards(data);
      } else {
        // If no flashcards exist, show the generator
        setShowGenerator(true);
      }
    } catch (err) {
      console.error('Error loading flashcards:', err);
      setError('Failed to load flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 200);
  };

  const handlePrevious = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
    }, 200);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this flashcard?')) {
      return;
    }
    
    setDeletingId(id);
    
    try {
      const { error } = await deleteFlashcard(id);
      
      if (error) throw error;
      
      // Remove from state
      setFlashcards((prev) => prev.filter((card) => card.id !== id));
      
      // Adjust current index if needed
      if (currentIndex >= flashcards.length - 1) {
        setCurrentIndex(Math.max(0, flashcards.length - 2));
      }
      
      if (flashcards.length <= 1) {
        // If this was the last flashcard, show the generator
        setShowGenerator(true);
      }
    } catch (err) {
      console.error('Error deleting flashcard:', err);
      setError('Failed to delete flashcard. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveFlashcards = async (newFlashcards: Flashcard[]) => {
    try {
      // Add document_id to each flashcard
      const flashcardsWithDocId = newFlashcards.map(card => ({
        ...card,
        document_id: documentId
      }));
      
      // Use the Supabase client to insert the flashcards
      const { supabase } = await import('../../lib/supabase');
      const { data, error } = await supabase
        .from('flashcards')
        .insert(flashcardsWithDocId)
        .select();
      
      if (error) throw error;
      
      // Update the state with the newly created flashcards
      setFlashcards(data || []);
      setShowGenerator(false);
      setCurrentIndex(0);
      setFlipped(false);
    } catch (err) {
      console.error('Error saving flashcards:', err);
      setError('Failed to save flashcards. Please try again.');
    }
  };

  const downloadFlashcards = () => {
    const content = flashcards.map((card, index) => 
      `Card ${index + 1}:\nQuestion: ${card.front}\nAnswer: ${card.back}\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards-${documentName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showGenerator) {
    return (
      <FlashcardGenerator
        onClose={onClose}
        onSave={handleSaveFlashcards}
        documentId={documentId}
      />
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles size={24} className="text-white" />
            </motion.div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-2">Loading Flashcards</h3>
            <p className="text-gray-600">Retrieving your flashcards for "{documentName}"...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <X size={24} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={loadFlashcards}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4 animate-float"
            >
              <BookOpen size={32} className="text-indigo-600" />
            </motion.div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-2">No Flashcards Found</h3>
            <p className="text-gray-600 mb-6">There are no flashcards for "{documentName}" yet.</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                onClick={() => setShowGenerator(true)}
                leftIcon={<Plus size={16} />}
                className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700"
              >
                Create Flashcards
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
      >
        <CardHeader className="flex justify-between items-center border-b bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 flex items-center justify-center pulse-glow">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 bg-clip-text text-transparent">Flashcards: {documentName}</h2>
              <p className="text-sm text-gray-600">
                Card {currentIndex + 1} of {flashcards.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGenerator(true)}
              leftIcon={<Plus size={16} />}
              className="border-green-300 text-green-600 hover:bg-green-50"
            >
              Add More
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardBody className="p-6">
          {/* Flashcard */}
          <div className="mb-8">
            <div className="relative w-full h-[300px] perspective-1000 mx-auto">
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

            {/* Navigation Controls */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
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
                onClick={handleNext}
                rightIcon={<ChevronRight size={16} />}
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                Next
              </Button>
            </div>
          </div>

          {/* Study Tip */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Lightbulb size={16} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Study Tip</h4>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-gray-700"
                  >
                    {studyTips[currentTip]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFlipped(!flipped)}
              leftIcon={<RotateCw size={14} />}
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              Flip Card
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadFlashcards}
              leftIcon={<Download size={14} />}
              className="border-green-200 text-green-600 hover:bg-green-50"
            >
              Download All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(flashcards[currentIndex].id!)}
              isLoading={deletingId === flashcards[currentIndex].id}
              leftIcon={deletingId === flashcards[currentIndex].id ? undefined : <Trash2 size={14} />}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Delete Card
            </Button>
          </div>
        </CardBody>
      </motion.div>
    </div>
  );
};