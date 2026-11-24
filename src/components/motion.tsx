"use client"

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function useInView<T extends Element>(opts: IntersectionObserverInit = { threshold: 0.15 }, once = true) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); if (once) io.disconnect() }
      else if (!once) setInView(false)
    }, opts)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [ref, inView] as const
}

/** Fades + lifts children in when they scroll into view. */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; as?: ElementType }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)]", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6", className)}
    >
      {children}
    </Tag>
  )
}

// Counters that have already played during this page load (keyed by their position in the tree).
const played = new Set<string>()

/** Counts up from 0 the first time it scrolls into view; afterwards (even after navigating away and back) it shows the final value. */
export function Counter({ to, duration = 1800, suffix = "", prefix = "", className, decimals = 0 }: { to: number; duration?: number; suffix?: string; prefix?: string; className?: string; decimals?: number }) {
  const key = `${typeof window !== "undefined" ? window.location.pathname : ""}|${prefix}${to}${suffix}|${className ?? ""}`
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const [val, setVal] = useState(() => (played.has(key) ? to : 0))
  useEffect(() => {
    if (!inView || played.has(key)) return
    played.add(key)
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1)
      setVal(to * (1 - Math.pow(1 - p, 4)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); setVal(to) }
  }, [inView, to, duration, key])
  return (
    <span ref={ref} className={cn("num", className)}>
      {prefix}{val.toLocaleString("en-PK", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  )
}
