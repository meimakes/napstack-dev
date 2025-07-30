"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Twitter } from "lucide-react"

interface RoadmapModalProps {
  children: React.ReactNode
}

export function RoadmapModal({ children }: RoadmapModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const roadmapItems = [
    {
      category: "🔐 Authentication & Sync",
      items: [
        "GitHub OAuth login",
        "X/Twitter OAuth login",
        "Cross-device stat syncing",
        "User profiles & avatars",
        "Data export/import",
      ],
    },
    {
      category: "👥 Real Multiplayer",
      items: [
        "Live user activity feed",
        "Real-time parent count",
        "See actual usernames/avatars",
        "User presence indicators",
        "Activity notifications",
      ],
    },
    {
      category: "📊 Enhanced Stats",
      items: [
        "Proper daily streak tracking",
        "Weekly/monthly reports",
        "Focus time analytics",
        "Productivity insights",
        "Goal setting & tracking",
      ],
    },
    {
      category: "🎵 Audio & Effects",
      items: [
        "More ambient sounds",
        "Custom sound uploads",
        "Sound mixing controls",
        "Timer completion sounds",
        "Haptic feedback (mobile)",
      ],
    },
    {
      category: "🏆 Community Features",
      items: [
        "Global leaderboards",
        "Parent developer teams",
        "Coding challenges",
        "Achievement badges",
        "Social sharing",
      ],
    },
    {
      category: "⚡ Quality of Life",
      items: [
        "Custom timer presets",
        "Keyboard shortcuts",
        "Desktop notifications",
        "Mobile app (PWA)",
        "Dark/light theme toggle",
      ],
    },
  ]

  const createFeatureRequestTweet = () => {
    const tweetText = encodeURIComponent(
      "Hey @meimakes! I'd love to see this feature in NapStack.dev: [describe your idea]\n\n#NapStackDev #ParentDeveloper",
    )
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">🚀 NapStack.dev Roadmap</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">The future of productivity for parent developers</p>
            <Badge variant="outline" className="text-xs">
              Currently in prerelease with simulated data
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {roadmapItems.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-lg text-[#87A96B] dark:text-green-400">{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="text-center">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Want to contribute or request a feature?
              </h4>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={createFeatureRequestTweet}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Request Feature
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    href="https://github.com/meimakes/napstack-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
