import { useState } from "react";

interface DocumentEditorProps {
  documentId?: string;
}

const DocumentEditor = ({ documentId }: DocumentEditorProps) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Document");

  return (
    <div className="h-full flex flex-col">
      {/* Title input */}
      <div className="flex-none p-6 border-b border-gray-200">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400"
          placeholder="Untitled Document"
        />
      </div>

      {/* Content editor */}
      <div className="flex-1 overflow-auto">
        <div className="h-full p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full resize-none bg-transparent border-none text-lg text-gray-700 focus:outline-none focus:ring-0 placeholder-gray-400"
            placeholder="Start typing your document..."
            spellCheck={true}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
