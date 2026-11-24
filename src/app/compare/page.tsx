import type { Metadata } from "next"
import { Suspense } from "react"
import View from "@/views/compare"

export const metadata: Metadata = {
  title: "Compare laptops",
  robots: { index: false, follow: true },
  alternates: { canonical: "/compare" },
}

export default function Page() {
  return <Suspense fallback={<div className="min-h-[80vh]" aria-hidden />}><View /></Suspense>
}
