import type { Metadata } from "next"
import { Suspense } from "react"
import View from "@/views/cart"

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cart" },
}

export default function Page() {
  return <Suspense fallback={<div className="min-h-[80vh]" aria-hidden />}><View /></Suspense>
}
