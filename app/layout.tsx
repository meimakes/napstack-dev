import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script" // Add this import
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NapStack.dev - Productivity Dashboard for Parent Developers",
  description: "A 90s-inspired productivity dashboard designed for parents who code during naptime",
  generator: "v0.dev",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#87A96B" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        {/* Add the Plausible script here */}
        <Script defer data-domain="napstack.dev" src="https://plausible.io/js/script.outbound-links.js" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
