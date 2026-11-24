"use client"

import { useMemo, useRef, useState } from "react"
import { Link, Navigate, useNavigate } from "@/lib/router"
import { Banknote, ChevronDown, CreditCard, Gift, Landmark, Lock, PackageCheck, ShieldCheck, Store, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckoutSteps } from "@/views/cart"
import { JUST_PLACED } from "@/views/order-received"
import { byId, fmt, specChips } from "@/lib/products"
import { COD_FEE_RATE, SHIPPING_FLAT, saveOrder, useStore, type Address, type Order } from "@/lib/store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Img } from "@/components/img"

const PROVINCES = ["Sindh", "Punjab", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Kashmir"]
const emptyAddress: Address = { first: "", last: "", company: "", street: "", apt: "", city: "", province: "Sindh", postcode: "" }

function Section({ n, title, sub, children }: { n: number; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border bg-white p-5 md:p-7">
      <header className="mb-5 flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink font-mono text-sm font-semibold text-white">{n}</span>
        <div><h2 className="text-xl font-bold">{title}</h2>{sub && <p className="text-sm text-muted-foreground">{sub}</p>}</div>
      </header>
      {children}
    </section>
  )
}

function Field({ id, label, error, optional, className, children }: { id: string; label: string; error?: string; optional?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={id} className="text-[13px] font-bold">{label}{optional ? <span className="font-medium text-muted-foreground"> (optional)</span> : <span className="text-deal"> *</span>}</Label>
      {children}
      {error && <p id={`${id}-err`} className="text-xs font-semibold text-destructive">{error}</p>}
    </div>
  )
}

function ChoiceCard({ value, current, icon: Icon, title, sub, extra }: { value: string; current: string; icon: typeof Truck; title: string; sub: string; extra: string }) {
  return (
    <Label className={cn("flex cursor-pointer items-start gap-3 rounded-2xl border bg-white p-4 transition", current === value ? "border-ink ring-2 ring-ink/10" : "hover:border-ink/40")}>
      <RadioGroupItem value={value} className="mt-1" />
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand"><Icon className="size-5" /></span>
      <span className="min-w-0 flex-1"><b className="block text-[15px]">{title}</b><span className="text-[13px] leading-snug font-medium text-muted-foreground">{sub}</span></span>
      <b className={cn("num shrink-0 text-sm", extra === "Free" || extra === "No fee" ? "text-ok" : "")}>{extra}</b>
    </Label>
  )
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore()
  const nav = useNavigate()
  const [delivery, setDelivery] = useState<Order["delivery"]>("ship")
  const [payment, setPayment] = useState<Order["payment"]>("bank")
  const [contact, setContact] = useState({ phone: "", email: "" })
  const [addr, setAddr] = useState<Address>(emptyAddress)
  const [shipElsewhere, setShipElsewhere] = useState(false)
  const [ship, setShip] = useState<Address>(emptyAddress)
  const [notes, setNotes] = useState("")
  const [terms, setTerms] = useState(false)
  const [offers, setOffers] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [placing, setPlacing] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const shipping = delivery === "ship" ? SHIPPING_FLAT : 0
  const fee = payment === "cod" ? Math.round((cartTotal + shipping) * COD_FEE_RATE) : 0
  const total = cartTotal + shipping + fee
  const lines = useMemo(() => cart.map(l => ({ l, p: byId.get(l.id)! })), [cart])

  if (!cart.length && !placing) return <Navigate to="/cart" replace />

  const validate = () => {
    const e: Record<string, string> = {}
    if (!/^(\+92|0)3\d{2}[- ]?\d{7}$/.test(contact.phone.replace(/\s/g, ""))) e.phone = "Enter a mobile number like 0321-8248070"
    if (!/^\S+@\S+\.\S+$/.test(contact.email)) e.email = "Enter a valid email address"
    if (!addr.first.trim()) e.first = "Required"
    if (!addr.last.trim()) e.last = "Required"
    if (delivery === "ship") {
      if (!addr.street.trim()) e.street = "Enter your house number and street"
      if (!addr.city.trim()) e.city = "Required"
      if (shipElsewhere) {
        if (!ship.first.trim()) e.s_first = "Required"
        if (!ship.street.trim()) e.s_street = "Required"
        if (!ship.city.trim()) e.s_city = "Required"
      }
    }
    if (!terms) e.terms = "Please accept the terms and conditions"
    return e
  }

  const place = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      toast.error("Please check the highlighted fields")
      const first = formRef.current?.querySelector<HTMLElement>(`#${Object.keys(e)[0]}`)
      first?.scrollIntoView({ behavior: "smooth", block: "center" }); first?.focus({ preventScroll: true })
      return
    }
    setPlacing(true)
    const order: Order = {
      id: 8653 + Math.floor(Math.random() * 300), date: new Date().toISOString(),
      lines: lines.map(({ l, p }) => ({ id: p.id, model: p.model, image: p.images[0], spec: specChips(p).join(" · "), qty: l.qty, price: p.price, warranty: l.warranty })),
      subtotal: cartTotal, shipping, fee, total, payment, delivery, contact, billing: addr,
      shippingAddress: delivery === "ship" ? (shipElsewhere ? ship : addr) : null, notes,
    }
    saveOrder(order)
    try { sessionStorage.setItem(JUST_PLACED, String(order.id)) } catch { /* ignore */ }
    setTimeout(() => { clearCart(); nav(`/order-received/${order.id}`, { replace: true, viewTransition: true }) }, 700)
  }

  const input = (k: string) => cn("h-11 rounded-xl bg-white", errors[k] && "border-destructive ring-3 ring-destructive/15")
  const AddressFields = ({ a, set, prefix = "" }: { a: Address; set: (a: Address) => void; prefix?: string }) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field id={`${prefix}first`} label="First name" error={errors[`${prefix}first`]}><Input id={`${prefix}first`} autoComplete="given-name" value={a.first} onChange={e => set({ ...a, first: e.target.value })} className={input(`${prefix}first`)} /></Field>
      <Field id={`${prefix}last`} label="Last name" error={errors[`${prefix}last`]}><Input id={`${prefix}last`} autoComplete="family-name" value={a.last} onChange={e => set({ ...a, last: e.target.value })} className={input(`${prefix}last`)} /></Field>
      <Field id={`${prefix}company`} label="Company name" optional className="sm:col-span-2"><Input id={`${prefix}company`} autoComplete="organization" value={a.company} onChange={e => set({ ...a, company: e.target.value })} className={input("")} placeholder="For a company invoice with NTN" /></Field>
      {delivery === "ship" && <>
        <Field id={`${prefix}street`} label="Street address" error={errors[`${prefix}street`]} className="sm:col-span-2"><Input id={`${prefix}street`} autoComplete="address-line1" placeholder="House number and street name" value={a.street} onChange={e => set({ ...a, street: e.target.value })} className={input(`${prefix}street`)} /></Field>
        <Field id={`${prefix}apt`} label="Apartment, suite, block" optional className="sm:col-span-2"><Input id={`${prefix}apt`} autoComplete="address-line2" value={a.apt} onChange={e => set({ ...a, apt: e.target.value })} className={input("")} /></Field>
        <Field id={`${prefix}city`} label="Town / City" error={errors[`${prefix}city`]}><Input id={`${prefix}city`} autoComplete="address-level2" placeholder="Karachi" value={a.city} onChange={e => set({ ...a, city: e.target.value })} className={input(`${prefix}city`)} /></Field>
        <Field id={`${prefix}province`} label="Province">
          <Select value={a.province} onValueChange={(v: string | null) => v && set({ ...a, province: v })}>
            <SelectTrigger aria-label="Province" id={`${prefix}province`} className="h-11 w-full rounded-xl bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>{PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field id={`${prefix}postcode`} label="Postcode" optional><Input id={`${prefix}postcode`} autoComplete="postal-code" inputMode="numeric" value={a.postcode} onChange={e => set({ ...a, postcode: e.target.value })} className={input("")} /></Field>
      </>}
    </div>
  )

  const Summary = () => (
    <>
      <ul className="grid grid-cols-1 gap-3">
        {lines.map(({ l, p }) => (
          <li key={l.id} className="flex gap-3">
            <span className="relative grid size-16 shrink-0 place-items-center rounded-xl border bg-white p-1.5"><Img src={p.images[0]} alt="" className="max-h-full mix-blend-multiply" /><span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-ink text-[10.5px] font-bold text-white">{l.qty}</span></span>
            <div className="min-w-0 flex-1">
              <b className="line-clamp-1 text-sm">{p.model}</b>
              <span className="block truncate font-mono text-[10.5px] text-muted-foreground">{specChips(p).slice(0, 3).join(" · ")}</span>
              <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-brand"><ShieldCheck className="size-3" />{l.warranty.label}</span>
            </div>
            <b className="num text-sm">{fmt((p.price + l.warranty.price) * l.qty)}</b>
          </li>
        ))}
      </ul>
      <dl className="mt-5 grid gap-2.5 border-t pt-4 text-[14px]">
        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="num font-bold">{fmt(cartTotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className={cn("num font-bold", !shipping && "text-ok")}>{shipping ? `${fmt(shipping)} · flat rate` : "Free · store pickup"}</dd></div>
        {fee > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">COD handling (4%)</dt><dd className="num font-bold">{fmt(fee)}</dd></div>}
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t pt-4"><span className="font-bold">Total</span><b className="num font-heading text-3xl">{fmt(total)}</b></div>
      {payment === "baadmay" ? <p className="mt-1 text-xs font-semibold text-[#6B2BD9]">3 payments of {fmt(Math.ceil(total / 3))} with BaadMay</p> : <p className="mt-1 text-xs text-muted-foreground">Or 3 installments of {fmt(Math.ceil(total / 3))} with BaadMay</p>}
      <p className="mt-4 flex items-center gap-2 rounded-xl bg-gold/15 p-3 text-xs font-semibold text-[#6b4f00]"><Gift className="size-4 shrink-0" />Have Fattani Rewards points? <a href="#" className="underline">Sign in</a> to use them on this order.</p>
    </>
  )

  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-6 pb-36 md:px-6 md:pt-10 md:pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><Link to="/cart" className="text-sm font-bold text-brand hover:underline">← Back to cart</Link><h1 className="mt-2 text-[34px] leading-none font-bold md:text-5xl">Checkout</h1></div>
        <CheckoutSteps step={2} />
      </div>

      {/* Mobile: collapsible summary, like a native checkout */}
      <div className="mt-6 overflow-hidden rounded-2xl border bg-white lg:hidden">
        <button type="button" onClick={() => setSummaryOpen(o => !o)} className="flex w-full items-center justify-between p-4 text-left">
          <span className="flex items-center gap-2 text-sm font-bold text-brand">{summaryOpen ? "Hide" : "Show"} order summary<ChevronDown className={cn("size-4 transition", summaryOpen && "rotate-180")} /></span>
          <b className="num font-heading text-lg">{fmt(total)}</b>
        </button>
        {summaryOpen && <div className="border-t p-4">{Summary()}</div>}
      </div>

      <form ref={formRef} onSubmit={place} noValidate className="mt-6 grid items-start gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-4">
          <Section n={1} title="Contact" sub="We'll send order updates on WhatsApp and email.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="phone" label="Mobile number" error={errors.phone}><Input id="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="03XX-XXXXXXX" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} className={input("phone")} aria-invalid={!!errors.phone} /></Field>
              <Field id="email" label="Email address" error={errors.email}><Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} className={input("email")} aria-invalid={!!errors.email} /></Field>
            </div>
          </Section>

          <Section n={2} title="Delivery">
            <RadioGroup value={delivery} onValueChange={(v: unknown) => setDelivery(v as Order["delivery"])} className="mb-6 grid gap-2 sm:grid-cols-2">
              <ChoiceCard value="ship" current={delivery} icon={Truck} title="Deliver to my address" sub="Across Pakistan · 2–4 working days" extra={fmt(SHIPPING_FLAT)} />
              <ChoiceCard value="pickup" current={delivery} icon={Store} title="Pick up in store" sub="GD-18, Techno City Mall, Karachi" extra="Free" />
            </RadioGroup>
            {AddressFields({ a: addr, set: setAddr })}
            {delivery === "ship" && (
              <>
                <Label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm font-semibold"><Checkbox checked={shipElsewhere} onCheckedChange={(v: boolean) => setShipElsewhere(v)} />Ship to a different address?</Label>
                {shipElsewhere && <div className="mt-5 rounded-2xl bg-paper p-4">{AddressFields({ a: ship, set: setShip, prefix: "s_" })}</div>}
              </>
            )}
          </Section>

          <Section n={3} title="Payment" sub="All transactions are secure. Choose how you'd like to pay.">
            <RadioGroup value={payment} onValueChange={(v: unknown) => setPayment(v as Order["payment"])} className="grid gap-2">
              <ChoiceCard value="bank" current={payment} icon={Landmark} title="Advance payment (bank transfer)" sub="Pay in full by bank transfer — we send our bank details on WhatsApp (0326-5900042). Your order is confirmed once payment is received." extra="No fee" />
              <ChoiceCard value="cod" current={payment} icon={Banknote} title="Cash on delivery" sub="Pay the courier when your laptop arrives." extra="+4%" />
              <ChoiceCard value="baadmay" current={payment} icon={CreditCard} title="BaadMay — pay in 3 installments" sub={`3 interest-free payments of ${fmt(Math.ceil(total / 3))}.`} extra="0% interest" />
            </RadioGroup>
          </Section>

          <Section n={4} title="Additional information">
            <Field id="notes" label="Order notes" optional><Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes about your order, e.g. special notes for delivery." className="min-h-24 rounded-xl bg-white" /></Field>
            <div className="mt-5 grid gap-3 text-sm">
              <Label className="flex cursor-pointer items-start gap-2.5 font-semibold"><Checkbox id="terms" checked={terms} onCheckedChange={(v: boolean) => setTerms(v)} aria-invalid={!!errors.terms} className="mt-0.5" /><span>I have read and agree to the website <a href="#" className="text-brand underline">terms and conditions</a> <span className="text-deal">*</span></span></Label>
              {errors.terms && <p className="-mt-1 text-xs font-semibold text-destructive">{errors.terms}</p>}
              <Label className="flex cursor-pointer items-start gap-2.5 font-medium text-muted-foreground"><Checkbox checked={offers} onCheckedChange={(v: boolean) => setOffers(v)} className="mt-0.5" />Send me offers and news from Fattani Computers. You can unsubscribe any time.</Label>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Your personal data will be used to process your order and support your experience, as described in our privacy policy.</p>
          </Section>
        </div>

        <aside className="hidden rounded-[24px] border bg-white p-6 lg:sticky lg:top-[160px] lg:block">
          <h2 className="mb-4 text-xl font-bold">Your order</h2>
          {Summary()}
          <Button type="submit" disabled={placing} className="mt-5 h-13 w-full rounded-xl text-[15px] font-bold">{placing ? <><PackageCheck className="animate-bounce" />Placing order…</> : <><Lock />Place order · <span className="num">{fmt(total)}</span></>}</Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground"><ShieldCheck className="size-3.5 text-ok" />Secure checkout · 7-day cashback</p>
        </aside>

        {/* Mobile sticky place-order bar (tab bar is hidden on checkout) */}
        <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-3 backdrop-blur-xl lg:hidden">
          <Button type="submit" disabled={placing} className="h-13 w-full rounded-xl text-[15px] font-bold">{placing ? "Placing order…" : <><Lock />Place order · <span className="num">{fmt(total)}</span></>}</Button>
        </div>
      </form>
    </div>
  )
}
