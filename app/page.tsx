"use client"

import { useState, useEffect, useCallback } from "react"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { AmbientSounds } from "@/components/ambient-sounds"
import { LiveActivity } from "@/components/live-activity"
import { CelebrationSection } from "@/components/celebration-section"

export default function Dashboard() {
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [dailyStats, setDailyStats] = useState({
    sessions: 0,
    totalMinutes: 0,
    ships: 0,
    streak: 1,
  })
  const [activityMessages, setActivityMessages] = useState<
    Array<{
      id: string
      text: string
      timestamp: Date
      type: string
    }>
  >([])

  // Load stats from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("napstack-stats")
    if (saved) {
      setDailyStats(JSON.parse(saved))
    }
  }, [])

  // Save stats to localStorage
  const updateStats = useCallback(
    (updates: Partial<typeof dailyStats>) => {
      const newStats = { ...dailyStats, ...updates }
      setDailyStats(newStats)
      localStorage.setItem("napstack-stats", JSON.stringify(newStats))
    },
    [dailyStats],
  )

  const handleTimerComplete = useCallback(
    (minutes: number) => {
      updateStats({
        sessions: dailyStats.sessions + 1,
        totalMinutes: dailyStats.totalMinutes + minutes,
      })
    },
    [dailyStats, updateStats],
  )

  const handleShip = useCallback(() => {
    updateStats({
      ships: dailyStats.ships + 1,
    })
    addActivityMessage("Someone just shipped code! 🚀", "ship")
  }, [dailyStats, updateStats, activityMessages])

  const addActivityMessage = useCallback((text: string, type = "general") => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      type,
    }
    setActivityMessages((prev) => [newMessage, ...prev.slice(0, 19)]) // Keep max 20 messages
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-[#FAF7F0] via-[#F7F4ED] via-[#F4F1E6] via-[#F1EEE3] to-[#EEEAE0] dark:from-slate-900 dark:via-slate-800 dark:via-slate-850 dark:via-slate-800 dark:to-slate-900">
      {/* Keep the grid dots you like */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.15] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #87A96B 1px, transparent 1px), radial-gradient(circle at 75% 75%, #FF6B6B 1px, transparent 1px)`,
            backgroundSize: "50px 50px, 80px 80px",
          }}
        />
      </div>

      {/* Subtle ambient lighting for depth */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#87A96B]/2 dark:bg-green-400/3 rounded-full blur-3xl pointer-events-none transform translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#FF6B6B]/2 dark:bg-red-400/3 rounded-full blur-3xl pointer-events-none transform -translate-x-1/4 translate-y-1/4" />

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-[#87A96B]/20 dark:border-slate-700 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#87A96B] dark:text-gray-300 font-mono tracking-tight transition-colors duration-300">
            NapStack.dev 🍼💻
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Single Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-6 lg:h-[calc(100vh-12rem)] lg:max-h-[800px]">
            {/* Timer - Always first */}
            <div className="lg:col-span-1 lg:row-span-1 flex flex-col">
              <PomodoroTimer
                onTimerStateChange={setIsTimerRunning}
                onTimerComplete={handleTimerComplete}
                onActivityMessage={addActivityMessage}
              />
            </div>

            {/* Live Activity - Second on mobile, top-right on desktop */}
            <div className="lg:col-span-1 lg:row-span-1 flex flex-col order-3 lg:order-2">
              <LiveActivity
                isTimerRunning={isTimerRunning}
                messages={activityMessages}
                onActivityMessage={addActivityMessage}
              />
            </div>

            {/* Ambient Sounds - Third on mobile, bottom-left on desktop */}
            <div className="lg:col-span-1 lg:row-span-1 flex flex-col order-2 lg:order-3">
              <AmbientSounds onActivityMessage={addActivityMessage} />
            </div>

            {/* Celebration/Stats - Fourth on mobile, bottom-right on desktop */}
            <div className="lg:col-span-1 lg:row-span-1 flex flex-col order-4">
              <CelebrationSection dailyStats={dailyStats} onShip={handleShip} onActivityMessage={addActivityMessage} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-[#87A96B]/70 dark:text-gray-400 transition-colors duration-300">
        Made for parents who code during naptime • by @meimakes
      </footer>
    </div>
  )
}
