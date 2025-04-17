import type React from "react"
import { patuaOne, montserrat } from "./fonts"
import "./globals.css"

export const metadata = {
  title: "TAPPr - The Ultimate Homebrewer's Companion",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#d97706" />
      </head>
      <body className="font-montserrat">{children}</body>
    </html>
  )
}
