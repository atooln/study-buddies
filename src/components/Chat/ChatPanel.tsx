import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: number;
}

interface ChatPanelProps {
  documentId?: string;
}

const ChatPanel = ({ documentId }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isAI: false,
      timestamp: Date.now(),
    };

    // Add AI response (mock)
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `I'm your study assistant! I see you wrote: "${input}"`,
      isAI: true,
      timestamp: Date.now() + 1,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isAI ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.isAI
                    ? "bg-gray-50 text-gray-700"
                    : "bg-blue-600 text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="flex-none p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors"
            aria-label="Attach file"
          >
            <span className="w-5 h-5 flex items-center justify-center">📎</span>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-50 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200"
            placeholder="Type message..."
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:hover:bg-black"
            aria-label="Send message"
          >
            <span className="w-5 h-5 flex items-center justify-center">➤</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
