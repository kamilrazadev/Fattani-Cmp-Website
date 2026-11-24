"use client"

import { Link, NavLink, useLocation, useNavigate } from "@/lib/router"
import { ArrowLeft, Clock, GitCompareArrows, Heart, Phone, Search, ShoppingBag, Truck, ShieldCheck, Gamepad2, Laptop, BadgeCheck, Sparkles, Apple, School, Network } from "lucide-react"
import { MegaNav } from "@/components/layout/mega-nav"
import { LOGO, PHONE } from "@/lib/site"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Img } from "@/components/img"

function CountBadge({ n, className }: { n: number; className?: string }) {
  if (!n) return null
  return <span key={n} className={cn("absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] animate-in zoom-in-50 place-items-center rounded-full bg-deal px-1 text-[10.5px] font-extrabold text-white ring-2 ring-background duration-300", className)}>{n}</span>
}

function IconLink({ label, onClick, to, children, n }: { label: string; onClick?: () => void; to?: string; children: React.ReactNode; n?: number }) {
  const cls = "relative grid size-11 place-items-center rounded-full text-ink transition hover:bg-white"
  return to ? (
    <Link to={to} viewTransition aria-label={label} className={cls}>{children}<CountBadge n={n ?? 0} /></Link>
  ) : (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>{children}<CountBadge n={n ?? 0} /></button>
  )
}


export function DesktopHeader() {
  const { cartCount, compare, wishlist, setCartOpen, setSearchOpen } = useStore()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24)
    f(); window.addEventListener("scroll", f, { passive: true })
    return () => window.removeEventListener("scroll", f)
  }, [])

  return (
    <header className={cn("sticky top-0 z-40 hidden print:!hidden border-b border-transparent bg-background/80 backdrop-blur-xl backdrop-saturate-150 transition-[box-shadow,border-color] md:block", scrolled && "border-border shadow-[0_8px_30px_-20px_rgba(10,26,34,.35)]")}>
      <div className="bg-ink text-[12.5px] font-semibold text-white/75">
        <div className="mx-auto flex h-9 max-w-[1320px] items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-sky" />Mon–Sat <b className="text-white">12 PM – 9 PM</b></span>
            <span className="flex items-center gap-1.5"><Truck className="size-3.5 text-sky" />Delivery <b className="text-white">across Pakistan</b></span>
            <span className="hidden items-center gap-1.5 xl:flex"><ShieldCheck className="size-3.5 text-sky" />Official partner of <b className="text-white">Dell Pakistan</b></span>
          </div>
          <div className="flex items-center gap-5 max-lg:hidden">
            <a href="#corporate" className="hover:text-white">Corporate invoice</a>
            <a href="#rewards" className="hover:text-white">Fattani Rewards</a>
            <Link to="/track-order" className="hover:text-white">Track order</Link>
            <a href="/#visit" className="hover:text-white">Store locator</a>
          </div>
        </div>
      </div>

      <div className={cn("mx-auto flex max-w-[1320px] items-center gap-3 px-4 transition-[height] lg:gap-6 lg:px-6", scrolled ? "h-16" : "h-[76px]")}>
        <Link to="/" viewTransition className="shrink-0"><Img src={LOGO} width={400} height={125} sizes="176px" priority quality={90} alt="Fattani Computers — the name you can trust" className="h-9 w-auto lg:h-11" /></Link>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="group flex h-12 max-w-xl min-w-0 flex-1 items-center gap-3 rounded-full border border-input bg-white pr-2 pl-5 text-left text-[14.5px] font-medium text-muted-foreground transition hover:border-brand/50"
        >
          <Search className="size-[18px]" />
          <span className="flex-1 truncate">Search 360+ laptops — try “ThinkPad 16GB” or “RTX”</span>
          <kbd className="rounded-md border bg-paper px-2 py-0.5 font-mono text-[11px] max-lg:hidden">Ctrl K</kbd>
        </button>

        <nav className="ml-auto flex shrink-0 items-center gap-0.5 lg:gap-1">
          <IconLink label="Compare" to="/compare" n={compare.length}><GitCompareArrows className="size-5" /></IconLink>
          <IconLink label="Wishlist" to="/shop?saved=1" n={wishlist.length}><Heart className="size-5" /></IconLink>
          <IconLink label="Cart" onClick={() => setCartOpen(true)} n={cartCount}><ShoppingBag className="size-5" /></IconLink>
          <a href={`tel:${PHONE.mainTel}`} aria-label={`Call ${PHONE.main}`} className="ml-1 flex h-11 items-center gap-2 rounded-full bg-ink px-3.5 text-sm font-bold text-white transition hover:bg-brand lg:ml-2 lg:pr-5 lg:pl-4">
            <Phone className="size-4" /><span className="max-lg:hidden">{PHONE.main}</span>
          </a>
        </nav>
      </div>

      <div className="border-t">
        <div className="no-scrollbar mx-auto flex h-12 max-w-[1320px] items-center gap-1 px-4 max-lg:overflow-x-auto">
          <MegaNav />
          <span className="mx-2 h-5 w-px bg-border" />
          {[["Gaming", "/shop?type=gaming"], ["MacBook", "/shop?type=macbook"], ["ThinkPad", "/shop?brand=Lenovo&q=thinkpad"], ["Dell Latitude", "/shop?brand=Dell&q=latitude"], ["Chromebooks", "/shop?type=chromebook"]].map(([l, to]) => (
            <Link key={l} to={to} viewTransition className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap text-ink-2 transition hover:bg-white hover:text-ink">{l}</Link>
          ))}
          <a href="#networking" className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap text-ink-2 hover:bg-white"><Network className="size-4" />Networking</a>
          <Link to="/shop?deals=1" viewTransition className="ml-auto shrink-0 rounded-lg px-3 py-2 text-sm font-bold whitespace-nowrap text-deal hover:bg-deal/10">Clearance sale</Link>
        </div>
      </div>
    </header>
  )
}

const TITLES: Record<string, string> = { "/shop": "Shop", "/compare": "Compare", "/cart": "Cart", "/checkout": "Checkout", "/track-order": "Track order" }

/** App-style top bar on phones: logo on home, back + title on inner pages. */
export function MobileTopBar() {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const { setSearchOpen, wishlist } = useStore()
  const home = pathname === "/"
  const title = TITLES[pathname] ?? (pathname.startsWith("/product") ? "Product" : pathname.startsWith("/order") ? "Order received" : "")
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl md:hidden print:hidden">
      <div className="flex h-14 items-center gap-2 px-3">
        {home ? (
          <Link to="/" className="pl-1"><Img src={LOGO} width={400} height={125} sizes="144px" priority quality={90} alt="Fattani Computers" className="h-9 w-auto" /></Link>
        ) : (
          <>
            <button aria-label="Back" onClick={() => (window.history.length > 1 ? nav(-1) : nav("/"))} className="grid size-10 place-items-center rounded-full active:bg-muted"><ArrowLeft className="size-5" /></button>
            <span className="font-heading text-lg font-bold">{title}</span>
          </>
        )}
        <div className="ml-auto flex items-center">
          <button aria-label="Search" onClick={() => setSearchOpen(true)} className="grid size-10 place-items-center rounded-full active:bg-muted"><Search className="size-5" /></button>
          <Link to="/shop?saved=1" aria-label="Wishlist" className="relative grid size-10 place-items-center rounded-full active:bg-muted"><Heart className="size-5" /><CountBadge n={wishlist.length} className="top-1 right-1" /></Link>
          <a href={`tel:${PHONE.mainTel}`} aria-label="Call" className="grid size-10 place-items-center rounded-full active:bg-muted"><Phone className="size-5" /></a>
        </div>
      </div>
    </header>
  )
}

export function MobileTabBar() {
  const { cartCount, compare, setSearchOpen } = useStore()
  const tab = "relative flex flex-1 flex-col items-center justify-center gap-1 text-[10.5px] font-bold text-muted-foreground transition active:scale-95"
  const active = ({ isActive }: { isActive: boolean }) => cn(tab, isActive && "text-brand")
  return (
    <nav aria-label="App navigation" className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 backdrop-blur-xl md:hidden">
      <div className="flex h-16">
        <NavLink to="/" end viewTransition className={active}>{({ isActive }) => <><Laptop className={cn("size-[22px]", isActive && "stroke-[2.4]")} />Home</>}</NavLink>
        <NavLink to="/shop" viewTransition className={active}>{({ isActive }) => <><ShoppingBagIcon active={isActive} />Shop</>}</NavLink>
        <button onClick={() => setSearchOpen(true)} className={tab}><span className="-mt-6 grid size-12 place-items-center rounded-2xl bg-ink text-white shadow-lg shadow-ink/25"><Search className="size-[22px]" /></span>Search</button>
        <NavLink to="/compare" viewTransition className={active}>{({ isActive }) => <><span className="relative"><GitCompareArrows className={cn("size-[22px]", isActive && "stroke-[2.4]")} /><CountBadge n={compare.length} className="-top-2 -right-2.5" /></span>Compare</>}</NavLink>
        <NavLink to="/cart" viewTransition className={active}><span className="relative"><ShoppingBag className="size-[22px]" /><CountBadge n={cartCount} className="-top-2 -right-2.5" /></span>Cart</NavLink>
      </div>
    </nav>
  )
}
function ShoppingBagIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-[22px]", active && "stroke-[2.4]")} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}
