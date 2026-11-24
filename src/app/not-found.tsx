import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Page not found", robots: { index: false } }

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="eyebrow text-brand">404</p>
      <h1 className="mt-3 text-4xl font-bold md:text-5xl">We couldn&apos;t find that page.</h1>
      <p className="mt-3 text-muted-foreground">The laptop or page you&apos;re looking for may have been sold or moved.</p>
      <Link href="/shop" className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-bold text-white hover:bg-brand">Browse all laptops</Link>
    </div>
  )
}
