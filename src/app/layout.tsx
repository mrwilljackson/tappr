import type React from "react"
import { patuaOne, montserrat } from "./fonts"
import "./globals.css"

export const metadata = {
  title: "TAPPR - The Ultimate Homebrewer's Companion",
  description:
    "Track your kegs, bottles, and brews with precision. Monitor, taste, and share your homebrew with friends.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${patuaOne.variable} ${montserrat.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-montserrat">{children}</body>
    </html>
  )
}
