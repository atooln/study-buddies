import { useState, useEffect, useCallback } from "react";
import DocumentEditor from "../components/Editor/DocumentEditor";
import ChatPanel from "../components/Chat/ChatPanel";

interface TimerState {
  running: boolean;
  timeLeft: number;
  totalStudyTime: number;
}

const NotebookPage = () => {
  const [selectedTab, setSelectedTab] = useState("Templates");
  const [timerState, setTimerState] = useState<TimerState>({
    running: false,
    timeLeft: 45 * 60,
    totalStudyTime: 4,
  });

  const toggleTimer = useCallback(() => {
    setTimerState((prev) => ({ ...prev, running: !prev.running }));
  }, []);

  useEffect(() => {
    let interval: number;
    if (timerState.running && timerState.timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimerState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [timerState.running]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      running: false,
      timeLeft: 45 * 60,
    }));
  }, []);

  const tabs = ["Templates", "Form", "Notes", "Presentation", "Mood Board"];

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <nav className="flex-none py-4 px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">StudyBuddy</h1>
            <div className="text-lg text-gray-400">| New Page</div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 min-h-0 flex p-4 gap-4">
        {/* Left panel - Editor */}
        <div className="flex-1 min-w-0 flex flex-col bg-white rounded-2xl shadow-sm">
          <div className="flex-1 min-h-0">
            <DocumentEditor documentId="notebook" />
          </div>
          {/* Bottom tabs */}
          <div className="flex-none p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className="flex-none px-4 py-2 rounded-2xl text-sm bg-black text-white hover:bg-gray-900 transition-colors duration-200 whitespace-nowrap"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - Study Assistant */}
        <div className="w-96 flex flex-col gap-4">
          {/* Music Player */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                <span>🎵</span>
              </div>
              <div>
                <div className="text-sm font-medium">Song Title</div>
                <div className="text-xs text-gray-500">Artist Name</div>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button className="p-2 rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors">
                ↺
              </button>
              <button className="p-2 rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors">
                ⏮
              </button>
              <button className="p-2 rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors">
                ▶️
              </button>
              <button className="p-2 rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors">
                ⏭
              </button>
              <button className="p-2 rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors">
                ♡
              </button>
            </div>
          </div>

          {/* Timer Section */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🦊</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2">
                  <span className="text-gray-400">⏰</span>
                  <span className="font-medium">
                    {formatTime(timerState.timeLeft)}
                  </span>
                  <div className="ml-auto px-2 py-1 bg-blue-600 rounded-2xl text-white text-xs">
                    {timerState.totalStudyTime}h
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-4 rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors">
                    Break
                  </button>
                  <button
                    onClick={toggleTimer}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors"
                  >
                    {timerState.running ? "⏸" : "▶️"}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors"
                  >
                    ↺
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Study Assistant */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex-none p-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Study Assistant
              </h2>
              <button className="p-2 rounded-2xl bg-black text-white hover:bg-gray-900 transition-colors">
                ⚙️
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <ChatPanel documentId="notebook" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;
