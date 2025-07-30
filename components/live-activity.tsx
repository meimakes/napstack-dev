"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface ActivityMessage {
  id: string
  text: string
  timestamp: Date
  type: string
}

interface LiveActivityProps {
  isTimerRunning: boolean
  messages: ActivityMessage[]
  onActivityMessage: (text: string, type?: string) => void
}

export function LiveActivity({ isTimerRunning, messages, onActivityMessage }: LiveActivityProps) {
  const [parentCount, setParentCount] = useState(12)
  const [visibleMessages, setVisibleMessages] = useState<ActivityMessage[]>([])
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [initialMessagesAdded, setInitialMessagesAdded] = useState(false)
  const lastActivityRef = useRef<Date>(new Date())
  const quietTimerRef = useRef<NodeJS.Timeout>()

  // Color coding for different message types
  const getMessageStyle = (type: string) => {
    switch (type) {
      case "timer-start":
        return "bg-[#87A96B]/10 border-[#87A96B]/20 text-[#87A96B] dark:bg-green-600/10 dark:border-green-600/20 dark:text-green-400"
      case "timer-complete":
        return "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
      case "timer-pause":
        return "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300"
      case "timer-resume":
        return "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
      case "timer-early":
        return "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300"
      case "ship":
        return "bg-[#FF6B6B]/10 border-[#FF6B6B]/20 text-[#FF6B6B] dark:bg-red-600/10 dark:border-red-600/20 dark:text-red-400"
      case "sound":
        return "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300"
      case "quiet":
        return "bg-gray-50 border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-400"
      default:
        return "bg-gray-50 border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-400"
    }
  }

  // Simulate parent count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setParentCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1
        const newCount = Math.max(8, Math.min(15, prev + change))
        return newCount
      })
    }, 45000)

    return () => clearInterval(interval)
  }, [])

  // Add initial messages with older timestamps
  useEffect(() => {
    if (messages.length === 0 && !initialMessagesAdded) {
      const now = new Date()
      const initialMessages = [
        {
          id: "initial-1",
          text: "Someone started a naptime sprint! 💪",
          timestamp: new Date(now.getTime() - 300000), // 5 minutes ago
          type: "timer-start",
        },
        {
          id: "initial-2",
          text: "Quick fix accomplished! ✅",
          timestamp: new Date(now.getTime() - 240000), // 4 minutes ago
          type: "timer-complete",
        },
        {
          id: "initial-3",
          text: "Someone's vibing to Coffee Shop ☕",
          timestamp: new Date(now.getTime() - 180000), // 3 minutes ago
          type: "sound",
        },
      ]

      setInitialMessagesAdded(true)
    }
  }, [messages.length, initialMessagesAdded])

  // Update visible messages when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Filter out duplicate quiet messages - only keep the most recent one
      const filteredMessages = messages.reduce(
        (acc, message) => {
          if (message.type === "quiet") {
            // Only keep the most recent quiet message
            const hasQuiet = acc.some((m) => m.type === "quiet")
            if (!hasQuiet) {
              acc.push(message)
            }
          } else {
            acc.push(message)
          }
          return acc
        },
        [] as typeof messages,
      )

      // Ensure newest messages are at the top
      const sortedMessages = [...filteredMessages].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      setVisibleMessages(sortedMessages.slice(0, 5))
      setHasNewMessage(true)
      lastActivityRef.current = new Date()

      // Clear new message indicator after 2 minutes
      setTimeout(() => setHasNewMessage(false), 120000)

      // Clear quiet timer
      if (quietTimerRef.current) {
        clearTimeout(quietTimerRef.current)
      }

      // Set new quiet timer - only if no quiet message exists
      const hasQuiet = sortedMessages.some((m) => m.type === "quiet")
      if (!hasQuiet) {
        quietTimerRef.current = setTimeout(() => {
          onActivityMessage("Quiet coding moment... 🧘", "quiet")
        }, 60000)
      }
    } else if (!initialMessagesAdded) {
      // Show some placeholder messages while waiting for real activity
      const now = new Date()
      const placeholderMessages = [
        {
          id: "placeholder-1",
          text: "Someone started a naptime sprint! 💪",
          timestamp: new Date(now.getTime() - 300000), // 5 minutes ago
          type: "timer-start",
        },
        {
          id: "placeholder-2",
          text: "Quick fix accomplished! ✅",
          timestamp: new Date(now.getTime() - 240000), // 4 minutes ago
          type: "timer-complete",
        },
        {
          id: "placeholder-3",
          text: "Someone's vibing to Coffee Shop ☕",
          timestamp: new Date(now.getTime() - 180000), // 3 minutes ago
          type: "sound",
        },
      ]
      setVisibleMessages(placeholderMessages)
      setInitialMessagesAdded(true)
    }
  }, [messages, onActivityMessage, initialMessagesAdded])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (quietTimerRef.current) {
        clearTimeout(quietTimerRef.current)
      }
    }
  }, [])

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 shadow-lg border-0 rounded-lg retro-card h-full max-h-96 flex flex-col transition-colors duration-300">
      {/* Remove the gradient overlay div completely */}

      <div className="relative z-10 space-y-4 flex flex-col h-full">
        {/* Live Counter */}
        <div className="text-center p-4 bg-gradient-to-r from-[#87A96B]/10 to-[#87A96B]/5 dark:from-green-600/10 dark:to-green-600/5 rounded-lg flex-shrink-0">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-slow-pulse" />
            <span className="font-bold text-lg text-[#87A96B] dark:text-green-400">{parentCount}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">parents coding now</div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-3 flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-center gap-2 flex-shrink-0">
            <h3 className="font-mono text-sm font-bold text-[#87A96B] dark:text-green-400">LIVE FEED</h3>
            {hasNewMessage && <div className="w-2 h-2 bg-green-500 rounded-full animate-slow-pulse flex-shrink-0" />}
          </div>

          <div className="space-y-2 flex-1 overflow-hidden min-h-0">
            {visibleMessages.slice(0, 4).map((message, index) => {
              const isNew = index === 0 && hasNewMessage && message.type !== "placeholder"
              const opacity = Math.max(0.4, 1 - index * 0.15)
              const isPlaceholder = message.type === "placeholder"
              const messageStyle = getMessageStyle(message.type)

              return (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg text-sm transition-all duration-500 transform flex-shrink-0 border ${messageStyle} ${
                    isNew ? "animate-slide-up shadow-sm" : ""
                  } ${isPlaceholder ? "opacity-60" : ""}`}
                  style={{
                    opacity: isPlaceholder ? 0.6 : opacity,
                    transform: `translateY(0px)`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex-1 break-words overflow-hidden text-ellipsis">{message.text}</span>
                    {isNew && (
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-slow-pulse flex-shrink-0" />
                    )}
                  </div>
                </div>
              )
            })}

            {visibleMessages.length === 0 && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                Waiting for coding activity...
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
