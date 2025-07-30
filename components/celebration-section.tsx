"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/confetti"

interface CelebrationSectionProps {
  dailyStats: {
    sessions: number
    totalMinutes: number
    ships: number
    streak: number
  }
  onShip: () => void
  onActivityMessage: (text: string, type?: string) => void
}

export function CelebrationSection({ dailyStats, onShip, onActivityMessage }: CelebrationSectionProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const shipSoundRef = useRef<HTMLAudioElement>()

  // Initialize ship sound effect
  useEffect(() => {
    // Create a simple ship sound using Web Audio API
    const createShipSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      const playShipSound = () => {
        // Create a celebratory sound sequence
        const oscillator1 = audioContext.createOscillator()
        const oscillator2 = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator1.connect(gainNode)
        oscillator2.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // First note (higher pitch)
        oscillator1.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator1.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1)

        // Second note (harmony)
        oscillator2.frequency.setValueAtTime(600, audioContext.currentTime)
        oscillator2.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.1)

        // Volume envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

        oscillator1.start(audioContext.currentTime)
        oscillator2.start(audioContext.currentTime)
        oscillator1.stop(audioContext.currentTime + 0.3)
        oscillator2.stop(audioContext.currentTime + 0.3)
      }

      return playShipSound
    }

    try {
      const playSound = createShipSound()
      shipSoundRef.current = { play: playSound } as any
    } catch (error) {
      console.log("Audio context not available")
    }
  }, [])

  const handleShip = () => {
    onShip() // This already handles adding the activity message in the main dashboard
    setShowConfetti(true)

    // Play ship sound effect
    if (shipSoundRef.current) {
      try {
        ;(shipSoundRef.current as any).play()
      } catch (error) {
        console.log("Could not play ship sound")
      }
    }

    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <>
      <Card className="p-6 bg-white dark:bg-slate-800 shadow-lg border-0 rounded-lg retro-card transition-colors duration-300">
        {/* Remove the gradient overlay div completely */}

        <div className="relative z-10 space-y-6">
          {/* Ship Button - Now same size as pause button */}
          <div className="text-center">
            <Button
              onClick={handleShip}
              className="w-full h-12 lg:h-16 px-6 lg:px-8 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold text-sm lg:text-lg rounded-lg transition-all duration-200 hover:scale-105 retro-button shadow-lg"
            >
              I SHIPPED SOMETHING! 🚀
            </Button>
          </div>

          {/* Daily Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-[#87A96B]/5 dark:bg-green-600/10 rounded-lg">
              <div className="text-2xl font-bold text-[#87A96B] dark:text-green-400 font-mono">
                {dailyStats.sessions}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">sessions</div>
            </div>

            <div className="text-center p-3 bg-[#87A96B]/5 dark:bg-green-600/10 rounded-lg">
              <div className="text-2xl font-bold text-[#87A96B] dark:text-green-400 font-mono">
                {dailyStats.totalMinutes}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">minutes</div>
            </div>

            <div className="text-center p-3 bg-[#FF6B6B]/5 dark:bg-red-600/10 rounded-lg">
              <div className="text-2xl font-bold text-[#FF6B6B] dark:text-red-400 font-mono">{dailyStats.ships}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">ships</div>
            </div>

            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-500 dark:text-orange-400 font-mono flex items-center justify-center gap-1">
                {dailyStats.streak}
                <span className="text-lg">🔥</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">day streak</div>
            </div>
          </div>

          {/* Today Summary */}
          <div className="text-center p-4 bg-gradient-to-r from-[#87A96B]/5 to-[#FF6B6B]/5 dark:from-green-600/10 dark:to-red-600/10 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Your today:{" "}
              <span className="font-bold text-[#87A96B] dark:text-green-400">{dailyStats.sessions} sessions</span> •{" "}
              <span className="font-bold text-[#87A96B] dark:text-green-400">{dailyStats.totalMinutes} min</span> •{" "}
              <span className="font-bold text-[#FF6B6B] dark:text-red-400">{dailyStats.ships} ships</span>
            </div>
          </div>
        </div>
      </Card>

      {showConfetti && <Confetti />}
    </>
  )
}
