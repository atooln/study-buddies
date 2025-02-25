"use client"

import { useEffect, useRef } from "react"
import anime from "animejs"

interface AnimatedFoxProps {
  isPlaying: boolean
}

export function AnimatedFox({ isPlaying }: AnimatedFoxProps) {
  const tailRef = useRef<SVGPathElement>(null)
  const leftLegRef = useRef<SVGPathElement>(null)
  const rightLegRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (isPlaying) {
      // Tail wagging animation
      const tailAnimation = anime({
        targets: tailRef.current,
        rotate: [0, 15, 0, -15, 0],
        duration: 1000,
        easing: "easeInOutQuad",
        loop: true,
        transformOrigin: ["20% 80%"],
      })

      // Legs walking animation
      const legsAnimation = anime.timeline({
        loop: true,
        duration: 800,
      })

      legsAnimation
        .add({
          targets: leftLegRef.current,
          translateY: [0, -2, 0],
          rotate: [0, -5, 0],
          duration: 400,
          easing: "easeInOutQuad",
        })
        .add(
          {
            targets: rightLegRef.current,
            translateY: [0, -2, 0],
            rotate: [0, -5, 0],
            duration: 400,
            easing: "easeInOutQuad",
          },
          "-=200",
        )

      return () => {
        tailAnimation.pause()
        legsAnimation.pause()

        // Reset animations
        anime({
          targets: [tailRef.current, leftLegRef.current, rightLegRef.current],
          rotate: 0,
          translateY: 0,
          duration: 300,
          easing: "easeOutQuad",
        })
      }
    }
  }, [isPlaying])

  return (
    <div className="w-24 h-24 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <g>
          {/* Body */}
          <path d="M50 30 L70 50 L50 70 L30 50 Z" fill="#ff9966" />
          {/* Tail */}
          <path ref={tailRef} d="M65 55 Q80 60 85 45" stroke="#ff9966" strokeWidth="8" fill="none" />
          {/* Left leg */}
          <path ref={leftLegRef} d="M40 65 L35 75" stroke="#ff9966" strokeWidth="6" strokeLinecap="round" />
          {/* Right leg */}
          <path ref={rightLegRef} d="M60 65 L65 75" stroke="#ff9966" strokeWidth="6" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}

