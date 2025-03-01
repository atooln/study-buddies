"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I can help you with that! What would you like assistance with?",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    // Add user message based on the quick action
    const userMessage: Message = {
      id: Date.now().toString(),
      text: action,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate assistant response
    setTimeout(() => {
      let response = "";

      switch (action) {
        case "Create Notes from PDF":
          response =
            "I'd be happy to help you create notes from your PDF. Please upload the document you'd like me to analyze.";
          break;
        case "Draft an outline":
          response =
            "I can help you draft an outline. What topic would you like to create an outline for?";
          break;
        case "Make a flowchart":
          response =
            "I can help you create a flowchart. What process or concept would you like to visualize?";
          break;
        case "Need encouragement?":
          response =
            "You're doing great! Remember that consistent effort leads to progress. Take breaks when needed, stay hydrated, and be proud of how far you've come!";
          break;
        default:
          response = "How can I assist you with this task?";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Quick action buttons */}
      <div className="flex flex-col space-y-2 p-4">
        <button
          onClick={() => handleQuickAction("Create Notes from PDF")}
          className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-50 text-gray-700 transition-colors border border-gray-200 text-sm"
        >
          Create Notes from PDF
        </button>
        <button
          onClick={() => handleQuickAction("Draft an outline")}
          className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-50 text-gray-700 transition-colors border border-gray-200 text-sm"
        >
          Draft an outline
        </button>
        <button
          onClick={() => handleQuickAction("Make a flowchart")}
          className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-50 text-gray-700 transition-colors border border-gray-200 text-sm"
        >
          Make a flowchart
        </button>
        <button
          onClick={() => handleQuickAction("Need encouragement?")}
          className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-50 text-gray-700 transition-colors border border-gray-200 text-sm"
        >
          Need encouragement?
        </button>
      </div>

      {/* Chat messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input area */}
      <div className="p-4 mt-auto">
        <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1-5.5a1 1 0 0 1-2 0V9a1 1 0 0 1 2 0v4z" />
            </svg>
          </button>
          <input
            type="text"
            className="flex-1 border-0 bg-transparent focus:ring-0 outline-none px-3 py-2 text-sm"
            placeholder="Type message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="p-2 text-gray-500 hover:text-gray-700 mr-1"
            onClick={() => {}}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <button
            className={`p-2 text-gray-500 hover:text-gray-700 mr-1 ${
              !inputValue.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
