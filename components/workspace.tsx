"use client";

import { useEffect, useState } from "react";
import { DraggableBuddy } from "./draggable-buddy";
import { EditablePage } from "./editable-page";
import { SpotifyMiniPlayer } from "./spotify-mini-player";
import { WorkspaceHeader } from "./workspace-header";
import { StudyAssistant } from "./study-assistant";
import { BuddyWidget } from "./buddy-widget";
import { BottomNav } from "./bottom-nav";

const buddyImages = {
  fox: "/assets/placeholder-logo.png",
  frog: "/assets/placeholder-logo.png",
  rabbit: "/assets/placeholder-logo.png",
};

const playlistIds = {
  fox: "3x9F8mBOQWpvwgJIbAtASR",
  rabbit: "1DqR19n79qCdyB8DO3MWVB",
  frog: "1O11sPkBfTji4SxAFxaRUv",
};

type BuddyType = "fox" | "frog" | "rabbit";

export function Workspace() {
  const [selectedBuddy, setSelectedBuddy] = useState<BuddyType>("fox");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState("25:00");

  useEffect(() => {
    // Get the stored buddy from localStorage after component mounts
    const storedBuddy = localStorage.getItem("selectedBuddy") as BuddyType;
    if (storedBuddy) {
      setSelectedBuddy(storedBuddy);
    }
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col">
        <WorkspaceHeader />
        <div className="flex-1 relative">
          <EditablePage />
          <DraggableBuddy
            buddyImage={buddyImages[selectedBuddy]}
            timeLeft={timeLeft}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
        </div>
        <SpotifyMiniPlayer
          playlistId={playlistIds[selectedBuddy]}
          buddyType={selectedBuddy}
        />
      </div>

      <div className="w-[400px] border-l bg-white p-4 space-y-6">
        <StudyAssistant />
      </div>

      <BottomNav />
    </div>
  );
}
