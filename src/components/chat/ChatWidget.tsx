import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if we're on mobile
  const isMobile = window.innerWidth < 768;

  return (
    <div className={`fixed ${isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'} z-50 flex flex-col items-end gap-2`}>
      {isOpen && (
        <div className="transition-all duration-300">
          <ChatInterface />
        </div>
      )}
      <button
        className="p-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg hover:scale-105 transition"
        onClick={() => setIsOpen(v => !v)}
        aria-label="Open chat"
        style={{ minHeight: '56px', minWidth: '56px' }}
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}