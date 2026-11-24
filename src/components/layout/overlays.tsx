"use client"

import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "@/lib/router"
import { ArrowRight, GitCompareArrows, Minus, Plus, ShoppingBag, Trash2, Truck, X, Search as SearchIcon, Gamepad2, Apple, Laptop, Wallet } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { WhatsAppIcon } from "@/components/logos"
import { byId, fmt, searchProducts, specChips } from "@/lib/products"
import { useStore, waLink } from "@/lib/store"
import { useIsMobile } from "@/lib/use-mobile"
import { cn } from "@/lib/utils"
import { Img } from "@/components/img"

export { useIsMobile }

/** Bottom sheet on phones, side panel on desktop. */
export function ResponsivePanel({ open, onOpenChange, title, description, children, footer }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; description?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  const mobile = useIsMobile()
  if (mobile)
    return (
      <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
        <DrawerContent className="max-h-[88dvh]">
          <DrawerHeader className="text-left"><DrawerTitle className="font-heading text-xl font-bold">{title}</DrawerTitle>{description && <DrawerDescription>{description}</DrawerDescription>}</DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4">{children}</div>
          {footer && <div className="pb-safe border-t p-4">{footer}</div>}
        </DrawerContent>
      </Drawer>
    )
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5"><SheetTitle className="font-heading text-2xl font-bold">{title}</SheetTitle>{description && <SheetDescription>{description}</SheetDescription>}</SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6">{children}</div>
        {footer && <div className="border-t p-6">{footer}</div>}
      </SheetContent>
    </Sheet>
  )
}

export function CartPanel() {
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart, cartTotal, cartCount } = useStore()
  const message = "Hi Fattani Computers, I'd like to order:\n" + cart.map(l => {
    const p = byId.get(l.id)!
    return `• ${p.model} x${l.qty} — ${fmt(p.price)}${l.warranty.price ? ` + ${l.warranty.label}` : ""}`
  }).join("\n") + `\nTotal: ${fmt(cartTotal)}`

  return (
    <ResponsivePanel
      open={cartOpen}
      onOpenChange={setCartOpen}
      title="Your cart"
      description={cartCount ? `${cartCount} item${cartCount > 1 ? "s" : ""} · delivery across Pakistan` : undefined}
      footer={cart.length ? (
        <div className="grid gap-2.5">
          <div className="flex items-baseline justify-between"><span className="font-semibold text-muted-foreground">Subtotal</span><b className="num font-heading text-2xl">{fmt(cartTotal)}</b></div>
          <p className="text-xs text-muted-foreground">Or 3 interest-free installments of <b className="text-ink">{fmt(Math.ceil(cartTotal / 3))}</b> with BaadMay</p>
          <div className="grid grid-cols-[1fr_1.6fr] gap-2"><Button nativeButton={false} render={<Link to="/cart" viewTransition />} onClick={() => setCartOpen(false)} variant="outline" size="lg" className="h-12 rounded-xl text-[15px] font-bold">View cart</Button><Button nativeButton={false} render={<Link to="/checkout" viewTransition />} onClick={() => setCartOpen(false)} size="lg" className="h-12 rounded-xl text-[15px] font-bold">Checkout</Button></div>
          <a href={waLink(message)} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-[15px] font-bold text-[#073b1f] transition hover:brightness-95">
            <WhatsAppIcon className="size-5" />Order on WhatsApp
          </a>
        </div>
      ) : undefined}
    >
      {cart.length === 0 ? (
        <div className="grid place-items-center py-16 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand"><ShoppingBag className="size-7" /></span>
          <b className="mt-4 font-heading text-xl">Your cart is empty</b>
          <p className="mt-1 max-w-[30ch] text-sm text-muted-foreground">Browse 360+ tested laptops — everything you add shows up here.</p>
          <Button nativeButton={false} render={<Link to="/shop" viewTransition />} onClick={() => setCartOpen(false)} className="mt-5 h-11 rounded-full px-5 font-bold">Start shopping <ArrowRight /></Button>
        </div>
      ) : (
        <>
          <div className="my-4 flex items-center gap-3 rounded-xl bg-ok/8 p-3 text-sm font-semibold text-ok"><Truck className="size-5 shrink-0" />Delivered anywhere in Pakistan · or pick up free in store</div>
          <ul className="divide-y">
            {cart.map(l => {
              const p = byId.get(l.id)!
              return (
                <li key={l.id} className="flex gap-3 py-4">
                  <Link to={`/product/${p.slug}`} onClick={() => setCartOpen(false)} className="grid size-20 shrink-0 place-items-center rounded-xl border bg-white p-1.5"><Img src={p.images[0]} alt="" className="max-h-full mix-blend-multiply" /></Link>
                  <div className="min-w-0 flex-1">
                    <b className="line-clamp-2 text-sm leading-snug">{p.model}</b>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{specChips(p).slice(0, 3).join(" · ")}</p>
                    {l.warranty.price > 0 && <p className="mt-0.5 text-xs font-semibold text-brand">+ {l.warranty.label}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border">
                        <button aria-label="Decrease" onClick={() => setQty(l.id, l.qty - 1)} className="grid size-8 place-items-center"><Minus className="size-3.5" /></button>
                        <span className="num w-6 text-center text-sm font-bold">{l.qty}</span>
                        <button aria-label="Increase" onClick={() => setQty(l.id, l.qty + 1)} className="grid size-8 place-items-center"><Plus className="size-3.5" /></button>
                      </div>
                      <b className="num text-sm">{fmt((p.price + l.warranty.price) * l.qty)}</b>
                    </div>
                  </div>
                  <button aria-label="Remove" onClick={() => removeFromCart(l.id)} className="self-start p-1 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </ResponsivePanel>
  )
}

const QUICK = [
  { label: "Gaming laptops", to: "/shop?type=gaming", icon: Gamepad2 },
  { label: "Lenovo ThinkPad", to: "/shop?brand=Lenovo&q=thinkpad", icon: Laptop },
  { label: "MacBooks", to: "/shop?type=macbook", icon: Apple },
  { label: "Under Rs 60,000", to: "/shop?max=60000", icon: Wallet },
]

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useStore()
  const [q, setQ] = useState("")
  const nav = useNavigate()
  const results = searchProducts(q, 8)
  const go = (to: string) => { setSearchOpen(false); setQ(""); nav(to, { viewTransition: true }) }

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen} title="Search laptops" description="Search by model, brand or spec" className="sm:max-w-2xl">
      <Command shouldFilter={false} loop>
      <CommandInput placeholder="Model, brand or spec — “T14 16GB”, “RTX 5060”…" value={q} onValueChange={setQ} />
      <CommandList className="max-h-[60vh]">
        {q && <CommandEmpty>No laptops match “{q}”. Try “ThinkPad”, “i7” or “16GB”.</CommandEmpty>}
        {!q && (
          <CommandGroup heading="Popular">
            {QUICK.map(s => <CommandItem key={s.to} value={s.label} onSelect={() => go(s.to)}><s.icon />{s.label}</CommandItem>)}
          </CommandGroup>
        )}
        {results.length > 0 && (
          <CommandGroup heading={`Laptops · ${results.length}${results.length === 8 ? "+" : ""}`}>
            {results.map(p => (
              <CommandItem key={p.id} value={`${p.id}`} onSelect={() => go(`/product/${p.slug}`)} className="gap-3 py-2">
                <span className="grid size-12 shrink-0 place-items-center rounded-lg border bg-white p-1"><Img src={p.images[0]} alt="" className="max-h-full mix-blend-multiply" /></span>
                <span className="min-w-0 flex-1"><b className="block truncate">{p.model}</b><span className="block truncate text-xs text-muted-foreground">{specChips(p).join(" · ")}</span></span>
                <b className="num text-brand">{fmt(p.price)}</b>
              </CommandItem>
            ))}
            <CommandItem value="see-all" onSelect={() => go(`/shop?q=${encodeURIComponent(q)}`)} className="justify-center font-bold text-brand"><SearchIcon />See all results for “{q}”</CommandItem>
          </CommandGroup>
        )}
      </CommandList>
      </Command>
    </CommandDialog>
  )
}

export function CompareBar() {
  const { compare, toggleCompare, setCompare } = useStore()
  const { pathname } = useLocation()
  const show = compare.length > 0 && !["/compare", "/checkout", "/cart"].includes(pathname) && !pathname.startsWith("/order")
  return (
    <div className={cn("fixed inset-x-3 bottom-[84px] z-30 mx-auto max-w-xl transition duration-500 ease-[cubic-bezier(.2,.8,.2,1)] md:bottom-6", show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0", pathname.startsWith("/product") && "max-md:hidden")}>
      <div className="flex items-center gap-2 rounded-2xl bg-ink p-2 pl-3 text-white shadow-2xl shadow-ink/30 sm:pl-4">
        <GitCompareArrows className="size-5 shrink-0 text-sky max-sm:hidden" />
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map(i => {
            const p = byId.get(compare[i])
            return (
              <div key={i} className={cn("relative grid size-10 place-items-center rounded-lg sm:size-11", p ? "bg-white" : "border border-dashed border-white/25 max-sm:hidden")}>
                {p && <>
                  <Img src={p.images[0]} alt={p.model} className="max-h-[85%] max-w-[85%] mix-blend-multiply" />
                  <button aria-label={`Remove ${p.model}`} onClick={() => toggleCompare(p.id, p.model)} className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-deal text-white"><X className="size-3" /></button>
                </>}
              </div>
            )
          })}
        </div>
        <Link to="/compare" viewTransition className={cn("ml-auto flex h-10 items-center gap-1.5 rounded-xl bg-white px-3 text-sm font-bold whitespace-nowrap text-ink transition hover:bg-brand-50 sm:h-11 sm:px-4", compare.length < 2 && "pointer-events-none opacity-50")}>
          Compare <span className="num">{compare.length}</span><ArrowRight className="size-4" />
        </Link>
        <button aria-label="Clear compare" onClick={() => setCompare([])} className="grid size-10 shrink-0 place-items-center rounded-xl text-white/70 hover:bg-white/10 sm:size-11"><X className="size-4" /></button>
      </div>
    </div>
  )
}
