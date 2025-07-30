"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Confetti } from "@/components/confetti"

interface PomodoroTimerProps {
  onTimerStateChange: (isRunning: boolean) => void
  onTimerComplete: (minutes: number) => void
  onActivityMessage: (text: string, type?: string) => void
}

export function PomodoroTimer({ onTimerStateChange, onTimerComplete, onActivityMessage }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState("")
  const messageIntervalRef = useRef<NodeJS.Timeout>()

  const presets = [
    { name: "Quick Fix", duration: 5, emoji: "⚡" },
    { name: "Focus Block", duration: 20, emoji: "⏰" },
    { name: "Naptime Sprint", duration: 45, emoji: "🍼" },
    { name: "Night Owl", duration: 90, emoji: "🦉" },
  ]

  const getTimeBasedMessages = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return [
        "Good morning, parent coder! ☀️",
        "Early bird gets the bug fixes! 🐛",
        "Morning coffee and code! ☕",
        "Fresh start, fresh code! 🌅",
      ]
    } else if (hour >= 12 && hour < 17) {
      return [
        "Afternoon coding session! 🌤️",
        "Lunch break coding? Nice! 🥪",
        "Midday momentum! 💪",
        "Afternoon productivity! ⚡",
      ]
    } else if (hour >= 17 && hour < 22) {
      return [
        "Evening coding vibes! 🌆",
        "After-dinner debugging! 🍽️",
        "Sunset sessions hit different! 🌅",
        "Evening energy! 🔥",
      ]
    } else {
      return [
        "Late night session? 🌙",
        "Night owl mode activated! 🦉",
        "Burning the midnight oil! 🕯️",
        "Late night, great code! ✨",
      ]
    }
  }

  const getMotivationalMessages = () => [
    "You've got this! 💪",
    "Focus mode: activated! 🎯",
    "Building something amazing! 🚀",
    "One line at a time! 📝",
    "Code like a parent: efficiently! ⚡",
    "Making magic happen! ✨",
    "Debug like a detective! 🔍",
    "Shipping greatness! 📦",
    "Code, coffee, conquer! ☕",
    "Parent power coding! 🍼",
  ]

  const getMilestoneMessages = (elapsedMinutes: number) => {
    if (elapsedMinutes >= 60) return `${elapsedMinutes} minutes of pure focus! 🔥`
    if (elapsedMinutes >= 45) return `${elapsedMinutes} mins of coding zen! 🧘`
    if (elapsedMinutes >= 30) return `${elapsedMinutes} minutes of flow state! 🌊`
    if (elapsedMinutes >= 15) return `${elapsedMinutes} mins of solid progress! 📈`
    if (elapsedMinutes >= 5) return `${elapsedMinutes} minutes in the zone! 🎯`
    return ""
  }

  const updateMotivationalMessage = useCallback(() => {
    if (!isRunning || timeLeft === 0) {
      setMotivationalMessage("")
      return
    }

    const elapsedSeconds = selectedDuration * 60 - timeLeft
    const elapsedMinutes = Math.floor(elapsedSeconds / 60)

    // Show milestone messages every 5 minutes
    if (elapsedMinutes > 0 && elapsedMinutes % 5 === 0 && elapsedSeconds % 60 < 5) {
      const milestoneMsg = getMilestoneMessages(elapsedMinutes)
      if (milestoneMsg) {
        setMotivationalMessage(milestoneMsg)
        return
      }
    }

    // Otherwise, rotate between time-based and motivational messages
    const timeMessages = getTimeBasedMessages()
    const motivationalMessages = getMotivationalMessages()
    const allMessages = [...timeMessages, ...motivationalMessages]

    const randomMessage = allMessages[Math.floor(Math.random() * allMessages.length)]
    setMotivationalMessage(randomMessage)
  }, [isRunning, timeLeft, selectedDuration])

  // Update motivational message periodically - Fixed timing issue
  useEffect(() => {
    // Clear any existing interval
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current)
    }

    if (isRunning && timeLeft > 0) {
      // Set initial message
      updateMotivationalMessage()

      // Set interval for every 5 minutes (300000ms)
      messageIntervalRef.current = setInterval(() => {
        updateMotivationalMessage()
      }, 300000)
    } else {
      setMotivationalMessage("")
    }

    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current)
      }
    }
  }, [isRunning, selectedDuration]) // Removed timeLeft from dependencies to prevent rapid updates

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false)
            onTimerStateChange(false)
            onTimerComplete(selectedDuration)

            // Trigger completion message
            if (selectedDuration === 45) {
              onActivityMessage("A parent completed a naptime sprint! 🎉", "timer-complete")
            } else if (selectedDuration === 5) {
              onActivityMessage("Quick fix accomplished! ✅", "timer-complete")
            } else if (selectedDuration === 90) {
              onActivityMessage("Night owl session crushed! 🌙", "timer-complete")
            } else if (selectedDuration === 20) {
              onActivityMessage("Focus block completed! ⏰", "timer-complete")
            }

            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, onTimerStateChange, onTimerComplete, selectedDuration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = useCallback(
    (duration: number) => {
      setTimeLeft(duration * 60)
      setSelectedDuration(duration)
      setIsRunning(true)
      onTimerStateChange(true)

      // Trigger activity message based on preset
      if (duration === 45) {
        onActivityMessage("Someone started a naptime sprint! 💪", "timer-start")
      } else if (duration === 5) {
        onActivityMessage("Quick fix mode activated! ⚡", "timer-start")
      } else if (duration === 90) {
        onActivityMessage("Night owl session begun! 🦉", "timer-start")
      } else if (duration === 20) {
        onActivityMessage("Focus block started! ⏰", "timer-start")
      }
    },
    [onTimerStateChange, onActivityMessage],
  )

  const pauseTimer = useCallback(() => {
    setIsRunning(false)
    onTimerStateChange(false)
    onActivityMessage("Chaos handled, parent paused ⏸️", "timer-pause")
  }, [onTimerStateChange, onActivityMessage])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(0)
    setSelectedDuration(0)
    setMotivationalMessage("")
    onTimerStateChange(false)

    // Clear message interval
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current)
    }
  }, [onTimerStateChange])

  const endEarly = useCallback(() => {
    const elapsedSeconds = selectedDuration * 60 - timeLeft
    const elapsedMinutes = Math.floor(elapsedSeconds / 60)

    // Only credit if at least 1 minute has elapsed
    if (elapsedMinutes >= 1) {
      setIsRunning(false)
      onTimerStateChange(false)
      onTimerComplete(elapsedMinutes)

      // Trigger activity message
      onActivityMessage(
        `Parent ended early but still got ${elapsedMinutes} ${elapsedMinutes === 1 ? "min" : "mins"}! 💪`,
        "timer-early",
      )

      // Reset timer state
      setTimeLeft(0)
      setSelectedDuration(0)
      setMotivationalMessage("")

      // Clear message interval
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current)
      }
    } else {
      // If less than 1 minute, just reset
      resetTimer()
    }
  }, [timeLeft, selectedDuration, onTimerStateChange, onTimerComplete, onActivityMessage, resetTimer])

  const timerColor = isRunning
    ? "text-[#87A96B] dark:text-green-400"
    : timeLeft > 0
      ? "text-[#FF6B6B] dark:text-red-400"
      : "text-gray-400 dark:text-gray-500"
  const pulseClass = isRunning ? "animate-slow-pulse" : ""

  return (
    <>
      <Card className="p-6 lg:p-8 bg-white dark:bg-slate-800 shadow-lg border-0 rounded-lg retro-card h-full flex flex-col justify-center transition-colors duration-300">
        <div className="relative z-10 text-center space-y-4 lg:space-y-6">
          {/* Timer Display */}
          <div
            className={`font-mono text-5xl lg:text-6xl xl:text-7xl font-bold ${timerColor} ${pulseClass} transition-colors duration-300 cursor-pointer select-none`}
            onClick={() => {
              if (timeLeft > 0) {
                if (isRunning) {
                  pauseTimer()
                } else {
                  setIsRunning(true)
                  onActivityMessage("Back to coding! A parent resumed 💻", "timer-resume")
                }
              }
            }}
          >
            {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
          </div>

          {/* Timer Controls - Single conditional block */}
          <div key="timer-controls">
            {timeLeft === 0 ? (
              // Preset Buttons - 2 rows on desktop
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-w-md lg:max-w-lg mx-auto">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    onClick={() => startTimer(preset.duration)}
                    className="h-12 bg-[#87A96B] hover:bg-[#87A96B]/90 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 retro-button text-sm px-4"
                  >
                    <span className="mr-2">{preset.emoji}</span>
                    {preset.name}
                    <span className="ml-1 text-xs opacity-80">({preset.duration}m)</span>
                  </Button>
                ))}
              </div>
            ) : (
              // Control Buttons
              <div className="space-y-3">
                <Button
                  onClick={
                    isRunning
                      ? pauseTimer
                      : () => {
                          setIsRunning(true)
                          onActivityMessage("Back to coding! A parent resumed 💻", "timer-resume")
                        }
                  }
                  className="w-full h-12 lg:h-16 px-6 lg:px-8 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold text-sm lg:text-lg rounded-lg transition-all duration-200 hover:scale-105 retro-button"
                >
                  {isRunning ? "PAUSE FOR CHAOS" : "RESUME FOCUS"}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={endEarly}
                    className="h-8 lg:h-10 px-4 lg:px-6 bg-[#87A96B] hover:bg-[#87A96B]/90 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    End Early
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    className="h-8 lg:h-10 px-4 lg:px-6 border-[#87A96B] text-[#87A96B] hover:bg-[#87A96B]/10 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-600/10 rounded-lg transition-all duration-200 bg-transparent text-sm"
                  >
                    Reset
                  </Button>
                </div>

                {/* Motivational Message */}
                {motivationalMessage && (
                  <div className="mt-4 p-3 bg-[#87A96B]/5 dark:bg-green-600/10 rounded-lg border border-[#87A96B]/10 dark:border-green-600/20">
                    <p className="text-sm text-[#87A96B] dark:text-green-400 font-medium animate-fade-in">
                      {motivationalMessage}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {showConfetti && <Confetti />}
    </>
  )
}
