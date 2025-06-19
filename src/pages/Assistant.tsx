import { ChatInterface } from '../components/chat/ChatInterface';

export const Assistant: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">AI Study Assistant</h1>
        <div className="bg-white rounded-2xl shadow-lg">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};