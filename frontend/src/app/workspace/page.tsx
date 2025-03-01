"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "../../store/workspaceStore";
import WorkspaceHeader from "../../components/WorkspaceHeader";
import Timer from "../../components/Timer";
import MusicPlayer from "../../components/MusicPlayer";
import ChatAssistant from "../../components/ChatAssistant";
import DocumentEditor from "../../components/DocumentEditor";

export default function Workspace() {
  const router = useRouter();
  const selectedWorkspace = useWorkspaceStore(
    (state) => state.selectedWorkspace
  );
  const [isSaved, setIsSaved] = useState(true);
  const [lastSaved, setLastSaved] = useState("");
  const [title, setTitle] = useState("Untitled Document");

  // Redirect to home if no workspace is selected
  useEffect(() => {
    if (!selectedWorkspace) {
      router.push("/");
    }
  }, [selectedWorkspace, router]);

  if (!selectedWorkspace) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top header with logo and workspace name */}
      <header className="border-b border-gray-200 py-3 px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">StudyBuddy</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Workspace header with buddy */}
          <WorkspaceHeader
            type={selectedWorkspace}
            isSaved={isSaved}
            lastSaved={lastSaved}
            title={title}
            onTitleChange={setTitle}
          />

          {/* Document editor area */}
          <div className="flex-1 overflow-auto p-6">
            <DocumentEditor
              onSaveStateChange={(saved, time) => {
                setIsSaved(saved);
                if (time) setLastSaved(time);
              }}
              title={title}
              onTitleChange={setTitle}
            />
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="w-96 border-l border-gray-200 flex flex-col bg-white">
          {/* Timer component */}
          <div className="p-4 border-b border-gray-200">
            <Timer />
          </div>

          {/* Music player */}
          <div className="p-4 border-b border-gray-200">
            <MusicPlayer />
          </div>

          {/* Study assistant */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium">Study Assistant</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <ChatAssistant />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
