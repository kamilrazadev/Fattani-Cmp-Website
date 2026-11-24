"use client"

import { useState } from "react"
import { Link, useSearchParams } from "@/lib/router"
import { Check, Loader2, PackageSearch, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WhatsAppIcon } from "@/components/logos"
import { fmt } from "@/lib/catalog-core"
import { loadOrder, waLink, type Order } from "@/lib/store"
import { PHONE } from "@/lib/site"
import { cn } from "@/lib/utils"

const digits = (s: string) => s.replace(/\D/g, "").slice(-10)

export default function TrackOrderPage() {
  const [sp] = useSearchParams()
  const [num, setNum] = useState(sp.get("order") ?? "")
  const [phone, setPhone] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "missing" | Order>("idle")

  const find = (e: React.FormEvent) => {
    e.preventDefault()
    setState("loading")
    setTimeout(() => {
      const o = loadOrder(Number(num.replace(/\D/g, "")))
      setState(o && digits(o.contact.phone) === digits(phone) ? o : "missing")
    }, 600)
  }

  const order = typeof state === "object" ? state : null
  const stages = order
    ? [
      ["Order received", new Date(order.date).toLocaleDateString("en-PK", { day: "numeric", month: "short" })],
      [order.payment === "bank" ? "Payment confirmed" : order.payment === "cod" ? "Confirmed on WhatsApp" : "BaadMay approved", "Pending"],
      [order.delivery === "pickup" ? "Ready for pickup" : "Dispatched", "Pending"],
      [order.delivery === "pickup" ? "Collected" : "Delivered", "Pending"],
    ]
    : []

  return (
    <div className="mx-auto max-w-xl px-4 pt-8 pb-28 md:pt-14">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand"><PackageSearch className="size-7" /></span>
      <h1 className="mt-5 text-[32px] leading-tight font-bold md:text-[44px]">Track your order</h1>
      <p className="mt-2 text-muted-foreground">Enter the order number from your confirmation email and the mobile number you ordered with.</p>

      <form onSubmit={find} className="mt-7 grid gap-4 rounded-2xl border bg-white p-5 md:p-6">
        <div className="grid gap-1.5"><Label htmlFor="order" className="text-[13px] font-bold">Order number</Label><Input id="order" required inputMode="numeric" placeholder="e.g. 8652" value={num} onChange={e => setNum(e.target.value)} className="h-12 rounded-xl" /></div>
        <div className="grid gap-1.5"><Label htmlFor="tphone" className="text-[13px] font-bold">Mobile number</Label><Input id="tphone" required type="tel" inputMode="tel" placeholder="03XX-XXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} className="h-12 rounded-xl" /></div>
        <Button type="submit" disabled={state === "loading"} className="h-12 rounded-xl text-[15px] font-bold">{state === "loading" ? <Loader2 className="animate-spin" /> : <Search />}Track order</Button>
      </form>

      {state === "missing" && (
        <div className="mt-5 rounded-2xl border bg-white p-5 text-[14.5px]">
          <b className="block">We couldn't find that order</b>
          <p className="mt-1 text-muted-foreground">Check the number in your confirmation email. Orders placed on another device can't be looked up here yet — message us and we'll tell you the status right away.</p>
          <a href={waLink(`Hi Fattani Computers, can you tell me the status of order #${num}?`)} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-4 font-bold text-[#073b1f]"><WhatsAppIcon className="size-4" />Ask on WhatsApp</a>
        </div>
      )}

      {order && (
        <div className="mt-5 rounded-2xl border bg-white p-5 md:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <b className="text-lg">Order #{order.id}</b>
            <b className="num">{fmt(order.total)}</b>
          </div>
          <p className="text-sm text-muted-foreground">{order.lines.map(l => `${l.model} × ${l.qty}`).join(", ")}</p>
          <ol className="mt-5 grid gap-0">
            {stages.map(([t, d], k) => (
              <li key={t} className="relative flex gap-3 pb-5 last:pb-0">
                {k < stages.length - 1 && <span className={cn("absolute top-7 bottom-0 left-[13px] w-0.5", k === 0 ? "bg-ok/40" : "bg-border")} />}
                <span className={cn("grid size-7 shrink-0 place-items-center rounded-full", k === 0 ? "bg-ok text-white" : "bg-paper ring-1 ring-border")}>{k === 0 && <Check className="size-4" strokeWidth={3} />}</span>
                <div className="flex flex-1 items-baseline justify-between gap-3 pt-0.5"><b className={cn("text-[14.5px]", k > 0 && "font-semibold text-muted-foreground")}>{t}</b><span className="text-xs text-muted-foreground">{d}</span></div>
              </li>
            ))}
          </ol>
          <p className="mt-5 rounded-xl bg-paper p-3 text-[13px] text-muted-foreground">We'll update you on WhatsApp ({order.contact.phone}) and by email at each step. Questions? Call {PHONE.sales}.</p>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">Looking for something new? <Link to="/shop" className="font-bold text-brand hover:underline">Browse laptops</Link></p>
    </div>
  )
}
