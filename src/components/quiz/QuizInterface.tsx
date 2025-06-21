import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  CheckCircle, 
  X, 
  RotateCcw, 
  Trophy, 
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Wifi,
  WifiOff,
  Target,
  Loader
} from 'lucide-react';
import { Button } from '../ui/cButton';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { QuizGenerator } from './QuizGenerator';

// --- Types ---
interface QuizQuestion {
  type: 'mcq';
  question: string;
  options: string[];
  answer: string;
}

interface QuizInterfaceProps {
  documentId: string;
  documentName: string;
  onClose: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({
  documentId,
  documentName,
  onClose
}) => {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [showGenerator, setShowGenerator] = useState(true);
  const [documentContent, setDocumentContent] = useState<string>('');

  // --- Auto-refresh timer ---
  useEffect(() => {
    if (timeStarted && !showResults) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - timeStarted.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeStarted, showResults]);

  // Fetch document content when component mounts
  useEffect(() => {
    const fetchDocumentContent = async () => {
      try {
        const { supabase } = await import('../../lib/supabase');
        const { data, error } = await supabase
          .from('documents')
          .select('content')
          .eq('id', documentId)
          .single();

        if (error) throw error;
        if (data?.content) {
          setDocumentContent(data.content);
        }
      } catch (err) {
        console.error('Error fetching document content:', err);
        // We'll continue without content and let the generator handle it
      }
    };

    fetchDocumentContent();
  }, [documentId]);

  const handleSaveQuiz = (generatedQuiz: QuizQuestion[]) => {
    setQuiz(generatedQuiz);
    setUserAnswers(new Array(generatedQuiz.length).fill(''));
    setTimeStarted(new Date());
    setShowGenerator(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResults(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(newAnswers[currentQuestionIndex + 1] || '');
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || '');
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const restartQuiz = () => {
    setShowGenerator(true);
  };

  // If showing the generator, render it
  if (showGenerator) {
    return (
      <QuizGenerator
        onClose={onClose}
        onSave={handleSaveQuiz}
        initialContent={documentContent}
        documentId={documentId}
      />
    );
  }

  // If showing results
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.length) * 100);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                }`}
              >
                <Trophy size={40} className={
                  percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                } />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
              <p className="text-gray-600">Here are your results for "{documentName}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{score}/{quiz.length}</div>
                <div className="text-sm text-blue-600">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{percentage}%</div>
                <div className="text-sm text-purple-600">Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-green-600">Time Taken</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {quiz.map((question, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      userAnswers[idx] === question.answer
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {userAnswers[idx] === question.answer ? (
                        <CheckCircle size={16} />
                      ) : (
                        <X size={16} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">{question.question}</h4>
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => (
                          <div 
                            key={optIdx}
                            className={`p-3 rounded-lg ${
                              option === question.answer
                                ? 'bg-green-50 border border-green-200'
                                : option === userAnswers[idx] && option !== question.answer
                                ? 'bg-red-50 border border-red-200'
                                : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            {option}
                            {option === question.answer && (
                              <span className="ml-2 text-green-600 text-sm font-medium">✓ Correct</span>
                            )}
                            {option === userAnswers[idx] && option !== question.answer && (
                              <span className="ml-2 text-red-600 text-sm font-medium">✗ Your answer</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} fullWidth>
                Close
              </Button>
              <Button onClick={restartQuiz} leftIcon={<RotateCcw size={16} />} fullWidth>
                New Quiz
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main quiz view
  const currentQuestion = quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Quiz: {documentName}</h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quiz.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                {formatTime(timeElapsed)}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {currentQuestionIndex + 1}
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 leading-relaxed">
                    {currentQuestion?.question}
                  </h3>
                </div>

                <div className="space-y-3 ml-11">
                  {currentQuestion?.options?.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === option
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                          selectedAnswer === option
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            leftIcon={<ArrowLeft size={16} />}
          >
            Previous
          </Button>
          <div className="text-sm text-gray-600">
            {currentQuestionIndex + 1} / {quiz.length}
          </div>
          <Button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            rightIcon={<ArrowRight size={16} />}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {currentQuestionIndex === quiz.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizInterface;