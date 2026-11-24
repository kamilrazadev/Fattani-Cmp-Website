import type { Metadata } from "next"
import { Suspense } from "react"
import View from "@/views/order-received"

export const metadata: Metadata = { title: "Order received", robots: { index: false, follow: false } }

export default function Page() {
  return <Suspense fallback={<div className="min-h-[80vh]" aria-hidden />}><View /></Suspense>
}
