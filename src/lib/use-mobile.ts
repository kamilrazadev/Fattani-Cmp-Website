"use client"
import { useEffect, useState } from "react"

/** True below the breakpoint. Starts false so server and client markup match, then syncs after mount. */
export function useIsMobile(bp = 768) {
  const [m, setM] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${bp - 1}px)`)
    const f = () => setM(mq.matches)
    f(); mq.addEventListener("change", f)
    return () => mq.removeEventListener("change", f)
  }, [bp])
  return m
}
