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
  Edit2
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

  useEffect(() => {
    loadFlashcards();
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
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RotateCw size={24} className="text-blue-600" />
              </motion.div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Flashcards</h3>
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
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} className="text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Flashcards Found</h3>
            <p className="text-gray-600 mb-4">There are no flashcards for "{documentName}" yet.</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                onClick={() => setShowGenerator(true)}
                leftIcon={<Plus size={16} />}
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
        <CardHeader className="flex justify-between items-center border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Flashcards: {documentName}</h2>
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
                  className={`absolute inset-0 backface-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg flex flex-col ${flipped ? 'pointer-events-none' : 'pointer-events-auto'}`}
                  onClick={() => setFlipped(true)}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={18} className="text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Question</h4>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl font-medium text-center text-gray-800">
                      {flashcards[currentIndex]?.front || 'Loading...'}
                    </p>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-blue-600">Click to see answer</p>
                  </div>
                </div>

                {/* Back */}
                <div 
                  className={`absolute inset-0 backface-hidden bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 shadow-lg flex flex-col rotateY-180 ${flipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
                  onClick={() => setFlipped(false)}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={18} className="text-purple-600" />
                    <h4 className="font-semibold text-purple-800">Answer</h4>
                  </div>
                  <div className="flex-1 overflow-auto flex items-center">
                    <p className="text-gray-800 leading-relaxed">
                      {flashcards[currentIndex]?.back || 'Loading...'}
                    </p>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-purple-600">Click to see question</p>
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
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
                        ? 'bg-blue-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                onClick={handleNext}
                rightIcon={<ChevronRight size={16} />}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Next
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFlipped(!flipped)}
              leftIcon={<RotateCw size={14} />}
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
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