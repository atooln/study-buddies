"use client";

import React, { useState, useEffect } from "react";

interface DocumentEditorProps {
  onSaveStateChange?: (isSaved: boolean, lastSaved?: string) => void;
  onTitleChange?: (title: string) => void;
  title?: string;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  onSaveStateChange,
  onTitleChange,
  title = "Untitled Document",
}) => {
  const [content, setContent] = useState<string>("");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onSaveStateChange?.(false);

    // Debounced save
    const timeoutId = setTimeout(() => {
      localStorage.setItem("document_content", newContent);
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      onSaveStateChange?.(true, currentTime);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  // Load initial content only once
  useEffect(() => {
    const savedContent = localStorage.getItem("document_content");
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <textarea
            className="w-full h-full p-0 border-0 focus:ring-0 resize-none text-gray-700 leading-relaxed outline-none"
            placeholder="Start writing..."
            value={content}
            onChange={handleContentChange}
            spellCheck="true"
          ></textarea>
        </div>
      </div>

      <div className="flex items-center justify-end p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors border border-gray-200 text-sm font-medium">
            Format
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
