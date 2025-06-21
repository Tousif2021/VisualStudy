import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Zap, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../ui/cButton';

interface Flashcard {
  id?: string;
  front: string;
  back: string;
  document_id?: string;
}

interface FlashcardSetProps {
  flashcards: Flashcard[];
  title: string;
  onClose: () => void;
}

export const FlashcardSet: React.FC<FlashcardSetProps> = ({
  flashcards,
  title,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-orange-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm text-gray-600">
                Card {currentIndex + 1} of {flashcards.length}
              </p>
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
        </div>

        <div className="p-6">
          {/* Flashcard */}
          <div className="w-full h-[300px] perspective-1000 mx-auto mb-6">
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
                    {flashcards[currentIndex]?.front || 'Loading...'}
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
                    {flashcards[currentIndex]?.back || 'Loading...'}
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
              onClick={handlePrevious}
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
                    setTimeout(() => setCurrentIndex(idx), 200);
                  }}
                  className={`w-2.5 h-2.5 rounded-full ${
                    idx === currentIndex
                      ? 'bg-amber-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              onClick={handleNext}
              rightIcon={<ChevronRight size={16} />}
              className="border-amber-200 text-amber-600 hover:bg-amber-50"
            >
              Next
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};