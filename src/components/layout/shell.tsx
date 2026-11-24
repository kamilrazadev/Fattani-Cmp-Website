"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Toaster } from "sonner"
import { StoreProvider, useStore, waLink } from "@/lib/store"
import { useEffect, useState } from "react"
import { DesktopHeader, MobileTabBar, MobileTopBar } from "@/components/layout/header"
import dynamic from "next/dynamic"
import { useIsMobile } from "@/lib/use-mobile"

// These pull in the product catalogue, so they only load once the shopper actually needs them.
const CartPanel = dynamic(() => import("@/components/layout/overlays").then(m => m.CartPanel), { ssr: false })
const SearchDialog = dynamic(() => import("@/components/layout/overlays").then(m => m.SearchDialog), { ssr: false })
const CompareBar = dynamic(() => import("@/components/layout/overlays").then(m => m.CompareBar), { ssr: false })
import { WhatsAppIcon } from "@/components/logos"

function Chrome({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const mobile = useIsMobile()
  const pathname = usePathname()
  const { cartOpen, searchOpen, compare, setSearchOpen } = useStore()
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !(e.target as HTMLElement).closest("input,textarea"))) { e.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener("keydown", f)
    return () => window.removeEventListener("keydown", f)
  }, [setSearchOpen])
  const [seen, setSeen] = useState({ cart: false, search: false })
  if (cartOpen && !seen.cart) setSeen(v => ({ ...v, cart: true }))
  if (searchOpen && !seen.search) setSeen(v => ({ ...v, search: true }))
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white">Skip to content</a>
      <DesktopHeader />
      <MobileTopBar />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <div className="print:hidden">{footer}</div>
      {pathname !== "/checkout" && <MobileTabBar />}
      {seen.cart && <CartPanel />}
      {seen.search && <SearchDialog />}
      {compare.length > 0 && <CompareBar />}
      <a
        href={waLink("Hi Fattani Computers, I have a question about a laptop.")}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Chat on WhatsApp"
        className="fixed right-5 bottom-6 z-30 hidden size-14 place-items-center rounded-full bg-[#128C4A] text-white shadow-lg shadow-[#25D366]/30 transition hover:scale-105 md:grid print:!hidden"
      >
        <WhatsAppIcon className="size-7" />
      </a>
      <Toaster position={mobile ? "top-center" : "bottom-left"} richColors closeButton toastOptions={{ className: "font-sans" }} />
    </>
  )
}

export function Shell({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  return (
    <StoreProvider>
      <Chrome footer={footer}>{children}</Chrome>
    </StoreProvider>
  )
}
