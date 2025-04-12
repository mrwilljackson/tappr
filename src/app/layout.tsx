import type React from "react"
import { Patua_One, Montserrat } from "next/font/google"
import "./globals.css"

const patuaOne = Patua_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patua-one",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata = {
  title: "TAPPR - The Ultimate Homebrewer's Companion",
  description:
    "Track your kegs, bottles, and brews with precision. Monitor, taste, and share your homebrewing journey with friends.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${patuaOne.variable} ${montserrat.variable} font-montserrat`}>{children}</body>
    </html>
  )
}
