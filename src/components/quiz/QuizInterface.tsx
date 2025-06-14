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
  Target,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';

interface QuizQuestion {
  type: 'mcq' | 'open';
  question: string;
  options?: string[];
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [openAnswer, setOpenAnswer] = useState<string>('');
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  useEffect(() => {
    generateQuiz();
  }, [documentId]);

  useEffect(() => {
    if (timeStarted && !showResults) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - timeStarted.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeStarted, showResults]);

  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting quiz generation for document:', documentId);
      
      // Get document content from Supabase
      const { supabase } = await import('../../lib/supabase');
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('content, file_path, name')
        .eq('id', documentId)
        .single();

      if (docError) {
        console.error('Document fetch error:', docError);
        throw new Error('Failed to fetch document: ' + docError.message);
      }

      console.log('Document fetched:', { 
        hasContent: !!document.content, 
        contentLength: document.content?.length,
        filePath: document.file_path 
      });

      let content = document.content;
      
      // If no content, try to get it from the file
      if (!content && document.file_path) {
        console.log('No content found, trying to get signed URL...');
        const { data: urlData, error: urlError } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.file_path, 3600);

        if (urlError) {
          console.error('URL generation error:', urlError);
          throw new Error('Failed to access document file');
        }

        // For documents without extracted content, we'll use a sample content
        content = `This is a study document titled "${document.name}". The document contains educational material that can be used for learning and assessment. Students should review the content carefully and understand the key concepts presented. The material covers important topics that are relevant to the subject matter and should be studied thoroughly for better comprehension.`;
      }

      if (!content || content.trim().length < 50) {
        throw new Error('Document content is too short or empty for quiz generation');
      }

      console.log('Sending content to quiz API, length:', content.length);

      // Call the quiz generation API with better error handling
      const response = await fetch('http://localhost:4000/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      console.log('Quiz API response status:', response.status);
      console.log('Quiz API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Quiz API error response:', responseText);
        
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch (parseError) {
          // If response is not JSON (like HTML error page), throw a more specific error
          if (responseText.includes('<!DOCTYPE') || responseText.includes('<html>')) {
            throw new Error('Server returned an error page. Please check if the AI backend is running on port 4000.');
          }
          throw new Error(`Server error: ${response.status} - ${responseText.substring(0, 100)}`);
        }
      }

      const data = await response.json();
      console.log('Quiz data received:', { questionsCount: data.quiz?.length });

      if (!data.quiz || !Array.isArray(data.quiz) || data.quiz.length === 0) {
        throw new Error('No quiz questions were generated');
      }

      setQuiz(data.quiz);
      setUserAnswers(new Array(data.quiz.length).fill(''));
      setTimeStarted(new Date());
      
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const currentQuestion = quiz[currentQuestionIndex];
    const answer = currentQuestion.type === 'mcq' ? selectedAnswer : openAnswer;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(newAnswers[currentQuestionIndex + 1] || '');
      setOpenAnswer(newAnswers[currentQuestionIndex + 1] || '');
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || '');
      setOpenAnswer(userAnswers[currentQuestionIndex - 1] || '');
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((question, index) => {
      if (question.type === 'mcq' && userAnswers[index] === question.answer) {
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
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(quiz.length).fill(''));
    setSelectedAnswer('');
    setOpenAnswer('');
    setShowResults(false);
    setTimeStarted(new Date());
    setTimeElapsed(0);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4"
            >
              <Brain size={32} className="text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Generating Quiz</h3>
            <p className="text-gray-600">AI is analyzing "{documentName}" and creating personalized questions...</p>
            <div className="mt-4 text-sm text-gray-500">This may take a few moments</div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Quiz Generation Failed</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} fullWidth>
                Close
              </Button>
              <Button onClick={generateQuiz} fullWidth>
                Try Again
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const mcqQuestions = quiz.filter(q => q.type === 'mcq').length;
    const percentage = mcqQuestions > 0 ? Math.round((score / mcqQuestions) * 100) : 0;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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
                <div className="text-2xl font-bold text-blue-600">{score}/{mcqQuestions}</div>
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
              {quiz.map((question, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      question.type === 'mcq' && userAnswers[index] === question.answer
                        ? 'bg-green-100 text-green-600'
                        : question.type === 'mcq'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {question.type === 'mcq' && userAnswers[index] === question.answer ? (
                        <CheckCircle size={16} />
                      ) : question.type === 'mcq' ? (
                        <X size={16} />
                      ) : (
                        <Brain size={16} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">{question.question}</h4>
                      {question.type === 'mcq' && (
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-gray-600">Your answer: </span>
                            <span className={userAnswers[index] === question.answer ? 'text-green-600 font-medium' : 'text-red-600'}>
                              {userAnswers[index] || 'Not answered'}
                            </span>
                          </div>
                          {userAnswers[index] !== question.answer && (
                            <div className="text-sm">
                              <span className="text-gray-600">Correct answer: </span>
                              <span className="text-green-600 font-medium">{question.answer}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {question.type === 'open' && (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600">Your answer: </span>
                            <div className="mt-1 p-2 bg-gray-50 rounded text-gray-800">
                              {userAnswers[index] || 'Not answered'}
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Sample answer: </span>
                            <div className="mt-1 p-2 bg-blue-50 rounded text-blue-800">
                              {question.answer}
                            </div>
                          </div>
                        </div>
                      )}
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
                Retake Quiz
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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

                {currentQuestion?.type === 'mcq' && (
                  <div className="space-y-3 ml-11">
                    {currentQuestion.options?.map((option, index) => (
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
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedAnswer === option
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedAnswer === option && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {currentQuestion?.type === 'open' && (
                  <div className="ml-11">
                    <textarea
                      value={openAnswer}
                      onChange={(e) => setOpenAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                      rows={4}
                    />
                  </div>
                )}
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
            disabled={
              currentQuestion?.type === 'mcq' 
                ? !selectedAnswer 
                : !openAnswer.trim()
            }
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