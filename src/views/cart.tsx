"use client"

import { useState } from "react"
import { Link, useNavigate } from "@/lib/router"
import { ArrowLeft, ArrowRight, Check, Gift, Lock, Minus, Plus, ShieldCheck, ShoppingBag, Store, Tag, Trash2, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentLogos } from "@/components/logos"
import { ProductCard } from "@/components/product-card"
import { byId, fmt, PRODUCTS, specChips, warrantyOptions } from "@/lib/products"
import { SHIPPING_FLAT, useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Img } from "@/components/img"

export function CheckoutSteps({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Cart", "Details & payment", "Confirmation"]
  return (
    <ol className="flex items-center gap-2 text-[13px] font-bold">
      {steps.map((s, k) => {
        const n = k + 1, done = n < step, on = n === step
        return (
          <li key={s} className="flex items-center gap-2">
            <span className={cn("grid size-7 place-items-center rounded-full text-xs", done ? "bg-ok text-white" : on ? "bg-ink text-white" : "bg-white text-muted-foreground ring-1 ring-border")}>{done ? <Check className="size-3.5" /> : n}</span>
            <span className={cn(on ? "text-ink" : "text-muted-foreground", !on && "max-sm:hidden")}>{s}</span>
            {k < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border md:w-10" />}
          </li>
        )
      })}
    </ol>
  )
}

export default function CartPage() {
  const { cart, setQty, removeFromCart, setLineWarranty, cartTotal, cartCount } = useStore()
  const nav = useNavigate()
  const [coupon, setCoupon] = useState("")
  const points = Math.floor(cartTotal / 100)
  const suggestions = PRODUCTS.filter(p => p.inStock && !cart.some(l => l.id === p.id) && p.type === (byId.get(cart[0]?.id)?.type ?? "business")).slice(0, 4)

  if (!cart.length)
    return (
      <div className="mx-auto grid max-w-xl place-items-center px-4 py-20 text-center">
        <span className="grid size-20 place-items-center rounded-3xl bg-brand-50 text-brand"><ShoppingBag className="size-9" /></span>
        <h1 className="mt-6 text-4xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Browse 360+ tested laptops — everything you add shows up here.</p>
        <Button nativeButton={false} render={<Link to="/shop" viewTransition />} className="mt-7 h-12 rounded-full px-7 font-bold">Start shopping <ArrowRight /></Button>
      </div>
    )

  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-6 pb-32 md:px-6 md:pt-10 md:pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-[34px] leading-none font-bold md:text-5xl">Your cart</h1><p className="mt-2 text-sm font-semibold text-muted-foreground"><span className="num">{cartCount}</span> item{cartCount > 1 ? "s" : ""}</p></div>
        <CheckoutSteps step={1} />
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-3">
          {cart.map(l => {
            const p = byId.get(l.id)!
            const opts = warrantyOptions(p)
            const current = opts.find(o => o.label === l.warranty.label) ?? opts[0]
            return (
              <article key={l.id} className="grid grid-cols-[88px_1fr] gap-4 rounded-2xl border bg-white p-4 sm:grid-cols-[120px_1fr_auto] md:p-5">
                <Link to={`/product/${p.slug}`} viewTransition className="grid aspect-square place-items-center rounded-xl bg-paper p-2"><Img src={p.images[0]} alt={p.model} className="max-h-full object-contain mix-blend-multiply" /></Link>
                <div className="min-w-0">
                  <Link to={`/product/${p.slug}`} viewTransition className="line-clamp-2 text-[16px] font-extrabold hover:text-brand">{p.model}</Link>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">{specChips(p).join(" · ")}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Select value={current.id} onValueChange={(v: string | null) => { const o = opts.find(x => x.id === v)!; setLineWarranty(p.id, { label: o.label, price: o.price }) }} items={opts.map(o => ({ value: o.id, label: `${o.label}${o.price ? ` · +${fmt(o.price)}` : " · Free"}` }))}>
                      <SelectTrigger aria-label="Warranty" className="h-9 max-w-full rounded-lg bg-paper text-[13px] font-semibold"><ShieldCheck className="text-brand" /><SelectValue /></SelectTrigger>
                      <SelectContent>{opts.map(o => <SelectItem key={o.id} value={o.id}>{o.label} {o.price ? `· +${fmt(o.price)}` : "· Free"}</SelectItem>)}</SelectContent>
                    </Select>
                    <span className={cn("flex items-center gap-1 text-xs font-bold", p.inStock ? "text-ok" : "text-muted-foreground")}>{p.inStock ? <><Check className="size-3.5" />In stock</> : "Ask for ETA"}</span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-3 border-t pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                  <b className="num font-heading text-xl">{fmt((p.price + l.warranty.price) * l.qty)}</b>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-full border">
                      <button aria-label="Decrease" onClick={() => setQty(l.id, l.qty - 1)} className="grid size-9 place-items-center"><Minus className="size-3.5" /></button>
                      <span className="num w-6 text-center text-sm font-bold">{l.qty}</span>
                      <button aria-label="Increase" onClick={() => setQty(l.id, l.qty + 1)} className="grid size-9 place-items-center"><Plus className="size-3.5" /></button>
                    </div>
                    <button aria-label={`Remove ${p.model}`} onClick={() => { removeFromCart(l.id); toast("Removed from cart", { description: p.model }) }} className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              </article>
            )
          })}
          <Link to="/shop" viewTransition className="flex w-fit items-center gap-2 px-1 py-2 text-sm font-bold text-brand hover:underline"><ArrowLeft className="size-4" />Continue shopping</Link>
        </div>

        <aside className="rounded-[24px] border bg-white p-5 md:p-6 lg:sticky lg:top-[160px]">
          <h2 className="text-xl font-bold">Order summary</h2>
          <form onSubmit={e => { e.preventDefault(); toast.error("That coupon isn't valid", { description: "Check the code and try again." }) }} className="mt-4 flex gap-2">
            <div className="relative flex-1"><Tag className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="h-11 rounded-xl pl-9" /></div>
            <Button type="submit" variant="outline" disabled={!coupon} className="h-11 rounded-xl px-4 font-bold">Apply</Button>
          </form>
          <dl className="mt-5 grid gap-3 text-[14.5px]">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="num font-bold">{fmt(cartTotal)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Shipping</dt><dd className="text-right font-semibold">From {fmt(SHIPPING_FLAT)}<span className="block text-xs font-medium text-muted-foreground">Free if you pick up in store</span></dd></div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t pt-4"><span className="font-bold">Estimated total</span><b className="num font-heading text-3xl">{fmt(cartTotal + SHIPPING_FLAT)}</b></div>
          <p className="mt-2 text-xs text-muted-foreground">Or 3 interest-free installments of <b className="num text-ink">{fmt(Math.ceil((cartTotal + SHIPPING_FLAT) / 3))}</b> with BaadMay</p>
          <Button onClick={() => nav("/checkout", { viewTransition: true })} className="mt-5 h-13 w-full rounded-xl text-[15px] font-bold max-lg:hidden"><Lock />Proceed to checkout</Button>
          <ul className="mt-5 grid gap-2.5 border-t pt-5 text-[13px] font-semibold">
            <li className="flex items-center gap-2.5"><Gift className="size-4 text-gold" />You'll earn <b className="num">{points.toLocaleString("en-PK")}</b> Fattani Rewards points</li>
            <li className="flex items-center gap-2.5"><Truck className="size-4 text-brand" />Delivered across Pakistan in 2–4 working days</li>
            <li className="flex items-center gap-2.5"><Store className="size-4 text-brand" />Or pick up at GD-18, Techno City Mall</li>
          </ul>
          <PaymentLogos className="mt-5" />
        </aside>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-2xl font-bold md:text-3xl">You might also like</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">{suggestions.map(p => <ProductCard key={p.id} p={p} />)}</div>
        </section>
      )}

      <div className="pb-safe fixed inset-x-0 bottom-16 z-30 border-t bg-white/95 p-3 backdrop-blur-xl lg:hidden">
        <Button onClick={() => nav("/checkout", { viewTransition: true })} className="h-12 w-full rounded-xl text-[15px] font-bold"><Lock />Checkout · <span className="num">{fmt(cartTotal + SHIPPING_FLAT)}</span></Button>
      </div>
    </div>
  )
}
