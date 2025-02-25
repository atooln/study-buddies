"use client"

import { useEffect, useRef } from "react"
import anime from "animejs"

interface AnimatedBuddyProps {
  buddyImage: string
  alt: string
}

export function AnimatedBuddy({ buddyImage, alt }: AnimatedBuddyProps) {
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imageRef.current) {
      anime({
        targets: imageRef.current,
        translateY: [-10, 10],
        rotate: [-5, 5],
        duration: 2000,
        easing: "easeInOutSine",
        direction: "alternate",
        loop: true,
      })
    }
  }, [])

  return (
    <div className="w-24 h-24 flex items-center justify-center">
      <img ref={imageRef} src={buddyImage || "/placeholder.svg"} alt={alt} className="w-20 h-20 object-contain" />
    </div>
  )
}

