import React, { useState, useRef, useEffect } from "react";
import { SendHorizonal, Bot } from "lucide-react";
import { askAI } from "../../lib/ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // GitHub flavored markdown
import rehypeRaw from "rehype-raw"; // To support raw HTML inside markdown
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  content: string;
  isAI: boolean;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { content: "👋 Hi! I'm your study mentor. How can I help you today?", isAI: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { content: userMessage, isAI: false }]);
    setIsLoading(true);

    try {
      const response = await askAI(userMessage);
      setMessages(prev => [...prev, { content: response, isAI: true }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { content: "Sorry, something went wrong. Try again.", isAI: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Custom renderer for code blocks with syntax highlighting
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props} style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '4px' }}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="w-[280px] sm:w-[320px] h-[460px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">

      {/* Chat Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white flex items-center gap-2 font-semibold text-lg">
        <Bot size={22} />
        Study Mentor
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isAI ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`
                max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-md whitespace-pre-wrap
                ${msg.isAI
                  ? "bg-gray-200 text-gray-900 rounded-bl-none"
                  : "bg-blue-600 text-white rounded-br-none"
                }
              `}
              style={{ wordBreak: "break-word" }}
            >
              {msg.isAI ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={renderers}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-400 animate-pulse select-none">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-white border-t flex items-center gap-2">
        <textarea
          rows={1}
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="Message input"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className={`ml-2 p-2 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 active:scale-90 transition
            ${isLoading || !input.trim() ? "opacity-60 cursor-not-allowed" : ""}
          `}
          aria-label="Send message"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
};
