"use client"

import { useEffect, useState } from "react"

export function Confetti() {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      color: string
      size: number
      speedX: number
      speedY: number
      rotation: number
      rotationSpeed: number
    }>
  >([])

  useEffect(() => {
    const colors = ["#FF6B6B", "#87A96B", "#FAF7F0", "#FFD93D", "#6BCF7F"]
    const newParticles = []

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    setParticles(newParticles)

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.speedX,
            y: particle.y + particle.speedY,
            rotation: particle.rotation + particle.rotationSpeed,
            speedY: particle.speedY + 0.1, // gravity
          }))
          .filter((particle) => particle.y < window.innerHeight + 20),
      )
    }, 16)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      setParticles([])
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            transition: "none",
          }}
        />
      ))}
    </div>
  )
}
