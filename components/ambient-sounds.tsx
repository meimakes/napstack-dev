"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AmbientSoundsProps {
  onActivityMessage: (text: string, type?: string) => void
}

export function AmbientSounds({ onActivityMessage }: AmbientSoundsProps) {
  const [activeSounds, setActiveSounds] = useState<string[]>([])
  const [volume, setVolume] = useState([70])
  const [userInteracted, setUserInteracted] = useState(false)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  const sounds = [
    { id: "coffee", name: "Coffee Shop", icon: "☕", color: "#8B4513", file: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coffee-WoDCfv3RsmxYuoM2V8BCWwHuEzaN5G.mp3" },
    { id: "rain", name: "Rain", icon: "🌧️", color: "#4A90E2", file: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rain-QZ8k0OEezntGNILvnuXEGOo5LmBjFk.mp3" },
    { id: "fireplace", name: "Fireplace", icon: "🔥", color: "#FF6B6B", file: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fireplace-JjFbg2VlKrU7DArsESsKOpUY9IVwBp.mp3" },
    { id: "lofi", name: "Lofi", icon: "🎵", color: "#87A96B", file: null }, // Will add later
  ]

  // Track user interaction to prevent auto-play issues
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true)
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("keydown", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
    }
  }, [])

  // Initialize audio elements
  useEffect(() => {
    sounds.forEach((sound) => {
      if (sound.file && !audioRefs.current[sound.id]) {
        const audio = new Audio(sound.file)
        audio.loop = true
        audio.volume = volume[0] / 100
        audioRefs.current[sound.id] = audio
      }
    })

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause()
        audio.currentTime = 0
      })
    }
  }, [])

  // Update volume for all audio elements
  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.volume = volume[0] / 100
    })
  }, [volume])

  // Load preferences from localStorage - but don't auto-play until user interaction
  useEffect(() => {
    const savedSounds = localStorage.getItem("napstack-sounds")
    const savedVolume = localStorage.getItem("napstack-volume")

    if (savedSounds) {
      const loadedSounds = JSON.parse(savedSounds)
      setActiveSounds(loadedSounds)

      // Only start playing saved sounds after user interaction
      if (userInteracted) {
        loadedSounds.forEach((soundId: string) => {
          const audio = audioRefs.current[soundId]
          if (audio) {
            audio.play().catch(console.error)
          }
        })
      }
    }
    if (savedVolume) {
      setVolume([Number.parseInt(savedVolume)])
    }
  }, [userInteracted])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("napstack-sounds", JSON.stringify(activeSounds))
  }, [activeSounds])

  useEffect(() => {
    localStorage.setItem("napstack-volume", volume[0].toString())
  }, [volume])

  const toggleSound = (soundId: string) => {
    setActiveSounds((prev) => {
      const newSounds = prev.includes(soundId) ? prev.filter((id) => id !== soundId) : [...prev, soundId]

      // Handle audio playback
      const audio = audioRefs.current[soundId]
      if (audio) {
        if (prev.includes(soundId)) {
          // Stop the sound
          audio.pause()
          audio.currentTime = 0
        } else {
          // Start the sound
          audio.play().catch(console.error)
        }
      }

      // Trigger activity message when sound is activated
      if (!prev.includes(soundId)) {
        const sound = sounds.find((s) => s.id === soundId)
        if (sound) {
          if (newSounds.length === 1) {
            onActivityMessage(`Someone's vibing to ${sound.name} ${sound.icon}`, "sound")
          } else {
            // Fixed: Remove the extra + by properly joining the names
            const activeNames = newSounds
              .map((id) => sounds.find((s) => s.id === id)?.name)
              .filter(Boolean)
              .join(" + ")
            onActivityMessage(`Coding to ${activeNames} 🎵`, "sound")
          }
        }
      }

      return newSounds
    })
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 shadow-lg border-0 rounded-lg retro-card transition-colors duration-300">
      {/* Remove the gradient overlay div completely */}

      <div className="relative z-10 space-y-6">
        {/* Cassette Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-[#87A96B]/10 dark:bg-green-600/10 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-[#87A96B] dark:bg-green-400 rounded-full animate-pulse" />
            <span className="font-mono text-sm font-medium text-[#87A96B] dark:text-green-400">AMBIENT MIXER</span>
            <div
              className="w-3 h-3 bg-[#87A96B] dark:bg-green-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>

        {/* Sound Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {sounds.map((sound) => {
            const isActive = activeSounds.includes(sound.id)
            const isDisabled = !sound.file && sound.id === "lofi"
            return (
              <Button
                key={sound.id}
                onClick={() => !isDisabled && toggleSound(sound.id)}
                disabled={isDisabled}
                className={`h-16 flex flex-col items-center justify-center gap-1 rounded-lg transition-all duration-200 hover:scale-105 retro-button overflow-hidden relative ${
                  isActive
                    ? "bg-[#87A96B] dark:bg-green-600 text-white shadow-lg"
                    : isDisabled
                      ? "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                <div className="flex flex-col items-center justify-center flex-1 min-h-0">
                  <span className="text-xl leading-none">{sound.icon}</span>
                  <span className="text-xs font-medium leading-tight truncate max-w-full px-1">{sound.name}</span>
                </div>
                {isActive && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white/80 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 4 + 3}px`,
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: "1.5s",
                        }}
                      />
                    ))}
                  </div>
                )}
              </Button>
            )
          })}
        </div>

        {/* Volume Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Volume</span>
            <span className="text-sm font-mono text-[#87A96B] dark:text-green-400">{volume[0]}%</span>
          </div>
          <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-full" />
        </div>

        {/* Currently Playing - Fixed the extra + issue */}
        {activeSounds.length > 0 && (
          <div className="text-center p-3 bg-[#87A96B]/5 dark:bg-green-600/10 rounded-lg">
            <div className="text-xs text-[#87A96B] dark:text-green-400 font-medium mb-1">NOW PLAYING</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {activeSounds
                .map((id) => sounds.find((s) => s.id === id)?.name)
                .filter(Boolean)
                .join(" + ")}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
