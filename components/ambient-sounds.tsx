"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AmbientSoundsProps {
  onActivityMessage: (text: string, type?: string) => void
}

interface Sound {
  id: string
  name: string
  icon: string
  url: string
  volumeMultiplier: number
}

const sounds: Sound[] = [
  {
    id: "coffee",
    name: "Coffee Shop",
    icon: "☕",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coffee-WoDCfv3RsmxYuoM2V8BCWwHuEzaN5G.mp3",
    volumeMultiplier: 0.8,
  },
  {
    id: "rain",
    name: "Rain",
    icon: "🌧️",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rain-QZ8k0OEezntGNILvnuXEGOo5LmBjFk.mp3",
    volumeMultiplier: 1.0,
  },
  {
    id: "fireplace",
    name: "Fireplace",
    icon: "🔥",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fireplace-JjFbg2VlKrU7DArsESsKOpUY9IVwBp.mp3",
    volumeMultiplier: 1.2,
  },
  {
    id: "lofi",
    name: "Lofi",
    icon: "🎵",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lofi-cH8mWFhRUFi2hICDRy1PKuuLlj3OYS.mp3",
    volumeMultiplier: 0.9,
  },
]

export function AmbientSounds({ onActivityMessage }: AmbientSoundsProps) {
  const [activeSound, setActiveSound] = useState<string | null>(null)
  const [volume, setVolume] = useState(70)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  // Initialize audio elements
  useEffect(() => {
    sounds.forEach((sound) => {
      const audio = new Audio(sound.url)
      audio.loop = true
      audio.preload = "metadata"
      audioRefs.current[sound.id] = audio
    })

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause()
        audio.src = ""
      })
    }
  }, [])

  // Update volume for all audio elements when volume changes
  useEffect(() => {
    Object.entries(audioRefs.current).forEach(([soundId, audio]) => {
      if (!audio) return
      
      const sound = sounds.find((s) => s.id === soundId)
      if (sound && sound.volumeMultiplier !== undefined && !isNaN(sound.volumeMultiplier)) {
        const calculatedVolume = Math.max(0, Math.min(1, (volume / 100) * sound.volumeMultiplier))
        audio.volume = calculatedVolume
      }
    })
  }, [volume, audioRefs.current])

  const toggleSound = async (soundId: string) => {
    const audio = audioRefs.current[soundId]
    const sound = sounds.find((s) => s.id === soundId)

    if (!audio || !sound) return

    if (activeSound === soundId) {
      // Stop current sound
      audio.pause()
      audio.currentTime = 0
      setActiveSound(null)
      onActivityMessage(`Stopped ${sound.name} 🔇`, "sound")
    } else {
      // Stop any currently playing sound
      if (activeSound) {
        const currentAudio = audioRefs.current[activeSound]
        if (currentAudio) {
          currentAudio.pause()
          currentAudio.currentTime = 0
        }
      }

      // Start new sound
      try {
        // Apply normalized volume before playing
        if (sound.volumeMultiplier !== undefined && !isNaN(sound.volumeMultiplier)) {
          const calculatedVolume = Math.max(0, Math.min(1, (volume / 100) * sound.volumeMultiplier))
          audio.volume = calculatedVolume
        } else {
          audio.volume = Math.max(0, Math.min(1, volume / 100))
        }
        await audio.play()
        setActiveSound(soundId)
        onActivityMessage(`Someone's vibing to ${sound.name} ${sound.icon}`, "sound")
      } catch (error) {
        console.log("Could not play audio:", error)
        onActivityMessage(`${sound.name} audio not available`, "sound")
      }
    }
  }

  return (
    <Card className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg border-0 rounded-lg retro-card transition-colors duration-300">
      <div className="space-y-6">
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
            const isActive = activeSound === sound.id
            return (
              <Button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className={`h-16 flex flex-col items-center justify-center gap-1 rounded-lg transition-all duration-200 hover:scale-105 retro-button overflow-hidden relative ${
                  isActive
                    ? "bg-[#87A96B] dark:bg-green-600 text-white shadow-lg"
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
            <span className="text-sm font-mono text-[#87A96B] dark:text-green-400">{volume}%</span>
          </div>
          <Slider
            value={[volume]}
            onValueChange={(value: number[]) => setVolume(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Currently Playing */}
        {activeSound && (
          <div className="text-center p-3 bg-[#87A96B]/5 dark:bg-green-600/10 rounded-lg">
            <div className="text-xs text-[#87A96B] dark:text-green-400 font-medium mb-1">NOW PLAYING</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {sounds.find((s) => s.id === activeSound)?.name}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
