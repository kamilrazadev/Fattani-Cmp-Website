import type { Metadata } from "next"
import { Suspense } from "react"
import View from "@/views/checkout"

export const metadata: Metadata = {
  title: "Secure checkout",
  robots: { index: false, follow: true },
  alternates: { canonical: "/checkout" },
}

export default function Page() {
  return <Suspense fallback={<div className="min-h-[80vh]" aria-hidden />}><View /></Suspense>
}
