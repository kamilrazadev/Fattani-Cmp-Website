import Link from "next/link"
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Building2, Clock, CreditCard, Gift, MapPin,
  Phone, QrCode, Quote, RotateCcw, ShieldCheck, Star, Truck, Wrench, Router,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { BrandMark, GoogleG, WhatsAppIcon } from "@/components/logos"
import { Counter, Reveal } from "@/components/motion"
import { Marquee } from "@/components/marquee"
import { Img } from "@/components/img"
import { BRANDS, USE_CASES, type Product } from "@/lib/catalog-core"
import { HOME_COLLECTIONS, PRODUCTS } from "@/lib/products"
import { CLIENTS, FAQ, IMG, LOCATIONS, REVIEWS, waLink } from "@/lib/site"
import { cn } from "@/lib/utils"
import { DealCard, HeroStage, NewsletterForm, ProductBento, SectionHead } from "@/views/home-client"

const find = (re: RegExp, f: (p: Product) => boolean = () => true) => PRODUCTS.find(p => re.test(p.model) && f(p) && p.inStock) ?? PRODUCTS[0]

function CorporateCard() {
  return (
    <a href="#corporate" className="group relative isolate flex min-h-[150px] overflow-hidden rounded-[24px] bg-brand p-5 text-white">
      <div className="tx-grid absolute inset-0 -z-10 text-white/70 [mask-image:radial-gradient(110%_100%_at_100%_100%,#000,transparent_70%)]" />
      <div className="tx-grain absolute inset-0 -z-10" />
      {/* line-drawn office skyline */}
      <svg viewBox="0 0 200 120" className="absolute -right-3 -bottom-2 -z-10 w-44 text-white/20 transition duration-700 group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="20" y="40" width="44" height="80" /><rect x="70" y="10" width="56" height="110" /><rect x="132" y="56" width="48" height="64" />
        {Array.from({ length: 6 }).map((_, r) => [0, 1].map(c => <rect key={`${r}${c}`} x={80 + c * 22} y={20 + r * 16} width="12" height="8" />))}
        {Array.from({ length: 4 }).map((_, r) => <rect key={r} x={30} y={50 + r * 16} width="24" height="7" />)}
        {Array.from({ length: 3 }).map((_, r) => <rect key={r} x={142} y={66 + r * 16} width="28" height="7" />)}
      </svg>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-white/12 ring-1 ring-white/20"><Building2 className="size-[18px]" /></span>
          <span className="flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-bold ring-1 ring-white/20"><Clock className="size-3" />Reply in 1 hr</span>
        </div>
        <h2 className="mt-auto pt-3 text-[21px] leading-[1.1] font-bold">Corporate quote in<br />one working hour</h2>
        <p className="mt-1 text-[13px] text-white/75">Bulk laptops · networking · office setup</p>
      </div>
      <span className="grid size-10 shrink-0 place-items-center self-end rounded-full bg-white text-ink transition group-hover:rotate-[-45deg]"><ArrowRight className="size-4" /></span>
    </a>
  )
}

function RewardsCard() {
  return (
    <a href="#rewards" className="group relative isolate flex min-h-[150px] overflow-hidden rounded-[24px] bg-gold p-5 text-ink">
      <div className="tx-dots absolute inset-0 -z-10 text-ink/60 [mask-image:linear-gradient(250deg,#000_15%,transparent_60%)]" />
      <div className="tx-grain absolute inset-0 -z-10" />
      {/* mini loyalty card */}
      <div className="absolute -top-4 right-3 w-32 rotate-[10deg] rounded-xl bg-ink p-3 text-white sm:w-36 shadow-[0_20px_30px_-14px_rgba(0,0,0,.55)] transition duration-500 group-hover:rotate-[5deg] group-hover:-translate-y-1">
        <div className="flex items-center justify-between"><span className="eyebrow !text-[8px] text-gold">Rewards</span><Gift className="size-3.5 text-gold" /></div>
        <div className="mt-2 h-4 w-6 rounded bg-[linear-gradient(135deg,#f6d27a,#c9962a)] max-sm:hidden" />
        <b className="num mt-2 block font-mono text-[15px]">1,050 pts</b>
        <span className="font-mono text-[8.5px] tracking-[.2em] text-white/50">•••• 1997</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="grid size-9 place-items-center rounded-lg bg-ink/8 ring-1 ring-ink/10"><Gift className="size-[18px]" /></span>
        <h2 className="mt-auto pt-3 text-[21px] leading-[1.1] font-bold">Fattani Rewards</h2>
        <p className="mt-1 max-w-[30ch] text-[13px] text-ink/75">1 point per Rs 100 — even on past invoices</p>
      </div>
      <span className="relative z-10 grid size-10 shrink-0 place-items-center self-end rounded-full bg-ink text-white ring-4 ring-gold transition group-hover:rotate-[-45deg]"><ArrowRight className="size-4" /></span>
    </a>
  )
}


function Hero() {
  const products = {
    dell: find(/dell/i, p => p.condition === "new"),
    gaming: find(/legion|victus|predator|tuf/i, p => p.type === "gaming" && /50\d0/.test(p.gpuShort)),
    certified: PRODUCTS.find(p => p.condition === "certified" && p.gen >= 12) ?? PRODUCTS[0],
  }
  const deal = [...PRODUCTS].filter(p => p.inStock && p.was).sort((a, b) => (b.was - b.price) / b.was - (a.was - a.price) / a.was)[0] ?? PRODUCTS[0]
  return (
    <section aria-label="Featured offers" className="mx-auto max-w-[1320px] px-3 pt-3 md:px-6 md:pt-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <HeroStage products={products} />
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:flex lg:flex-col">
          <div className="min-w-0 sm:col-span-2 lg:flex-1 [&>div]:h-full"><DealCard deal={deal} /></div>
          <CorporateCard />
          <RewardsCard />
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────── STATS ───────────────────────────── */
function Stats() {
  const items = [
    { to: 28, suffix: "", label: "Years in the IT trade", sub: "Serving Pakistan since 1997" },
    { to: PRODUCTS.length, suffix: "+", label: "Laptops in stock", sub: "New, certified & tested used" },
    { to: 60, suffix: "+", label: "Corporate clients", sub: "Schools, NGOs, offices & retail" },
    { to: 3, suffix: "", label: "Locations", sub: "Saddar · Techno City · New York" },
  ]
  return (
    <section className="mx-auto max-w-[1320px] px-3 pt-4 md:px-6">
      <div className="grid grid-cols-2 overflow-hidden rounded-[24px] border bg-white lg:grid-cols-4">
        {items.map((it, k) => (
          <div key={it.label} className={cn("relative p-5 md:p-7", k % 2 === 1 && "border-l", k >= 2 && "max-lg:border-t", k === 2 && "lg:border-l", k === 3 && "lg:border-l")}>
            <span className="eyebrow text-muted-foreground">0{k + 1}</span>
            <div className="mt-3 font-heading text-[44px] leading-none font-bold tracking-tight md:text-[56px]">
              <Counter to={it.to} suffix={it.suffix} />
            </div>
            <b className="mt-2 block text-[15px]">{it.label}</b>
            <span className="text-[13px] text-muted-foreground">{it.sub}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────────── PROMISES ───────────────────────────── */
const PROMISES = [
  { icon: Truck, title: "Delivery across Pakistan", sub: "Flat Rs 1,500 per order", detail: "Free pickup at Techno City Mall" },
  { icon: ShieldCheck, title: "Up to 1 year warranty", sub: "3 months on every used laptop", detail: "Extend at checkout · digital card" },
  { icon: RotateCcw, title: "7-day cashback", sub: "If a fault appears", detail: "Return it for your money back" },
  { icon: CreditCard, title: "Pay in 3 installments", sub: "Interest-free with BaadMay", detail: "Card, bank, JazzCash, Easypaisa" },
  { icon: Wrench, title: "Technician tested", sub: "Before it reaches you", detail: "Configured & ready to use" },
]
function Promises() {
  return (
    <section className="mx-auto max-w-[1320px] px-3 pt-4 md:px-6">
      <div className="relative overflow-hidden rounded-[24px] bg-ink text-white">
        <div className="tx-grid pointer-events-none absolute inset-0 text-white/30 [mask-image:linear-gradient(90deg,transparent,#000_30%,#000_70%,transparent)]" />
        <ul className="no-scrollbar relative flex snap-x snap-mandatory overflow-x-auto lg:grid lg:grid-cols-5">
          {PROMISES.map((p, k) => (
            <li key={p.title} className={cn("group w-[72%] shrink-0 snap-start p-6 sm:w-[44%] lg:w-auto", k > 0 && "border-l border-white/10")}>
              <span className="grid size-12 place-items-center rounded-2xl bg-white/[.07] text-sky ring-1 ring-white/10 transition duration-300 group-hover:-translate-y-1 group-hover:bg-sky group-hover:text-ink">
                <p.icon className="size-[22px]" strokeWidth={1.8} />
              </span>
              <b className="mt-5 block text-[16px]">{p.title}</b>
              <span className="block text-[13.5px] text-white/65">{p.sub}</span>
              <span className="mt-3 block border-t border-dashed border-white/15 pt-3 font-mono text-[11px] text-white/45">{p.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────────────────────────── CATEGORIES ───────────────────────────── */
const CATS = [
  { label: "Brand new", sub: "Latest models · 1 yr intl warranty", to: "/shop?cond=new", f: (p: Product) => p.condition === "new" && p.type === "business", bg: "bg-[#e7f0fb]" },
  { label: "Used business", sub: "ThinkPad, Latitude, EliteBook", to: "/shop?cond=used", f: (p: Product) => p.condition === "used", bg: "bg-brand-50" },
  { label: "Certified used", sub: "1 year Fattani warranty", to: "/shop?cond=certified", f: (p: Product) => p.condition === "certified", bg: "bg-[#eaf6ef]" },
  { label: "Gaming", sub: "RTX 40 & 50-series", to: "/shop?type=gaming", f: (p: Product) => p.type === "gaming" && p.condition === "new", bg: "bg-[#eceaf6]" },
  { label: "MacBook", sub: "Air & Pro, Apple silicon", to: "/shop?type=macbook", f: (p: Product) => p.type === "macbook", bg: "bg-[#f3f1ed]" },
  { label: "Chromebook", sub: "Made for classrooms", to: "/shop?type=chromebook", f: (p: Product) => p.type === "chromebook", bg: "bg-[#fdf3dc]" },
]

function Categories() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 pt-20 md:px-6 md:pt-28">
      <SectionHead eyebrow="Browse" title="Find your next laptop." sub="Over 360 laptops from the brands businesses trust, sorted the way you shop." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {CATS.map((c, k) => {
          const list = PRODUCTS.filter(c.f)
          const img = list.find(p => p.inStock)?.images[0]
          return (
            <Reveal key={c.label} delay={k * 60} className={cn(k < 2 && "lg:col-span-2")}>
              <Link href={c.to} className={cn("group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-[22px] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(10,26,34,.35)] md:p-5", c.bg, k < 2 && "lg:min-h-[320px]")}>
                <div className="relative z-10 flex items-start justify-between gap-2">
                  <div>
                    <b className={cn("block font-heading leading-tight", k < 2 ? "text-xl md:text-[28px]" : "text-lg")}>{c.label}</b>
                    <span className="mt-0.5 block text-xs font-semibold text-ink-2/70 md:text-[13px]">{c.sub}</span>
                  </div>
                  <span className="num shrink-0 rounded-full bg-white px-2.5 py-1 font-mono text-[11px] font-semibold shadow-sm">{list.length}</span>
                </div>
                <div className="relative mt-auto flex items-end justify-center pt-4">
                  <Img src={img ?? ""} alt="" loading="lazy" className={cn("relative object-contain mix-blend-multiply transition duration-700 group-hover:scale-[1.07]", k < 2 ? "h-40 w-auto md:h-52" : "h-28 w-auto md:h-32")} />
                </div>
                <span className="absolute bottom-4 left-4 z-10 grid size-9 place-items-center rounded-full bg-ink text-white opacity-0 transition duration-300 group-hover:opacity-100 max-md:hidden"><ArrowRight className="size-4" /></span>
              </Link>
            </Reveal>
          )
        })}
      </div>

      {/* Brand logos: large, coloured, no box */}
      <Reveal className="mt-10">
        <Marquee duration={36} gap={72}>
          {[...BRANDS, ...BRANDS].map((b, k) => (
            <Link key={b + k} href={`/shop?brand=${b}`} aria-label={`${b} laptops`} className="group flex h-20 shrink-0 items-center">
              <Img src={`/brands/${b.toLowerCase()}.svg`} alt="" width={56} height={56} unoptimized className="size-12 transition duration-300 group-hover:scale-110 md:size-14" />
            </Link>
          ))}
        </Marquee>
      </Reveal>
    </section>
  )
}

function ProductBentoSection() {
  const stack = [find(/legion|victus/i), find(/thinkpad t14/i), find(/macbook air/i)]
  const counts = (["new", "used", "certified"] as const).map(c => [c, PRODUCTS.filter(p => p.condition === c).length] as const)
  return <ProductBento collections={HOME_COLLECTIONS} stack={stack} counts={counts} total={PRODUCTS.length} />
}

/* ───────────────────────────── FINDER ───────────────────────────── */
const FINDER_PICS: Record<string, Product | undefined> = {
  study: PRODUCTS.find(p => p.inStock && p.type === "chromebook"),
  office: PRODUCTS.find(p => p.inStock && /latitude 54|latitude 55/i.test(p.model)),
  code: PRODUCTS.find(p => p.inStock && /thinkpad t14/i.test(p.model)),
  design: PRODUCTS.find(p => p.inStock && /zbook/i.test(p.model)),
  gaming: PRODUCTS.find(p => p.inStock && /legion|tuf|predator/i.test(p.model)),
  travel: PRODUCTS.find(p => p.inStock && /macbook air/i.test(p.model)),
}
function Finder() {
  return (
    <section id="finder" className="mx-auto max-w-[1320px] scroll-mt-32 px-4 pt-20 md:px-6 md:pt-28">
      <Reveal>
        <div className="grid overflow-hidden rounded-[28px] border bg-white lg:grid-cols-[400px_1fr]">
          <div className="relative isolate flex min-h-[260px] flex-col justify-end p-7 text-white md:p-9">
            <Img src={IMG.storeStaff} alt="Fattani team helping a customer choose a laptop" className="absolute inset-0 -z-10 size-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,18,25,.1),rgba(7,18,25,.9))]" />
            <span className="eyebrow text-sky">Laptop finder</span>
            <h2 className="mt-2 text-[32px] leading-[1.02] font-bold md:text-[40px]">What will you use it for?</h2>
            <p className="mt-3 text-white/75">Pick a purpose — we'll show laptops with the right processor, memory and graphics.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:p-6">
            {USE_CASES.map(u => {
              const matches = PRODUCTS.filter(p => p.inStock && u.test(p))
              const pic = FINDER_PICS[u.id]?.images[0] ?? matches[0]?.images[0]
              return (
                <Link key={u.id} href={`/shop?use=${u.id}`} className="group relative flex min-h-44 flex-col overflow-hidden rounded-2xl bg-paper p-4 ring-1 ring-border transition hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:ring-brand/30">
                  <span className="relative z-10 flex items-center gap-2"><span className="grid size-9 place-items-center rounded-lg bg-white text-brand ring-1 ring-border transition group-hover:bg-brand group-hover:text-white"><u.icon className="size-[18px]" /></span><b className="text-[15px] leading-tight">{u.label}</b></span>
                  {pic && <Img src={pic} alt="" loading="lazy" className="absolute right-1 bottom-1 h-[52%] w-auto max-w-[62%] object-contain mix-blend-multiply transition duration-500 group-hover:scale-105 group-hover:-rotate-2" />}
                  <span className="num relative z-10 mt-auto w-fit rounded-full bg-white px-2 py-0.5 font-mono text-[11px] font-semibold shadow-sm">{matches.length} laptops</span>
                </Link>
              )
            })}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ───────────────────────────── SERVICES ───────────────────────────── */
const NET = "https://fattanicomputer.com/wp-content/uploads/2025/12/"
const NET_ITEMS = [
  { img: NET + "4-9.jpg", label: "PoE switches" },
  { img: NET + "1-7.jpg", label: "SFP modules & fiber" },
  { img: NET + "3-14.jpg", label: "Wi-Fi routers & APs" },
  { img: NET + "9-6.jpg", label: "Network racks" },
]

function Services() {
  const t14 = find(/thinkpad t14/i)
  return (
    <section id="services" className="mx-auto max-w-[1320px] scroll-mt-32 px-4 pt-20 md:px-6 md:pt-28">
      <SectionHead eyebrow="Why buy from Fattani" title="More than a laptop shop." sub="The after-sales service our customers keep writing about — now built into your account." />
      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="min-w-0 lg:col-span-7">
          <div id="rewards" className="relative isolate h-full min-h-[340px] scroll-mt-32 overflow-hidden rounded-[28px] bg-gold p-6 md:p-10">
            <div className="grid h-full gap-8 md:grid-cols-[1.2fr_1fr]">
              <div className="flex flex-col">
                <span className="eyebrow text-ink/60">Fattani Rewards</span>
                <h3 className="mt-3 text-[30px] leading-[1.03] font-bold md:text-4xl">Earn on every rupee. Even on old invoices.</h3>
                <p className="mt-3 text-ink/75">1 point for every Rs 100 you spend — including past shop invoices — to spend on your next purchase. Verified buyers earn 100 points for an approved review.</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  <Button className="h-12 rounded-full bg-ink px-6 font-bold text-white hover:bg-ink/85">Join free</Button>
                  <Button variant="outline" className="h-12 rounded-full border-ink/25 bg-transparent px-6 font-bold hover:bg-white/50">Claim an old invoice</Button>
                </div>
              </div>
              <div className="relative grid place-items-center">
                <div className="w-full max-w-[280px] rounded-[22px] bg-ink p-5 text-white shadow-[0_30px_50px_-20px_rgba(0,0,0,.5)] md:rotate-[4deg]">
                  <div className="flex items-center justify-between"><span className="eyebrow !text-[10px] text-gold">Your balance</span><Gift className="size-5 text-gold" /></div>
                  <b className="num mt-3 block font-heading text-5xl"><Counter to={1050} /> <small className="text-lg text-white/60">pts</small></b>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[70%] rounded-full bg-gold" /></div>
                  <span className="mt-2 block text-xs text-white/60">450 pts to your next Rs 1,500 reward</span>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
                    {[["Invoices", "6"], ["Reviews", "2"], ["Since", "2019"]].map(([k, v]) => <div key={k}><b className="num block font-mono">{v}</b><span className="text-[10px] text-white/50 uppercase">{k}</span></div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="min-w-0 lg:col-span-5" delay={80}>
          <div id="corporate" className="relative isolate flex h-full min-h-[340px] scroll-mt-32 flex-col overflow-hidden rounded-[28px] p-6 text-white md:p-10">
            <Img src={IMG.storeWide} alt="Laptops stocked for corporate orders" className="absolute inset-0 -z-10 size-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,rgba(22,105,129,.95)_20%,rgba(10,52,66,.88))]" />
            <span className="eyebrow text-white/70">Buying for your company?</span>
            <div className="mt-4 flex items-end gap-2 font-heading leading-none font-extrabold"><Counter to={60} className="text-[88px] tracking-[-0.05em] md:text-[96px]" /><span className="mb-3 text-2xl text-white/70">min</span></div>
            <p className="mt-2 max-w-[38ch] text-white/85">Laptops, networking equipment or a full office network setup. We reply within one working hour, Monday to Saturday, 12 PM to 8 PM.</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              <Button className="h-12 rounded-full bg-white px-6 font-bold text-ink hover:bg-sky">Get a quote</Button>
              <a href={waLink("Hi Fattani Computers, I'd like a corporate quote.")} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full px-5 font-bold ring-1 ring-white/40 hover:bg-white/10"><WhatsAppIcon className="size-4" />WhatsApp</a>
            </div>
          </div>
        </Reveal>

        <Reveal className="min-w-0 lg:col-span-5">
          <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border bg-white p-6 md:p-10">
            <span className="eyebrow text-brand">Digital warranty card</span>
            <h3 className="mt-3 text-3xl leading-tight font-bold">Your warranty lives in your account.</h3>
            <p className="mt-3 text-muted-foreground">Every machine gets a warranty card with a QR code and online claims. No paper slip to lose.</p>
            <div className="relative mt-6 grid place-items-center rounded-2xl bg-paper p-4 pb-16">
              <Img src={t14.images[0]} alt={t14.model} loading="lazy" className="h-36 object-contain mix-blend-multiply" />
              <div className="absolute inset-x-4 -bottom-0 flex translate-y-4 items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_16px_30px_-16px_rgba(10,26,34,.4)] ring-1 ring-border">
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-paper ring-1 ring-border"><QrCode className="size-8" strokeWidth={1.4} /></span>
                <div className="min-w-0"><b className="block truncate text-sm">{t14.model}</b><span className="font-mono text-[11px] text-muted-foreground">FC-2026-04817</span><span className="flex items-center gap-1 text-xs font-bold text-ok"><BadgeCheck className="size-3.5" />Covered until Nov 2027</span></div>
              </div>
            </div>
            <Button variant="outline" className="mt-10 h-12 w-fit rounded-full px-6 font-bold">Check my warranty</Button>
          </div>
        </Reveal>

        <Reveal className="min-w-0 lg:col-span-7" delay={80}>
          <div id="networking" className="relative isolate h-full scroll-mt-32 overflow-hidden rounded-[28px] bg-ink p-6 text-white md:p-10">
            <span className="eyebrow text-sky">Networking & office setup</span>
            <h3 className="mt-3 max-w-[20ch] text-3xl leading-tight font-bold">From one switch to a full office network.</h3>
            <p className="mt-3 max-w-[46ch] text-white/70">120+ networking products in stock, plus installation by our team for offices across Karachi.</p>
            <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {NET_ITEMS.map(n => (
                <li key={n.label} className="group overflow-hidden rounded-2xl bg-white text-ink">
                  <div className="grid aspect-square place-items-center p-3"><Img src={n.img} alt={n.label} loading="lazy" className="max-h-full object-contain transition duration-500 group-hover:scale-110" /></div>
                  <b className="block border-t px-3 py-2 text-[12.5px] leading-tight">{n.label}</b>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button className="h-12 rounded-full bg-white px-6 font-bold text-ink hover:bg-sky">Shop networking</Button>
              <Button variant="outline" className="h-12 rounded-full border-white/25 bg-transparent px-6 font-bold text-white hover:bg-white/10 hover:text-white"><Router className="size-4" />Book a site survey</Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────────── CLIENTS ───────────────────────────── */
const CLIENT_NAMES: Record<string, string> = {
  woodwards: "Woodwards", Sogo: "Sogo", Saylani: "Saylani Welfare", IdeaFuzion: "IdeaFuzion", Beaconhouse: "Beaconhouse",
  Reon: "Reon Energy", Tribe: "Tribe Consulting", Ideas: "Ideas", NKR: "NKR Engineering", telemart: "Telemart", creditfix: "Creditfix",
  hive: "The Hive", "wave tech": "Wave Tech", skyia: "Skyia", "ossha tech": "Ossha Tech", alkhidmat: "Alkhidmat Foundation",
  "muslilm gymkhana": "Muslim Gymkhana", fyberbeam: "Fiber Beam", denima: "Denima", narkins: "Narkin's", highfy: "Highfy",
  ashtex: "Ashtex", hotnspicy: "Hot n Spicy", "hs logistics": "HS Logistics", galceris: "Glaciers",
}
const SECTORS = ["Schools & education", "Welfare foundations", "Retail & e-commerce", "Energy & engineering", "Software & ISPs", "Logistics & food"]

function ClientLogo({ c }: { c: (typeof CLIENTS)[number] }) {
  const name = CLIENT_NAMES[c.name] ?? c.name
  return (
    <figure className="group/logo relative flex h-24 w-40 shrink-0 items-center justify-center md:h-28 md:w-48">
      <Img src={c.src} alt={name} width={c.w} height={c.h} unoptimized loading="lazy" decoding="async" className="h-auto max-h-14 w-auto max-w-[8.5rem] object-contain opacity-90 transition duration-300 group-hover/logo:scale-105 group-hover/logo:opacity-100 md:max-h-16 md:max-w-40" />
      <figcaption className="pointer-events-none absolute bottom-0 text-xs font-bold whitespace-nowrap text-brand opacity-0 transition duration-300 group-hover/logo:opacity-100">{name}</figcaption>
    </figure>
  )
}

function Clients() {
  const half = Math.ceil(CLIENTS.length / 2)
  return (
    <section className="pt-20 md:pt-28">
      <div className="mx-auto max-w-[1320px] px-4 md:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow flex items-center gap-2.5 text-brand"><span className="h-0.5 w-6 rounded bg-current" />Corporate clients</span>
            <h2 className="mt-3 text-[34px] leading-[1.02] font-bold md:text-5xl">Trusted by <Counter to={60} suffix="+" className="text-brand" /> companies.</h2>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {SECTORS.map(s => <li key={s} className="rounded-full border bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink-2">{s}</li>)}
            </ul>
          </div>
          <a href="#corporate" className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white transition hover:bg-brand">Become a corporate client <ArrowRight className="size-4" /></a>
        </Reveal>
      </div>

      <Reveal className="mt-10">
        <div className="relative py-2 md:py-4">
          <div className="grid gap-4 md:gap-6">
            <Marquee duration={48} gap={40}>{CLIENTS.slice(0, half).map(c => <ClientLogo key={c.src} c={c} />)}</Marquee>
            <div className="mx-auto h-px w-[min(1100px,90%)] bg-[linear-gradient(90deg,transparent,var(--border),transparent)]" />
            <Marquee duration={54} gap={40} reverse>{CLIENTS.slice(half).map(c => <ClientLogo key={c.src} c={c} />)}</Marquee>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ───────────────────────────── STORY ───────────────────────────── */
function Story() {
  return (
    <section id="about" className="mx-auto max-w-[1320px] scroll-mt-32 px-4 pt-20 md:px-6 md:pt-28">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] max-md:aspect-[4/3.6]">
            <Img src={IMG.storeStaff} alt="Fattani Computers team preparing laptops" loading="lazy" className="size-full object-cover" />
            <div className="absolute inset-x-4 bottom-4 flex items-center gap-5 rounded-2xl bg-white/92 p-5 backdrop-blur md:inset-x-6 md:bottom-6">
              <b className="font-heading text-6xl leading-none tracking-[-0.05em] text-brand"><Counter to={1997} duration={2200} className="[font-variant-numeric:normal]" /></b>
              <span className="text-sm leading-snug font-bold">From one shop in Saddar to an IT supplier serving Karachi and New York.</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <span className="eyebrow flex items-center gap-2.5 text-brand"><span className="h-0.5 w-6 rounded bg-current" />About Fattani Computers</span>
          <h2 className="mt-3 text-[34px] leading-[1.02] font-bold md:text-5xl">Karachi's most trusted laptop shop, for <Counter to={28} className="text-brand" /> years.</h2>
          <p className="mt-6 text-[17px] leading-relaxed text-ink-2">Fattani Computers has supplied quality laptops across Pakistan since 1997. Every product passes through skilled technicians before it reaches you, backed by a warranty and prices that beat the market. Whether you're a single buyer or a reseller picking up pallet loads, every order gets the same care, from sourcing to delivery.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Every laptop checked & tested", "NTN & Sales Tax registered", "Official partner of Dell Pakistan", "Wholesale pricing for resellers"].map(t => (
              <li key={t} className="flex items-center gap-3 rounded-xl border bg-white p-3 text-[14.5px] font-bold"><BadgeCheck className="size-5 shrink-0 text-brand" />{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────────── REVIEWS ───────────────────────────── */
function ReviewCard({ r, variant = 0 }: { r: (typeof REVIEWS)[number]; variant?: number }) {
  const tones = ["bg-white", "bg-brand-50", "bg-white"]
  return (
    <figure className={cn("relative rounded-[22px] border p-6", tones[variant % 3])}>
      <Quote className="absolute top-5 right-5 size-8 fill-brand/10 text-brand/20" />
      <span role="img" aria-label="Rated 5 out of 5" className="stars text-gold" />
      <blockquote className="mt-4 text-[15px] leading-relaxed text-ink-2">“{r.text}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
        <span className="relative">
          <Img src={r.img} alt={r.name} width={44} height={44} sizes="44px" referrerPolicy="no-referrer" className="size-11 rounded-full object-cover ring-2 ring-white" />
          <span className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full bg-white shadow"><GoogleG className="size-3" /></span>
        </span>
        <span className="min-w-0"><b className="block truncate text-[15px] capitalize">{r.name}</b><span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><BadgeCheck className="size-3.5 text-sky" />{r.tag}</span></span>
      </figcaption>
    </figure>
  )
}

function Reviews() {
  const cols = [REVIEWS.filter((_, k) => k % 3 === 0), REVIEWS.filter((_, k) => k % 3 === 1), REVIEWS.filter((_, k) => k % 3 === 2)]
  return (
    <section id="reviews" className="mx-auto max-w-[1320px] px-4 pt-20 md:px-6 md:pt-28">
      <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
        <Reveal className="lg:sticky lg:top-40 lg:self-start">
          <span className="eyebrow flex items-center gap-2.5 text-brand"><span className="h-0.5 w-6 rounded bg-current" />Customer stories</span>
          <h2 className="mt-3 text-[34px] leading-[1.02] font-bold md:text-5xl">Thousands of happy customers.</h2>
          <p className="mt-4 text-muted-foreground">Real reviews from Google — from first-time students to resellers who've bought 100+ laptops.</p>
          <div className="mt-7 rounded-[22px] border bg-white p-5">
            <div className="flex items-center gap-3">
              <GoogleG className="size-9" />
              <div><b className="block">Google reviews</b><span role="img" aria-label="Rated 5 out of 5" className="stars text-gold" /></div>
            </div>
            <div className="mt-5 flex items-center">
              {REVIEWS.slice(0, 6).map((r, k) => <Img key={r.name} src={r.img} alt="" width={40} height={40} sizes="40px" referrerPolicy="no-referrer" className="size-10 rounded-full object-cover ring-[3px] ring-white" style={{ marginLeft: k ? -10 : 0 }} />)}
              <span className="ml-2 text-sm font-bold text-muted-foreground">+ many more</span>
            </div>
            <Button variant="outline" className="mt-5 h-11 w-full rounded-xl font-bold">Read all reviews on Google <ArrowUpRight /></Button>
          </div>
        </Reveal>

        {/* desktop: three columns drifting at different speeds; mobile: swipe row */}
        <div className="pause-on-hover mask-fade-y relative hidden h-[680px] grid-cols-2 gap-4 overflow-hidden md:grid xl:grid-cols-3">
          {cols.map((c, k) => (
            <div key={k} className={cn("overflow-hidden", k === 2 && "hidden xl:block")} style={{ ["--marquee-duration" as string]: `${48 + k * 10}s`, ["--marquee-gap" as string]: "16px" }}>
              <div className={cn("flex flex-col gap-4", k % 2 ? "animate-marquee-y [animation-direction:reverse]" : "animate-marquee-y")}>
                {[...c, ...c].map((r, j) => <ReviewCard key={j} r={r} variant={k + j} />)}
              </div>
            </div>
          ))}
        </div>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:hidden">
          {REVIEWS.map((r, k) => <div key={r.name} className="w-[84%] shrink-0 snap-center"><ReviewCard r={r} variant={k} /></div>)}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────── LOCATIONS ───────────────────────────── */
function Locations() {
  return (
    <section id="visit" className="mx-auto max-w-[1320px] scroll-mt-32 px-4 pt-20 md:px-6 md:pt-28">
      <SectionHead eyebrow="Visit us" title="From Karachi to New York." sub="Inspect any laptop in person before you buy — physical inspection is always welcome." />
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        {LOCATIONS.map((l, k) => (
          <Reveal key={l.name} delay={k * 80}>
            <article className="group relative isolate flex h-[340px] flex-col justify-end md:h-[400px] overflow-hidden rounded-[28px] p-6 text-white">
              <Img src={l.img} alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover transition duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,18,25,.05)_25%,rgba(7,18,25,.92))]" />
              <span className="absolute top-5 left-5 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink"><Clock className="size-3.5 text-brand" />{l.hours}</span>
              <span className="eyebrow text-sky">{l.city}</span>
              <h3 className="mt-2 text-[28px] leading-tight font-bold">{l.name}</h3>
              <p className="mt-1 text-sm text-white/75">{l.address}</p>
              <div className="mt-5 flex gap-2">
                <a href={`tel:${l.tel}`} className="flex h-11 items-center gap-2 rounded-full bg-white/15 px-4 text-sm font-bold ring-1 ring-white/25 backdrop-blur transition hover:bg-white hover:text-ink"><Phone className="size-4" />{l.phone}</a>
                <a href={l.map} target="_blank" rel="noreferrer" aria-label="Get directions" className="grid size-11 place-items-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur transition hover:bg-white hover:text-ink"><MapPin className="size-4" /></a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────────── FAQ + CTA ───────────────────────────── */
function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-[1320px] scroll-mt-32 px-4 pt-20 md:px-6 md:pt-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal>
          <span className="eyebrow flex items-center gap-2.5 text-brand"><span className="h-0.5 w-6 rounded bg-current" />FAQs</span>
          <h2 className="mt-3 text-[34px] leading-[1.02] font-bold md:text-5xl">Questions, answered.</h2>
          <p className="mt-4 mb-7 max-w-[40ch] text-muted-foreground">Can't find what you need? Our team replies on WhatsApp during shop hours.</p>
          <a href={waLink("Hi Fattani Computers, I have a question.")} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 font-bold text-[#073b1f] transition hover:brightness-95"><WhatsAppIcon className="size-5" />Chat on WhatsApp</a>
        </Reveal>
        <Reveal delay={80}>
          <Accordion defaultValue={["0"]} className="rounded-[24px] border bg-white px-5 md:px-7">
            {FAQ.map(([q, a], k) => (
              <AccordionItem key={q} value={String(k)}>
                <AccordionTrigger className="py-5 text-left text-[16.5px] font-bold hover:no-underline">{q}</AccordionTrigger>
                <AccordionContent className="pb-5 text-[15px] leading-relaxed text-ink-2">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}

function Newsletter() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 pt-20 md:px-6 md:pt-28">
      <Reveal>
        <div className="relative isolate grid items-center gap-8 overflow-hidden rounded-[28px] bg-brand-900 p-8 text-white md:grid-cols-[1.3fr_1fr] md:p-14">
          <Img src={IMG.storeStaff} alt="" aria-hidden className="absolute inset-0 -z-10 size-full object-cover" /><div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(10,52,66,.97)_40%,rgba(10,52,66,.65))]" />
          <div>
            <h2 className="text-[34px] leading-[1.02] font-bold md:text-5xl">Your next laptop is one call away.</h2>
            <p className="mt-4 text-white/70">Get new arrivals, clearance drops and wholesale price lists before anyone else.</p>
          </div>
          <NewsletterForm />
        </div>
      </Reveal>
    </section>
  )
}

export default function HomeView() {
  return (
    <>
      <Hero />
      <Stats />
      <Promises />
      <Categories />
      <ProductBentoSection />
      <Finder />
      <Services />
      <Clients />
      <Story />
      <Reviews />
      <Locations />
      <Faq />
      <Newsletter />
    </>
  )
}
