
import { Brain, User } from 'lucide-react';

interface ChatMessageProps {
  message: {
    content: string;
    isAI: boolean;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { content, isAI } = message;

  return (
    <div className={`flex items-start space-x-3 ${isAI ? '' : 'justify-end'}`}>
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Brain size={16} className="text-purple-600" />
        </div>
      )}
      
      <div className={`rounded-lg p-3 max-w-[80%] ${
        isAI ? 'bg-gray-100' : 'bg-blue-100'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-blue-600" />
        </div>
      )}
    </div>
  );
};