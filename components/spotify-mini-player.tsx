"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Shuffle, SkipBack, Play, Pause, SkipForward, Heart } from "lucide-react"

interface SpotifyMiniPlayerProps {
  playlistId: string
  buddyType: "fox" | "frog" | "rabbit"
}

export function SpotifyMiniPlayer({ playlistId, buddyType }: SpotifyMiniPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const togglePlay = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ command: isPlaying ? "pause" : "play" }, "*")
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0" />
          <div>
            <div className="font-medium text-sm">Study Music</div>
            <div className="text-xs text-muted-foreground">Lofi Beats</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${isLiked ? "text-black" : "text-muted-foreground"}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full text-sm text-muted-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Show playlist
      </Button>

      {/* Always render iframe but hide it when not expanded */}
      <iframe
        ref={iframeRef}
        style={{ border: 0, height: isExpanded ? "352px" : "0", visibility: isExpanded ? "visible" : "hidden" }}
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
        width="100%"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
      />
    </div>
  )
}

