"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pause, Play, RotateCcw } from "lucide-react"

interface BuddyWidgetProps {
  buddyImage: string
}

export function BuddyWidget({ buddyImage }: BuddyWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes in seconds
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsPlaying(false)
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPlaying, timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleReset = () => {
    setTimeLeft(isBreak ? 15 * 60 : 45 * 60)
    setIsPlaying(false)
  }

  const handleBreak = () => {
    setIsBreak(!isBreak)
    setIsPlaying(false)
    setTimeLeft(isBreak ? 45 * 60 : 15 * 60) // Switch between 45min and 15min
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="p-4 space-y-3 w-[200px] bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="flex justify-center bg-gray-100 rounded-xl p-4">
        <img src={buddyImage || "/placeholder.svg"} alt="Study Buddy" className="w-20 h-20 object-contain" />
      </div>
      <div className="flex gap-2 justify-center">
        <Button
          variant={isBreak ? "default" : "outline"}
          size="sm"
          className={`rounded-xl text-sm font-normal h-8 ${isBreak ? "border-black" : ""}`}
          onClick={handleBreak}
        >
          {isBreak ? "Focus" : "Break"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`rounded-xl h-8 w-8 ${isPlaying ? "border-black" : ""}`}
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" className="rounded-xl h-8 w-8" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-center gap-2 bg-slate-50 rounded-xl py-1 px-3">
        <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
        <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">4H</span>
      </div>
    </div>
  )
}

