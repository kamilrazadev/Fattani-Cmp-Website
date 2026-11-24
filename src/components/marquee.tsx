import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Infinite horizontal marquee (pure CSS, server-rendered). The duplicate is `inert` so keyboard and screen readers see each item once. */
export function Marquee({ children, reverse, duration = 40, gap = 16, className }: { children: ReactNode; reverse?: boolean; duration?: number; gap?: number; className?: string }) {
  return (
    <div className={cn("pause-on-hover mask-fade-x flex overflow-hidden", className)} style={{ ["--marquee-duration" as string]: `${duration}s`, ["--marquee-gap" as string]: `${gap}px` }}>
      <div className={cn("flex w-max shrink-0", reverse ? "animate-marquee-reverse" : "animate-marquee")} style={{ gap }}>
        {children}
        <div aria-hidden inert className="flex shrink-0" style={{ gap }}>{children}</div>
      </div>
    </div>
  )
}
