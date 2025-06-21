import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  X, 
  Loader2, 
  Target, 
  BookOpen, 
  Send, 
  RotateCw, 
  Save, 
  Download, 
  Copy, 
  Check,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { Button } from '../ui/cButton';
import { Textarea } from '../ui/Textarea';
import { Card, CardBody, CardHeader } from '../ui/Card';

interface QuizGeneratorProps {
  onClose: () => void;
  onSave: (quiz: QuizQuestion[]) => void;
  initialContent?: string;
  documentId?: string;
}

export interface QuizQuestion {
  type: string;
  question: string;
  options: string[];
  answer: string;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  onClose,
  onSave,
  initialContent = '',
  documentId
}) => {
  const [content, setContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

  const generateQuiz = async () => {
    if (!content.trim()) {
      setError('Please provide content to generate a quiz.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setDebugInfo('Starting quiz generation...');

    try {
      setDebugInfo('Sending content to AI...');
      console.log(`Sending request to ${apiBaseUrl}/api/quiz/generate`);
      
      const response = await fetch(`${apiBaseUrl}/api/quiz/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      setDebugInfo(`Response status: ${response.status}`);
      
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
      setDebugInfo('Received data from server');
      console.log('Received data:', data);
      
      if (!data.quiz || !Array.isArray(data.quiz) || data.quiz.length === 0) {
        throw new Error('No quiz questions were generated. Please try again with different content.');
      }

      setQuiz(data.quiz);
      setDebugInfo('Quiz generated successfully!');
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate quiz. Please try again.');
      setDebugInfo(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuiz = async () => {
    setIsSaving(true);
    try {
      // Add any pre-save processing here if needed
      onSave(quiz);
    } catch (err) {
      console.error('Error saving quiz:', err);
      setError('Failed to save quiz. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    const quizText = quiz.map((q, i) => 
      `Question ${i+1}: ${q.question}\n` +
      q.options.map((opt, j) => `${String.fromCharCode(65 + j)}. ${opt}`).join('\n') +
      `\nCorrect Answer: ${q.answer}\n\n`
    ).join('');
    
    navigator.clipboard.writeText(quizText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
        <CardHeader className="flex justify-between items-center border-b bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 flex items-center justify-center pulse-glow">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent">AI Quiz Generator</h2>
              <p className="text-sm text-gray-600">Create a custom quiz from any content</p>
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

        <CardBody className="p-0 overflow-auto max-h-[calc(90vh-80px)]">
          {quiz.length === 0 ? (
            <div className="p-6">
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
                      Paste your study material and our AI will generate multiple-choice questions to test your knowledge. The more specific your content, the better the questions.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Debug Info (hidden in production) */}
              {debugInfo && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-xs">
                  <p className="font-mono">{debugInfo}</p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={generateQuiz}
                  isLoading={isGenerating}
                  leftIcon={isGenerating ? undefined : <Sparkles size={16} />}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700"
                >
                  {isGenerating ? 'Generating...' : 'Generate Quiz'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
                  Generated Quiz ({quiz.length} questions)
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
                      setQuiz([]);
                    }}
                    leftIcon={<RotateCw size={14} />}
                  >
                    Start Over
                  </Button>
                </div>
              </div>

              {/* Quiz Questions */}
              <div className="space-y-6 mb-8">
                {quiz.map((question, qIndex) => (
                  <div key={qIndex} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {qIndex + 1}
                      </div>
                      <h4 className="font-medium text-gray-800">{question.question}</h4>
                    </div>
                    
                    <div className="ml-9 space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div 
                          key={oIndex}
                          className={`p-3 rounded-lg border ${
                            option === question.answer
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                              option === question.answer
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {String.fromCharCode(65 + oIndex)}
                            </div>
                            <div className={option === question.answer ? 'font-medium text-green-800' : ''}>
                              {option}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveQuiz}
                  isLoading={isSaving}
                  leftIcon={isSaving ? undefined : <Save size={16} />}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-green-200/50"
                >
                  {isSaving ? 'Saving...' : 'Save Quiz'}
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </motion.div>
    </motion.div>
  );
};