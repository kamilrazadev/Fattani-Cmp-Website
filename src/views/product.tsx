"use client"

import { useEffect, useMemo, useState } from "react"
import { Link } from "@/lib/router"
import {
  BadgeCheck, Check, Expand, Cpu, CreditCard, GitCompareArrows, HardDrive, Heart, MemoryStick, Minus, Monitor, MonitorSmartphone,
  Package, Plus, RotateCcw, Share2, ShieldCheck, Star, Store, Truck, Gift, Layers,
} from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ConditionBadge, Price, ProductCard } from "@/components/product-card"
import { Lightbox } from "@/components/lightbox"
import { BrandMark, PaymentLogos, WhatsAppIcon } from "@/components/logos"
import { fmt, ordinal, savePct, storageLabel, TYPE_LABEL, warrantyOptions, type Product } from "@/lib/catalog-core"
import { useStore, waLink } from "@/lib/store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { SITE_URL } from "@/lib/seo"
import { Img } from "@/components/img"

function Gallery({ p }: { p: Product }) {
  const [active, setActive] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const [viewer, setViewer] = useState(false)
  useEffect(() => { if (!api) return; const f = () => setActive(api.selectedScrollSnap()); api.on("select", f); return () => { api.off("select", f) } }, [api])
  useEffect(() => { setActive(0); api?.scrollTo(0, true) }, [p.id, api])

  return (
    <div className="lg:sticky lg:top-[150px] lg:self-start">
      {/* Desktop: thumbnails + zoomable stage */}
      <div className="hidden gap-3 md:grid md:grid-cols-[76px_1fr]">
        <div className="flex flex-col gap-2">
          {p.images.map((src, k) => (
            <button key={src} onClick={() => setActive(k)} aria-label={`Image ${k + 1}`} className={cn("grid aspect-square place-items-center rounded-xl border bg-white p-1.5 transition", k === active ? "border-ink ring-2 ring-ink/10" : "hover:border-ink/40")}>
              <Img src={src} alt="" className="max-h-full mix-blend-multiply" />
            </button>
          ))}
        </div>
        <div
          className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[28px] border bg-white"
          role="button" tabIndex={0} aria-label={`View ${p.images.length} photos`} onClick={() => setViewer(true)} onKeyDown={e => e.key === "Enter" && setViewer(true)}
          onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) }}
          onMouseLeave={() => setZoom(null)}
        >
          <div className="tx-dots absolute inset-0 text-brand/25 [mask-image:radial-gradient(70%_60%_at_50%_50%,transparent,#000)]" />
          <Img key={p.images[active]} src={p.images[active]} alt={p.model} width={900} height={900} sizes="(min-width:1024px) 600px, 100vw" quality={75} priority={active === 0}
            className="relative size-full animate-in object-contain p-10 duration-500 fade-in zoom-in-95"
            style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
          <div className="absolute top-4 left-4 flex flex-col items-start gap-1.5">{savePct(p) > 0 && <span className="rounded-md bg-deal px-2 py-1 text-xs font-extrabold text-white">-{savePct(p)}%</span>}<ConditionBadge p={p} /></div>
          <span className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11.5px] font-bold text-white"><Expand className="size-3.5" />View {p.images.length} photos</span>
        </div>
      </div>

      {/* Mobile: swipeable, full-bleed like a native app */}
      <div className="relative -mx-4 md:hidden">
        <Carousel setApi={setApi} opts={{ loop: p.images.length > 1 }}>
          <CarouselContent className="ml-0">
            {p.images.map((src, k) => (
              <CarouselItem key={src} className="pl-0"><div role="button" tabIndex={0} aria-label="Open image viewer" onClick={() => setViewer(true)} className="grid aspect-square place-items-center bg-white"><Img src={src} alt={p.model} width={900} height={900} sizes="100vw" quality={75} priority={k === 0} className="max-h-full object-contain p-8" /></div></CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {p.images.map((_, k) => <button key={k} aria-label={`Image ${k + 1}`} onClick={() => api?.scrollTo(k)} className={cn("h-1.5 rounded-full transition-all", k === active ? "w-6 bg-ink" : "w-1.5 bg-ink/25")} />)}
        </div>
        <div className="absolute top-3 left-4 flex flex-col items-start gap-1.5">{savePct(p) > 0 && <span className="rounded-md bg-deal px-2 py-1 text-xs font-extrabold text-white">-{savePct(p)}%</span>}<ConditionBadge p={p} /></div>
        <button onClick={() => setViewer(true)} aria-label="Open image viewer" className="absolute top-3 right-4 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm"><Expand className="size-4" /></button>
      </div>
      <Lightbox images={p.images} title={p.model} open={viewer} index={active} onOpenChange={setViewer} />
    </div>
  )
}

function SpecTiles({ p }: { p: Product }) {
  const tiles = [
    { icon: Cpu, k: "Processor", v: p.cpuFamily ? `${p.cpuFamily}${p.gen && !p.cpuFamily.includes("Ultra") && !p.cpuFamily.startsWith("Apple") ? ` · ${ordinal(p.gen)} Gen` : ""}` : p.cpu || "—" },
    { icon: MemoryStick, k: "Memory", v: p.ramGB ? `${p.ramGB}GB RAM` : p.ram || "—" },
    { icon: HardDrive, k: "Storage", v: p.storageGB ? `${storageLabel(p.storageGB)} SSD` : p.storage || "—" },
    { icon: Monitor, k: "Display", v: p.screenIn ? `${p.screenIn}"${p.touch ? " touch" : ""}` : p.display || "—" },
    { icon: Layers, k: "Graphics", v: p.gpuShort || "Integrated" },
    { icon: Package, k: "Condition", v: p.condition === "new" ? "Brand new" : p.condition === "certified" ? "Certified used" : "Used · tested" },
  ]
  return (
    <ul className="grid grid-cols-3 gap-2">
      {tiles.map(t => (
        <li key={t.k} className="rounded-xl border bg-white p-3">
          <t.icon className="size-4 text-brand" />
          <span className="mt-2 block font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{t.k}</span>
          <b className="block text-[13.5px] leading-tight">{t.v}</b>
        </li>
      ))}
    </ul>
  )
}

export interface ProductDetail { images: string[]; intro: string[]; whoFor: string[]; features: string[]; highlights: string[] }

export default function ProductPage({ base, detail, related }: { base: Product; detail: ProductDetail; related: Product[] }) {
  const p = useMemo(() => ({ ...base, ...detail }), [base, detail])
  const opts = warrantyOptions(p)
  const [warranty, setWarranty] = useState(opts[0].id)
  const [qty, setQty] = useState(1)
  const { addToCart, toggleWish, toggleCompare, wishlist, compare, setCartOpen } = useStore()
  useEffect(() => { setWarranty(warrantyOptions(p)[0].id); setQty(1) }, [p])

  const w = opts.find(o => o.id === warranty) ?? opts[0]
  const total = (p.price + w.price) * qty
  const wished = wishlist.includes(p.id), comparing = compare.includes(p.id)
  const add = () => addToCart(p, { qty, warranty: { label: w.label, price: w.price } })
  const buyNow = () => { addToCart(p, { qty, warranty: { label: w.label, price: w.price }, silent: true }); setCartOpen(true) }
  const waText = `Hi Fattani Computers, is the ${p.model} (${fmt(p.price)}) available? ${SITE_URL}/product/${p.slug}`
  const specRows: [string, string][] = ([
    ["Brand", p.brand], ["Model", p.model], ["Processor", p.cpu], ["Memory", p.ram], ["Storage", p.storage], ["Graphics", p.gpu],
    ["Display", p.display], ["Keyboard", p.keyboard], ["Operating system", p.os], ["Colour", p.colour],
    ["Condition", p.conditionNote || (p.condition === "new" ? "Brand new" : "Used, tested before sale")], ["Category", TYPE_LABEL[p.type]],
  ] as [string, string][]).filter(([, v]) => v)

  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-0 pb-28 md:px-6 md:pt-8 md:pb-10">
      <Breadcrumb className="mb-6 max-md:hidden">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink render={<Link to={`/shop?type=${p.type}`} />}>{TYPE_LABEL[p.type]}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink render={<Link to={`/shop?brand=${p.brand}`} />}>{p.brand}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage className="max-w-[40ch] truncate">{p.model}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6 md:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Gallery p={p} />

        <div>
          <div className="flex items-center gap-2">
            <Link to={`/shop?brand=${p.brand}`} className="flex items-center gap-2 rounded-full border bg-white py-1 pr-3 pl-2 text-xs font-bold"><BrandMark brand={p.brand} className="h-4 w-5" />{p.brand}</Link>
            <span className={cn("flex items-center gap-1.5 text-xs font-bold", p.inStock ? "text-ok" : "text-muted-foreground")}>{p.inStock ? <><Check className="size-3.5" />In stock · ready to ship</> : "Out of stock · ask for ETA"}</span>
            <div className="ml-auto flex gap-1">
              <button aria-label="Share" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied") }} className="grid size-9 place-items-center rounded-full border bg-white"><Share2 className="size-4" /></button>
              <button aria-label="Save to wishlist" aria-pressed={wished} onClick={() => toggleWish(p.id, p.model)} className={cn("grid size-9 place-items-center rounded-full border bg-white", wished && "border-deal text-deal")}><Heart className={cn("size-4", wished && "fill-current")} /></button>
            </div>
          </div>
          <h1 className="mt-4 text-[30px] leading-[1.05] font-bold md:text-[42px]">{p.model}</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">{p.title.split(/ – | - /).slice(1).join(" · ") || p.title}</p>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <Price p={p} size="lg" />
            {p.was > 0 && <span className="mb-1 rounded-md bg-deal/10 px-2 py-1 text-sm font-extrabold text-deal">You save {fmt(p.was - p.price)}</span>}
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><CreditCard className="size-4" />Or 3 interest-free payments of <b className="num text-ink">{fmt(Math.ceil(p.price / 3))}</b> with BaadMay</p>

          <div className="mt-6"><SpecTiles p={p} /></div>

          {/* Warranty options (from the store's own pricing) */}
          <fieldset className="mt-6">
            <legend className="mb-3 flex items-center gap-2 text-[15px] font-bold"><ShieldCheck className="size-4 text-brand" />Choose your warranty</legend>
            <RadioGroup value={warranty} onValueChange={(v: unknown) => setWarranty(v as string)} className="grid gap-2">
              {opts.map(o => (
                <Label key={o.id} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3.5 transition", warranty === o.id ? "border-ink ring-2 ring-ink/10" : "hover:border-ink/40")}>
                  <RadioGroupItem value={o.id} aria-label={o.label} />
                  <span className="flex-1"><b className="block text-[14.5px]">{o.label}</b><span className="text-xs font-medium text-muted-foreground">{o.note}</span></span>
                  <b className={cn("num text-sm", o.price ? "" : "text-ok")}>{o.price ? `+ ${fmt(o.price)}` : "Free"}</b>
                </Label>
              ))}
            </RadioGroup>
          </fieldset>

          <div className="mt-6 hidden items-center gap-2 md:flex">
            <div className="flex h-13 items-center rounded-xl border bg-white">
              <button aria-label="Decrease quantity" onClick={() => setQty(q => Math.max(1, q - 1))} className="grid h-full w-11 place-items-center"><Minus className="size-4" /></button>
              <span className="num w-8 text-center font-bold">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty(q => q + 1)} className="grid h-full w-11 place-items-center"><Plus className="size-4" /></button>
            </div>
            <Button onClick={add} className="h-13 flex-1 rounded-xl bg-ink text-[15px] font-bold hover:bg-ink/85">Add to cart · <span className="num">{fmt(total)}</span></Button>
            <Button onClick={buyNow} className="h-13 rounded-xl px-6 text-[15px] font-bold">Buy now</Button>
          </div>
          <div className="mt-2 hidden gap-2 md:flex">
            <a href={waLink(waText)} target="_blank" rel="noreferrer" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366]/12 text-[14.5px] font-bold text-[#0b7a3b] transition hover:bg-[#25D366]/20"><WhatsAppIcon className="size-4" />Ask on WhatsApp</a>
            <Button variant="outline" onClick={() => toggleCompare(p.id, p.model)} className={cn("h-12 flex-1 rounded-xl bg-white text-[14.5px] font-bold", comparing && "border-ink bg-ink text-white hover:bg-ink/85 hover:text-white")}><GitCompareArrows />{comparing ? "Added to compare" : "Compare"}</Button>
          </div>

          <ul className="mt-6 grid gap-2 rounded-2xl border bg-white p-4 text-sm sm:grid-cols-2">
            {[[Truck, "Delivery across Pakistan"], [RotateCcw, "7-day cashback if a fault appears"], [Store, "Inspect at Techno City Mall"], [Gift, "Earn Fattani Rewards points"]].map(([I, t]) => {
              const Icon = I as typeof Truck
              return <li key={t as string} className="flex items-center gap-2.5 font-semibold"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand"><Icon className="size-4" /></span>{t as string}</li>
            })}
          </ul>
          <PaymentLogos className="mt-4" />
        </div>
      </div>

      {/* Details */}
      <Tabs defaultValue="overview" className="mt-14 min-w-0 md:mt-20">
        <TabsList className="no-scrollbar h-12! w-full justify-start overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-full bg-white p-1 ring-1 ring-border md:w-fit">
          {[["overview", "Overview"], ["specs", "Specifications"], ["warranty", "Warranty & delivery"], ["reviews", "Reviews"]].map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="h-10 shrink-0 flex-none rounded-full px-5 font-bold after:hidden data-active:bg-ink data-active:text-white hover:text-ink data-active:hover:text-white">{l}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[24px] border bg-white p-6 md:p-8">
              <h2 className="text-2xl font-bold">About this laptop</h2>
              {(p.intro.length ? p.intro : [p.title]).map((t, k) => <p key={k} className="mt-4 text-[15.5px] leading-relaxed text-ink-2">{t}</p>)}
              {p.features.length > 0 && (
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {p.features.map(f => <li key={f} className="flex gap-2.5 text-[14.5px]"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-brand" />{f}</li>)}
                </ul>
              )}
            </div>
            <div className="rounded-[24px] bg-brand-900 p-6 text-white md:p-8">
              <h3 className="flex items-center gap-2 text-xl font-bold"><MonitorSmartphone className="size-5 text-sky" />Who is it for?</h3>
              <ul className="mt-5 grid gap-3">
                {(p.whoFor.length ? p.whoFor : p.highlights.length ? p.highlights : ["Office work and online classes", "Browsing, email and documents", "Everyday multitasking"]).map(t => (
                  <li key={t} className="flex gap-3 rounded-xl bg-white/[.06] p-3 text-[14.5px] ring-1 ring-white/10"><Check className="mt-0.5 size-4 shrink-0 text-sky" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="specs" className="mt-6">
          <div className="overflow-hidden rounded-[24px] border bg-white">
            <dl className="divide-y">
              {specRows.map(([k, v]) => (
                <div key={k} className="grid gap-1 px-6 py-4 sm:grid-cols-[220px_1fr]">
                  <dt className="font-mono text-[11.5px] tracking-wider text-muted-foreground uppercase">{k}</dt>
                  <dd className="text-[15px] font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </TabsContent>
        <TabsContent value="warranty" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [ShieldCheck, "Warranty", p.condition === "new" ? "1 year international warranty, free. Add Fattani Plus for 1 year local cover (Rs 17,000)." : p.condition === "certified" ? "1 year Fattani warranty included. Faults in parts from normal use are repaired or replaced free." : "3 months Fattani warranty included. Extend to 6 months (+Rs 10,000) or 1 year (+Rs 16,000)."],
              [RotateCcw, "7-day cashback", "If the device develops a fault within 7 days of purchase, you can return it for your money back. Physical or liquid damage is not covered."],
              [Truck, "Delivery & payment", "Delivery across Pakistan, or buy at our shop in Techno City Mall. Pay by bank transfer, card, cash on delivery (4% handling) or BaadMay installments."],
            ].map(([I, h, t]) => {
              const Icon = I as typeof Truck
              return <div key={h as string} className="rounded-[24px] border bg-white p-6"><span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand"><Icon className="size-5" /></span><h3 className="mt-4 text-lg font-bold">{h as string}</h3><p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{t as string}</p></div>
            })}
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <div className="grid place-items-center rounded-[24px] border bg-white px-6 py-14 text-center">
            <div className="flex gap-1 text-gold">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-6" />)}</div>
            <h3 className="mt-4 text-2xl font-bold">No reviews for this model yet</h3>
            <p className="mt-2 max-w-md text-muted-foreground">Bought this from Fattani Computers? Verified buyers earn 100 Fattani Rewards points for an approved review — good or bad.</p>
            <Button className="mt-6 h-11 rounded-full px-6 font-bold">Write a review</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Similar */}
      <section className="mt-16 md:mt-24">
        <Carousel opts={{ align: "start" }}>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div><span className="eyebrow text-brand">You may also like</span><h2 className="mt-2 text-3xl font-bold md:text-4xl">Similar laptops</h2></div>
            <div className="flex items-center gap-2">
              <Link to={`/shop?type=${p.type}`} className="mr-2 text-sm font-bold text-brand hover:underline">View all</Link>
              <CarouselPrevious className="static size-10 translate-y-0 rounded-full bg-white max-md:hidden" />
              <CarouselNext className="static size-10 translate-y-0 rounded-full bg-white max-md:hidden" />
            </div>
          </div>
          <CarouselContent className="-ml-3 md:-ml-4">
            {related.map(r => <CarouselItem key={r.id} className="basis-[72%] pl-3 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4"><ProductCard p={r} className="h-full" /></CarouselItem>)}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Mobile sticky buy bar */}
      <div className="pb-safe fixed inset-x-0 bottom-16 z-30 border-t bg-white/95 p-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <a href={waLink(waText)} target="_blank" rel="noreferrer" aria-label="Ask on WhatsApp" className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#25D366]/15 text-[#0b7a3b]"><WhatsAppIcon className="size-5" /></a>
          <button aria-label="Compare" aria-pressed={comparing} onClick={() => toggleCompare(p.id, p.model)} className={cn("grid size-12 shrink-0 place-items-center rounded-xl border", comparing && "border-ink bg-ink text-white")}><GitCompareArrows className="size-5" /></button>
          <Button onClick={add} className="h-12 flex-1 rounded-xl bg-ink text-[15px] font-bold">Add · <span className="num">{fmt(total)}</span></Button>
        </div>
      </div>
    </div>
  )
}
