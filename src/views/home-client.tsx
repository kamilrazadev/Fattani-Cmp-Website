"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Link } from "@/lib/router"
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Clock, ShieldCheck, Star } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProductCard, ConditionBadge, Price } from "@/components/product-card"
import { BrandMark } from "@/components/logos"
import { Counter, Reveal } from "@/components/motion"
import { Img } from "@/components/img"
import { BRANDS, fmt, specChips, storageLabel, type Product } from "@/lib/catalog-core"
import { IMG } from "@/lib/site"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

/* ───────────────────────────── SECTION HEAD ───────────────────────────── */
export function SectionHead({ eyebrow, title, sub, action, className }: { eyebrow: string; title: React.ReactNode; sub?: string; action?: React.ReactNode; className?: string }) {
  return (
    <Reveal className={cn("mb-8 flex flex-wrap items-end justify-between gap-5 md:mb-10", className)}>
      <div>
        <span className="eyebrow flex items-center gap-2.5 text-brand"><span className="h-0.5 w-6 rounded bg-current" />{eyebrow}</span>
        <h2 className="mt-3 max-w-[18ch] text-[34px] leading-[1.02] font-bold md:text-5xl">{title}</h2>
      </div>
      <div className="flex max-w-md min-w-0 flex-col items-start gap-4 max-md:max-w-full">
        {sub && <p className="text-[15px] text-muted-foreground">{sub}</p>}
        {action}
      </div>
    </Reveal>
  )
}


type HeroProducts = { dell: Product; gaming: Product; certified: Product }
const buildSlides = (pr: HeroProducts) => [
  {
    key: "wholesale", tab: "Wholesale prices", tone: "dark" as const,
    eyebrow: "Karachi's No. 1 wholesale laptop dealer",
    title: ["Business-grade", "laptops.", "Wholesale", "prices."], accent: [2],
    sub: "Every machine is tested by our technicians, backed by warranty and delivered anywhere in Pakistan. Trusted since 1997.",
    cta: { label: "Shop all laptops", to: "/shop" },
    photo: IMG.storeWide,
  },
  {
    key: "dell", tab: "Official Dell partner", tone: "light" as const,
    eyebrow: "Now official · Karachi since 1997",
    title: ["Official", "partner of", "Dell", "Pakistan."], accent: [2, 3],
    sub: "Genuine brand new Dell laptops in stock, corporate and bulk orders welcome. Visit us at GD-18, Techno City Mall.",
    cta: { label: "Shop Dell", to: "/shop?brand=Dell" },
    product: pr.dell,
  },
  {
    key: "gaming", tab: "RTX gaming", tone: "ink" as const,
    eyebrow: "Brand new · 1 year international warranty",
    title: ["RTX 50-series", "gaming", "has landed."], accent: [0],
    sub: "HP Victus, OMEN, Lenovo Legion, ASUS TUF and Acer Predator — high refresh screens and the newest NVIDIA graphics.",
    cta: { label: "Shop gaming", to: "/shop?type=gaming" },
    product: pr.gaming,
  },
  {
    key: "certified", tab: "Certified used", tone: "gold" as const,
    eyebrow: "Certified used laptops",
    title: ["Used price.", "1 year", "warranty."], accent: [1, 2],
    sub: "Hand-picked business laptops, fully tested and covered for a whole year by Fattani Computers.",
    cta: { label: "Shop certified", to: "/shop?cond=certified" },
    product: pr.certified,
  },
]
const DURATION = 7000

export function HeroStage({ products }: { products: HeroProducts }) {
  const SLIDES = useMemo(() => buildSlides(products), [products])
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setI(v => (v + 1) % SLIDES.length), DURATION)
    return () => clearTimeout(t)
  }, [i, paused])
  const s = SLIDES[i]
  const dark = s.tone === "dark" || s.tone === "ink"

  return (
    <div
      className={cn("relative isolate flex min-h-[560px] flex-col overflow-hidden rounded-[28px] transition-colors duration-700 md:min-h-[620px]",
        s.tone === "dark" && "bg-ink text-white", s.tone === "ink" && "bg-[#071219] text-white", s.tone === "light" && "bg-brand-50 text-ink", s.tone === "gold" && "bg-gold text-ink")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* backgrounds */}
      {s.photo && (
        <div key={s.key} className="absolute inset-0 -z-10 overflow-hidden">
          <Image src={s.photo} alt="" fill priority={i === 0} fetchPriority={i === 0 ? "high" : undefined} sizes="(min-width:1024px) 900px, 100vw" quality={45} className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(7,18,25,.94)_0%,rgba(7,18,25,.78)_42%,rgba(7,18,25,.2)_100%)]" />
        </div>
      )}
      {s.tone === "light" && <div className="tx-grid absolute inset-0 -z-10 text-brand/60" />}
      {s.tone === "ink" && <div className="tx-hatch absolute inset-0 -z-10 text-white/60" />}
      {s.tone === "gold" && <div className="tx-dots absolute inset-0 -z-10 text-ink/50" />}
      <div className="tx-grain pointer-events-none absolute inset-0 -z-10" />

      <div className="grid flex-1 items-center gap-6 p-7 md:grid-cols-[1.35fr_1fr] md:p-11">
        <div key={s.key} className="relative z-10 max-w-xl">
          <span className={cn("eyebrow animate-rise inline-flex items-center gap-2 rounded-full px-3 py-1.5", dark ? "bg-white/10 text-sky ring-1 ring-white/15" : "bg-white/70 text-brand ring-1 ring-black/5")}>
            {s.key === "dell" ? <BadgeCheck className="size-3.5" /> : s.key === "certified" ? <ShieldCheck className="size-3.5" /> : <Star className="size-3.5 fill-current" />}
            {s.eyebrow}
          </span>
          <h1 className="mt-6 font-heading text-[42px] leading-[.95] font-extrabold tracking-[-0.04em] sm:text-[56px] xl:text-[64px]">
            {s.title.map((w, k) => (
              <span key={k} className="inline-block overflow-hidden pb-1 align-bottom">
                <span
                  className={cn("animate-rise inline-block pr-[0.22em]", s.accent.includes(k) && (dark ? "text-sky" : s.tone === "gold" ? "text-brand-900 underline decoration-[6px] underline-offset-[10px]" : "text-brand"))}
                  style={{ animationDelay: `${120 + k * 90}ms` }}
                >{w}</span>
              </span>
            ))}
          </h1>
          <p className={cn("animate-rise mt-6 max-w-[46ch] text-[17px] leading-relaxed", dark ? "text-white/75" : "text-ink-2")} style={{ animationDelay: "480ms" }}>{s.sub}</p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "580ms" }}>
            <Link to={s.cta.to} viewTransition className={cn("group inline-flex h-13 items-center gap-2 rounded-full px-7 text-[15px] font-bold transition", dark ? "bg-white text-ink hover:bg-sky" : "bg-ink text-white hover:bg-brand")}>
              {s.cta.label}<ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
            <a href="#finder" className={cn("inline-flex h-13 items-center rounded-full px-6 text-[15px] font-bold ring-1 transition", dark ? "text-white ring-white/30 hover:bg-white/10" : "ring-ink/20 hover:bg-white/60")}>Help me choose</a>
          </div>
        </div>

        {s.product && (
          <Link key={s.key + "p"} to={`/product/${s.product.slug}`} viewTransition className="group relative hidden h-full min-h-[340px] items-center justify-center md:flex">
            <div className="animate-rise relative w-[min(440px,100%)]" style={{ animationDelay: "250ms" }}>
              <div className="animate-float rounded-[26px] bg-white p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,.55)] ring-1 ring-black/5">
                <Img src={s.product.images[0]} alt={s.product.model} className="mx-auto aspect-[4/3] w-full object-contain mix-blend-multiply" />
                <div className="mt-3 flex items-end justify-between gap-3 border-t pt-4 text-ink">
                  <div className="min-w-0">
                    <ConditionBadge p={s.product} />
                    <b className="mt-1.5 block truncate text-[15px]">{s.product.model}</b>
                    <span className="block truncate font-mono text-[11px] text-muted-foreground">{specChips(s.product).slice(0, 3).join(" · ")}</span>
                  </div>
                  <Price p={s.product} size="sm" />
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* labelled progress tabs */}
      <div className="relative z-10 flex items-center gap-2 px-5 pb-5 md:px-12 md:pb-8">
        <div className="grid flex-1 grid-cols-4 gap-2 md:gap-4">
          {SLIDES.map((sl, k) => (
            <button key={sl.key} onClick={() => setI(k)} className="group text-left" aria-label={`Show slide: ${sl.tab}`} aria-current={k === i}>
              <span className={cn("relative block h-[3px] overflow-hidden rounded-full", dark ? "bg-white/20" : "bg-ink/15")}>
                {k === i && <span key={`${i}-${paused}`} className={cn("absolute inset-0 origin-left rounded-full", dark ? "bg-white" : "bg-ink", !paused && "animate-progress")} style={{ ["--progress-duration" as string]: `${DURATION}ms`, transform: paused ? "scaleX(1)" : undefined }} />}
                {k < i && <span className={cn("absolute inset-0 rounded-full", dark ? "bg-white/60" : "bg-ink/50")} />}
              </span>
              <span className={cn("mt-2 hidden text-[12.5px] font-bold transition md:block", k === i ? "" : "opacity-55 group-hover:opacity-90")}>{sl.tab}</span>
            </button>
          ))}
        </div>
        <div className="ml-3 hidden gap-1.5 md:flex">
          <button aria-label="Previous slide" onClick={() => setI((i - 1 + SLIDES.length) % SLIDES.length)} className={cn("grid size-10 place-items-center rounded-full ring-1 transition", dark ? "ring-white/25 hover:bg-white/10" : "ring-ink/20 hover:bg-white/70")}><ChevronLeft className="size-4" /></button>
          <button aria-label="Next slide" onClick={() => setI((i + 1) % SLIDES.length)} className={cn("grid size-10 place-items-center rounded-full ring-1 transition", dark ? "ring-white/25 hover:bg-white/10" : "ring-ink/20 hover:bg-white/70")}><ChevronRight className="size-4" /></button>
        </div>
      </div>
    </div>
  )
}

function useCountdown() {
  // Starts empty so server and client render the same text; ticks once mounted.
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  if (now === null) return ["--", "--", "--"]
  const end = new Date(now); end.setHours(24, 0, 0, 0)
  const s = Math.max(0, Math.floor((end.getTime() - now) / 1000))
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(n => String(n).padStart(2, "0"))
}

export function DealCard({ deal }: { deal: Product }) {
  const [h, m, s] = useCountdown()
  const { addToCart } = useStore()
  return (
    <div className="relative flex flex-col overflow-hidden rounded-[24px] border bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="eyebrow rounded-md bg-deal px-2 py-1 !text-[10.5px] text-white">Deal of the day</span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Clock className="size-3.5" />Ends in</span>
      </div>
      <div className="mt-2 flex justify-end gap-1.5">
        {[[h, "hrs"], [m, "min"], [s, "sec"]].map(([v, l]) => (
          <span key={l} className="min-w-12 rounded-lg bg-paper px-2 py-1 text-center ring-1 ring-border">
            <b className="num block font-mono text-lg leading-tight">{v}</b><small className="text-[9.5px] font-bold text-muted-foreground uppercase">{l}</small>
          </span>
        ))}
      </div>
      <Link to={`/product/${deal.slug}`} viewTransition className="group my-3 grid flex-1 place-items-center">
        <Img src={deal.images[0]} alt={deal.model} className="max-h-32 object-contain mix-blend-multiply transition duration-700 group-hover:scale-105" />
      </Link>
      <b className="line-clamp-1 text-[17px]">{deal.model}</b>
      <span className="truncate font-mono text-[11px] text-muted-foreground">{specChips(deal).join(" · ")}</span>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-3">
        <div className="flex min-w-0 flex-wrap items-end gap-x-2 gap-y-1"><Price p={deal} /><span className="mb-0.5 rounded bg-deal/10 px-1.5 py-0.5 text-xs font-extrabold whitespace-nowrap text-deal">Save {fmt(deal.was - deal.price)}</span></div>
        <Button onClick={() => addToCart(deal)} className="h-11 rounded-xl px-4 font-bold max-[400px]:w-full">Add to cart</Button>
      </div>
    </div>
  )
}

/* ───────────────────────────── PRODUCT BENTO ───────────────────────────── */
const TABS = [
  { id: "arrivals", label: "New arrivals" },
  { id: "gaming", label: "Gaming" },
  { id: "business", label: "Business" },
  { id: "budget", label: "Under 100k" },
  { id: "apple", label: "MacBook" },
] as const

function FeatureCard({ p }: { p: Product }) {
  const { addToCart } = useStore()
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-ink p-6 text-white md:p-8">
      <Img src={IMG.storeWide} alt="" aria-hidden className="absolute inset-0 size-full object-cover opacity-[.18] grayscale" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,26,34,.55),rgba(10,26,34,.95))]" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <span className="eyebrow text-sky">Featured · {p.brand}</span>
          <Link to={`/product/${p.slug}`} viewTransition><h3 className="mt-2 max-w-[16ch] text-3xl leading-tight font-bold md:text-[34px]">{p.model}</h3></Link>
        </div>
        <ConditionBadge p={p} className="shrink-0" />
      </div>
      <Link to={`/product/${p.slug}`} viewTransition className="relative my-4 grid flex-1 place-items-center">
        <div className="w-[88%] rounded-[22px] bg-white p-4 transition duration-700 group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
          <Img src={p.images[0]} alt={p.model} className="mx-auto aspect-[16/10] w-full object-contain mix-blend-multiply" />
        </div>
      </Link>
      <ul className="relative grid grid-cols-2 gap-2 md:grid-cols-4">
        {[["CPU", p.cpuFamily || "—"], ["Memory", p.ramGB ? `${p.ramGB}GB` : "—"], ["Storage", p.storageGB ? storageLabel(p.storageGB) : "—"], ["Graphics", p.gpuShort || "Integrated"]].map(([k, v]) => (
          <li key={k} className="rounded-xl bg-white/[.07] p-2.5 ring-1 ring-white/10 backdrop-blur-sm"><span className="block font-mono text-[10px] tracking-wider text-white/45 uppercase">{k}</span><b className="text-sm">{v}</b></li>
        ))}
      </ul>
      <div className="relative mt-5 flex items-end justify-between">
        <Price p={p} size="lg" />
        <Button onClick={() => addToCart(p)} className="h-12 rounded-xl bg-white px-5 font-bold text-ink hover:bg-sky">Add to cart</Button>
      </div>
    </article>
  )
}

function CatalogueTile({ to, stack, counts, total }: { to: string; stack: Product[]; counts: (readonly [string, number])[]; total: number }) {
  return (
    <Link to={to} viewTransition className="group relative col-span-2 grid min-h-56 overflow-hidden rounded-[24px] bg-brand p-6 text-white md:grid-cols-[1.1fr_1fr] md:p-8">
      <Img src={IMG.storeWide} alt="" aria-hidden className="absolute inset-0 size-full object-cover opacity-25 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(15,82,101,.97)_35%,rgba(15,82,101,.6))]" />
      <div className="relative flex flex-col">
        <span className="eyebrow text-white/70">Full catalogue</span>
        <b className="mt-2 font-heading text-3xl leading-tight md:text-4xl">View all <Counter to={total} /> laptops</b>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {counts.map(([c, n]) => <li key={c} className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold ring-1 ring-white/20"><span className="num">{n}</span> {c === "new" ? "brand new" : c === "used" ? "used · tested" : "certified"}</li>)}
        </ul>
        <div className="mt-auto flex items-center gap-4 pt-6">
          {BRANDS.slice(0, 4).map(b => <BrandMark key={b} brand={b} colored={false} className="h-6 w-auto text-white/80" />)}
          <span className="ml-auto grid size-14 shrink-0 place-items-center rounded-full bg-white text-ink transition group-hover:rotate-[-45deg] md:hidden"><ArrowRight className="size-6" /></span>
        </div>
      </div>
      <div className="relative hidden items-center justify-center md:flex">
        {stack.map((p, k) => (
          <div key={p.id} className="absolute w-[56%] rounded-2xl bg-white p-2.5 shadow-[0_20px_40px_-18px_rgba(0,0,0,.6)] transition duration-500 group-hover:rotate-0"
            style={{ transform: `translateX(${(k - 1) * 38}%) rotate(${(k - 1) * 8}deg)`, zIndex: k === 1 ? 2 : 1 }}>
            <Img src={p.images[0]} alt="" className="aspect-[4/3] w-full object-contain mix-blend-multiply" />
          </div>
        ))}
        <span className="absolute right-0 bottom-0 z-10 grid size-14 place-items-center rounded-full bg-white text-ink transition group-hover:rotate-[-45deg]"><ArrowRight className="size-6" /></span>
      </div>
    </Link>
  )
}

export type Collections = Record<(typeof TABS)[number]["id"], Product[]>
export function ProductBento({ collections, stack, counts, total }: { collections: Collections; stack: Product[]; counts: (readonly [string, number])[]; total: number }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("arrivals")
  const list = collections[tab]
  const [feat, ...rest] = list
  const to = { arrivals: "/shop", gaming: "/shop?type=gaming", business: "/shop?cond=used", budget: "/shop?max=100000", apple: "/shop?type=macbook" }[tab]
  return (
    <section className="mx-auto max-w-[1320px] px-4 pt-20 md:px-6 md:pt-28">
      <SectionHead
        eyebrow="In the showroom"
        title={<>Fresh stock, <span className="text-brand">every week.</span></>}
        action={
          <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)} className="max-w-full min-w-0">
            <TabsList className="no-scrollbar h-11 max-w-full justify-start overflow-x-auto rounded-full bg-white p-1 ring-1 ring-border">
              {TABS.map(t => <TabsTrigger key={t.id} value={t.id} className="h-9 flex-none rounded-full px-4 text-[13.5px] font-bold hover:text-ink data-active:bg-ink data-active:text-white data-active:hover:text-white">{t.label}</TabsTrigger>)}
            </TabsList>
          </Tabs>
        }
      />
      <div key={tab} className="grid animate-in grid-cols-2 gap-3 duration-500 fade-in slide-in-from-bottom-2 md:gap-4 lg:grid-cols-4">
        {feat && <div className="col-span-2 lg:row-span-2"><FeatureCard p={feat} /></div>}
        {rest.slice(0, 4).map(p => <ProductCard key={p.id} p={p} />)}
        {rest.slice(4, 6).map(p => <ProductCard key={p.id} p={p} className="max-lg:hidden" />)}
        <CatalogueTile to={to} stack={stack} counts={counts} total={total} />
      </div>
    </section>
  )
}

export function NewsletterForm() {
  return (
    <form onSubmit={e => { e.preventDefault(); (e.target as HTMLFormElement).reset() }} className="flex gap-2 rounded-full bg-white p-1.5">
      <input type="email" required placeholder="Your email address" aria-label="Email address" className="min-w-0 flex-1 bg-transparent px-4 text-[15px] font-semibold text-ink outline-none" />
      <Button type="submit" className="h-11 rounded-full bg-ink px-6 font-bold text-white hover:bg-brand">Subscribe</Button>
    </form>
  )
}
