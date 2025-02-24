import { useState } from "react";

export const Editor = () => {
  const [content, setContent] = useState("");

  return (
    <div className="h-full flex flex-col">
      {/* Main editor area */}
      <div className="flex-1 min-h-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full p-6 text-lg font-normal text-gray-800 bg-white resize-none focus:outline-none"
          placeholder="Start writing..."
          spellCheck={true}
        />
      </div>

      {/* Status bar */}
      <div className="flex-none h-8 bg-gray-100 border-t border-gray-200 px-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          Words: {content.trim() ? content.trim().split(/\s+/).length : 0}
        </div>
        <div>Characters: {content.length}</div>
      </div>
    </div>
  );
};
