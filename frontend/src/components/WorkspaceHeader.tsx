"use client";

import React from "react";
import Image from "next/image";
import { WorkspaceType } from "../store/workspaceStore";

interface WorkspaceHeaderProps {
  type: WorkspaceType;
  isSaved?: boolean;
  lastSaved?: string;
  title?: string;
  onTitleChange?: (title: string) => void;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  type,
  isSaved = true,
  lastSaved,
  title = "Untitled Document",
  onTitleChange,
}) => {
  const getImagePath = () => {
    return `/assets/pixel_${type}_static.svg`;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (onTitleChange) {
      onTitleChange(newTitle);
      localStorage.setItem("document_title", newTitle);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center flex-1">
        <div className="w-10 h-10 relative mr-3">
          <Image
            src={getImagePath()}
            alt={`${type} buddy`}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <input
          type="text"
          defaultValue={title}
          onChange={handleTitleChange}
          className="flex-1 text-xl font-semibold border-0 focus:ring-0 focus:border-b-2 focus:border-blue-500 text-gray-800 bg-transparent transition-colors"
          placeholder="Untitled Document"
        />
      </div>

      <div className="text-sm text-gray-500 flex items-center ml-4">
        <span
          className={`w-2 h-2 rounded-full mr-2 ${
            isSaved ? "bg-green-500" : "bg-yellow-500"
          }`}
        ></span>
        {isSaved
          ? lastSaved
            ? `Last saved at ${lastSaved}`
            : "All changes saved"
          : "Saving..."}
      </div>
    </div>
  );
};

export default WorkspaceHeader;
