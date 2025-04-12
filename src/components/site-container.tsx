import type React from "react"
import { cn } from "@/lib/utils"

interface SiteContainerProps {
  children: React.ReactNode
  className?: string
}

export function SiteContainer({ children, className }: SiteContainerProps) {
  return <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full", className)}>{children}</div>
}
