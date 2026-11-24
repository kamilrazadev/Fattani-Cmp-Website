import type { Metadata } from "next"
import { Suspense } from "react"
import View from "@/views/track-order"

export const metadata: Metadata = {
  title: "Track your order",
  robots: { index: false, follow: true },
  alternates: { canonical: "/track-order" },
}

export default function Page() {
  return <Suspense fallback={<div className="min-h-[80vh]" aria-hidden />}><View /></Suspense>
}
