import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-2">
          <ChatInterface />
        </div>
      )}
      <button
        className="p-3 rounded-full bg-blue-600 text-white shadow-lg"
        onClick={() => setIsOpen(v => !v)}
        aria-label="Open chat"
      >
        <MessageCircle size={24}/>
      </button>
    </div>
  );
}
