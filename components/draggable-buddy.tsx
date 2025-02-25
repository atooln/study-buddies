"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { useDraggable } from "@dnd-kit/core"

interface DraggableBuddyProps {
  buddyImage: string
  timeLeft: string
  isPlaying: boolean
  onPlayPause: () => void
}

export function DraggableBuddy({ buddyImage, timeLeft, isPlaying, onPlayPause }: DraggableBuddyProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable-buddy",
  })

  useEffect(() => {
    const savedPosition = localStorage.getItem("buddyPosition")
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition))
    }
  }, [])

  useEffect(() => {
    if (transform) {
      const newX = position.x + transform.x
      const newY = position.y + transform.y
      if (newX !== position.x || newY !== position.y) {
        const newPosition = { x: newX, y: newY }
        setPosition(newPosition)
        localStorage.setItem("buddyPosition", JSON.stringify(newPosition))
      }
    }
  }, [transform, position])

  const style = useMemo(
    () => ({
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    }),
    [position.x, position.y],
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="absolute p-4 space-y-3 w-[200px] bg-white rounded-2xl shadow-sm cursor-move"
    >
      <div className="flex justify-center">
        <img src={buddyImage || "/placeholder.svg"} alt="Study Buddy" className="w-24 h-24 object-contain" />
      </div>
      <div className="flex gap-2 justify-center">
        <Button variant="outline" size="sm" className="rounded-full text-sm font-normal h-8">
          Break
        </Button>
        <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={onPlayPause}>
          {isPlaying ? "⏸" : "▶️"}
        </Button>
        <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
          🔄
        </Button>
      </div>
      <div className="flex items-center justify-center gap-2 bg-slate-50 rounded-full py-1 px-3">
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">{timeLeft}</span>
        <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">4H</span>
      </div>
    </div>
  )
}

