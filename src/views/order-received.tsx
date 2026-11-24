"use client"

import { useCallback, useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "@/lib/router"
import { Check, Copy, Download, Info, Loader2, Mail, Phone, ShieldCheck, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { CheckoutSteps } from "@/views/cart"
import { WhatsAppIcon } from "@/components/logos"
import { fmt } from "@/lib/catalog-core"
import { loadOrder, waLink, type Address, type Order } from "@/lib/store"
import { PHONE } from "@/lib/site"
import { downloadInvoice } from "@/lib/invoice"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Img } from "@/components/img"

/** Set by checkout; the confirmation can only be viewed in the tab session that placed the order. */
export const JUST_PLACED = "fc.justPlaced"

const addressText = (a: Address) => [`${a.first} ${a.last}`, a.company, [a.street, a.apt].filter(Boolean).join(", "), [a.city, a.province, a.postcode].filter(Boolean).join(", ")].filter(Boolean)

function Row({ k, v, strong }: { k: string; v: React.ReactNode; strong?: boolean }) {
  return <div className="flex items-baseline justify-between gap-4 py-2.5"><dt className="text-[13.5px] text-muted-foreground">{k}</dt><dd className={cn("num text-right text-[14px] font-semibold", strong && "font-heading text-xl font-bold")}>{v}</dd></div>
}

export default function OrderReceivedPage() {
  const { id = "" } = useParams() as { id?: string }
  const nav = useNavigate()
  // Order data lives in this browser only, so read it after mount (keeps server and client markup identical).
  const [state, setState] = useState<{ o: Order | null; fresh: boolean } | null>(null)
  useEffect(() => {
    let fresh = false
    try { fresh = sessionStorage.getItem(JUST_PLACED) === id } catch { /* ignore */ }
    setState({ o: loadOrder(Number(id)), fresh })
  }, [id])
  const o = state?.o ?? null
  const fresh = state?.fresh ?? false
  const [leaveTo, setLeaveTo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2500)
    return () => clearTimeout(t)
  }, [copied])

  // Warn before closing or reloading the tab.
  useEffect(() => {
    if (!fresh) return
    const f = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener("beforeunload", f)
    return () => window.removeEventListener("beforeunload", f)
  }, [fresh])

  // Intercept in-app links once, so the shopper learns this page won't be shown again.
  useEffect(() => {
    if (!fresh) return
    const f = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a")
      if (!a || a.target === "_blank" || a.dataset.leaveOk) return
      const href = a.getAttribute("href") ?? ""
      if (!href.startsWith("/") || href.startsWith(`/order-received/${id}`)) return
      e.preventDefault(); e.stopPropagation()
      setLeaveTo(href)
    }
    document.addEventListener("click", f, true)
    return () => document.removeEventListener("click", f, true)
  }, [fresh, id])

  const leave = useCallback(() => {
    try { sessionStorage.removeItem(JUST_PLACED) } catch { /* ignore */ }
    const to = leaveTo ?? "/"
    setLeaveTo(null)
    nav(to)
  }, [leaveTo, nav])

  if (!state) return <div className="mx-auto max-w-[1040px] px-4 py-24 text-center text-muted-foreground" role="status">Loading your order…</div>
  if (!o || !fresh) return <Navigate to={`/track-order${id ? `?order=${id}` : ""}`} replace />

  const date = new Date(o.date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })
  const payName = o.payment === "bank" ? "Bank transfer" : o.payment === "cod" ? "Cash on delivery" : "BaadMay"
  const steps = o.payment === "bank"
    ? [["We send our bank details", `On WhatsApp from ${PHONE.sales}`], [`Pay ${fmt(o.total)}`, `Use #${o.id} as the reference`], ["Share the payment screenshot", "On the same WhatsApp chat"], [o.delivery === "pickup" ? "Collect from the shop" : "We dispatch your laptop", o.delivery === "pickup" ? "GD-18, Techno City Mall" : "Delivered in 2–4 working days"]]
    : o.payment === "cod"
      ? [["We confirm on WhatsApp", `From ${PHONE.sales}`], ["Your laptop is dispatched", "Tested, packed, 2–4 working days"], ["Pay the courier", `Keep ${fmt(o.total)} ready`]]
      : [["Complete BaadMay approval", "Using the link we send you"], ["We confirm your order", "Once BaadMay approves"], ["Delivered to you", "Pay the rest over the next months"]]

  const copy = () => {
    Promise.resolve(navigator.clipboard?.writeText(String(o.id))).catch(() => { /* ignore */ })
    setCopied(true)
    toast.success("Order number copied", { id: "copied" })
  }
  const invoice = async () => { setBusy(true); try { await downloadInvoice(o); toast.success("Invoice downloaded", { description: `Fattani-Invoice-FC-${o.id}.pdf` }) } finally { setBusy(false) } }
  const waMsg = o.payment === "bank"
    ? `Hi Fattani Computers, I placed order #${o.id} for ${fmt(o.total)}. Please send your bank details.`
    : `Hi Fattani Computers, I placed order #${o.id} for ${fmt(o.total)}.`

  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-5 pb-28 md:px-6 md:pt-10 md:pb-16">
      <div className="hidden justify-end md:flex"><CheckoutSteps step={3} /></div>

      {/* Header — compact on phones */}
      <header className="flex items-start gap-4 md:mt-6 md:items-center">
        <span className="grid size-11 shrink-0 animate-in place-items-center rounded-full bg-ok text-white duration-500 zoom-in-50 md:size-14"><Check className="size-6 md:size-7" strokeWidth={3} /></span>
        <div className="min-w-0">
          <h1 className="text-[26px] leading-tight font-bold md:text-[40px]">Thank you, {o.billing.first}!</h1>
          <p className="mt-1 text-[14.5px] text-muted-foreground md:text-base">Your order <b className="text-ink">#{o.id}</b> has been received.</p>
        </div>
      </header>

      {/* Important: this page is one-time */}
      <section className="mt-6 rounded-2xl border border-gold/50 bg-[#fff8e6] p-4 md:p-5">
        <div className="flex gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-[#9a6b00]" />
          <div className="min-w-0 text-[14px] leading-relaxed text-[#4d3a00]">
            <b className="block text-[15px] text-ink">Please save your order number</b>
            This confirmation is shown only once. We've emailed your order details to <b>{o.contact.email}</b>, and our team will contact you on WhatsApp at <b>{o.contact.phone}</b> shortly. You can check your order status any time from <Link to={`/track-order?order=${o.id}`} data-leave-ok="1" onClick={() => { try { sessionStorage.removeItem(JUST_PLACED) } catch { /* ignore */ } }} className="font-bold underline">Track order</Link>.
            <button onClick={copy} className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-left ring-1 ring-gold/40 transition hover:ring-gold sm:w-auto sm:justify-start">
              <span><span className="block text-[11px] font-bold text-muted-foreground uppercase">Order number</span><b className="num font-mono text-lg text-ink">#{o.id}</b></span>
              <span className={cn("flex items-center gap-1.5 text-sm font-bold transition-colors", copied ? "text-ok" : "text-brand")}>{copied ? <Check className="size-4" strokeWidth={3} /> : <Copy className="size-4" />}{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </section>

      <div className="mt-6 grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-5">
          <section className="rounded-2xl border bg-white p-5 md:p-6">
            <h2 className="text-lg font-bold">What happens next</h2>
            <ol className="mt-4 grid gap-3">
              {steps.map(([t, d], k) => (
                <li key={t} className="flex items-center gap-3">
                  <span className={cn("grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-bold", k === 0 ? "bg-brand text-white" : "bg-paper ring-1 ring-border")}>{k + 1}</span>
                  <div className="min-w-0"><b className="block text-[14.5px] leading-tight">{t}</b><span className="text-[13px] text-muted-foreground">{d}</span></div>
                </li>
              ))}
            </ol>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <a href={waLink(waMsg)} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-[14.5px] font-bold whitespace-nowrap text-[#073b1f] transition hover:brightness-95">
                <WhatsAppIcon className="size-5 shrink-0" />{o.payment === "bank" ? "Get bank details" : "Chat on WhatsApp"}
              </a>
              <Button variant="outline" onClick={invoice} disabled={busy} className="h-12 rounded-xl text-[14.5px] font-bold">{busy ? <Loader2 className="animate-spin" /> : <Download />}Download invoice</Button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border bg-white">
            <h2 className="border-b px-5 py-4 text-lg font-bold md:px-6">Items</h2>
            <ul className="divide-y">
              {o.lines.map(l => (
                <li key={l.id} className="flex gap-3 px-5 py-4 md:px-6">
                  <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-paper p-1"><Img src={l.image} alt="" className="max-h-full mix-blend-multiply" /></span>
                  <div className="min-w-0 flex-1">
                    <b className="block text-[14.5px] leading-snug">{l.model} <span className="font-medium text-muted-foreground">× {l.qty}</span></b>
                    <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-brand"><ShieldCheck className="size-3.5 shrink-0" /><span className="truncate">{l.warranty.label}</span></span>
                  </div>
                  <b className="num text-[14px] whitespace-nowrap">{fmt((l.price + l.warranty.price) * l.qty)}</b>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="grid gap-5 md:sticky md:top-[160px]">
          <section className="rounded-2xl border bg-white p-5">
            <h2 className="text-lg font-bold">Summary</h2>
            <dl className="mt-2 divide-y">
              <Row k="Date" v={date} />
              <Row k="Payment" v={payName} />
              <Row k="Delivery" v={o.delivery === "pickup" ? "Store pickup" : "Courier, 2–4 days"} />
              <Row k="Subtotal" v={fmt(o.subtotal)} />
              <Row k="Shipping" v={o.shipping ? fmt(o.shipping) : "Free"} />
              {o.fee > 0 && <Row k="COD handling" v={fmt(o.fee)} />}
              <Row k="Total" v={fmt(o.total)} strong />
            </dl>
          </section>
          <section className="rounded-2xl border bg-white p-5 text-[14px]">
            <h2 className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">{o.shippingAddress ? "Delivering to" : "Collect from"}</h2>
            {o.shippingAddress
              ? <p className="mt-2 leading-relaxed">{addressText(o.shippingAddress).map(l => <span key={l} className="block">{l}</span>)}</p>
              : <p className="mt-2 flex gap-2 leading-relaxed"><Store className="mt-0.5 size-4 shrink-0 text-brand" />GD-18, Techno City Mall, I.I. Chundrigar Road, Karachi</p>}
            <div className="mt-3 grid gap-1 border-t pt-3 text-muted-foreground">
              <span className="flex items-center gap-2"><Phone className="size-4" />{o.contact.phone}</span>
              <span className="flex items-center gap-2 break-all"><Mail className="size-4 shrink-0" />{o.contact.email}</span>
            </div>
          </section>
          <Button nativeButton={false} render={<Link to="/shop" />} className="h-12 rounded-xl font-bold">Continue shopping</Button>
        </aside>
      </div>

      <Dialog open={!!leaveTo} onOpenChange={v => !v && setLeaveTo(null)}>
        <DialogContent className="gap-0 p-6 sm:max-w-md">
          <span className="grid size-11 place-items-center rounded-full bg-gold/20 text-[#9a6b00]"><Info className="size-5" /></span>
          <DialogTitle className="mt-4 font-heading text-xl font-bold">Before you leave</DialogTitle>
          <DialogDescription className="mt-2 text-[14.5px] leading-relaxed">
            You won't be able to open this confirmation again. Your order <b className="text-ink">#{o.id}</b> is saved — we've emailed the details to {o.contact.email} and will contact you on WhatsApp shortly. Use <b className="text-ink">Track order</b> with your order number and phone to check its status.
          </DialogDescription>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Button variant="outline" onClick={() => setLeaveTo(null)} className="h-11 rounded-xl font-bold">Stay on this page</Button>
            <Button onClick={leave} className="h-11 rounded-xl font-bold">Got it, continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
