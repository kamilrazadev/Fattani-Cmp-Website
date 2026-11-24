"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useSearchParams } from "@/lib/router"
import { Award, Cpu, GitCompareArrows, Link2, Plus, Search, Trash2, Trophy, Wallet, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ConditionBadge, Price } from "@/components/product-card"
import { BrandMark } from "@/components/logos"
import { Reveal } from "@/components/motion"
import { byId, fmt, ordinal, PRODUCTS, searchProducts, specChips, storageLabel, type Product } from "@/lib/products"
import { MAX_COMPARE, useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Img } from "@/components/img"

const cpuTier = (p: Product) => {
  const f = p.cpuFamily
  if (/i9|Ultra 9|Ryzen 9|Max/.test(f)) return 5
  if (/i7|Ultra 7|Ryzen 7|Pro/.test(f)) return 4
  if (/Apple/.test(f)) return 4
  if (/i5|Ultra 5|Ryzen 5|Core 5/.test(f)) return 3
  if (/i3|Ryzen 3|Core 3/.test(f)) return 2
  return 1
}
const perfScore = (p: Product) => cpuTier(p) * 10 + p.gen * 2 + p.ramGB / 2 + (p.dedicatedGpu ? 12 : 0)

type Row = {
  label: string
  value: (p: Product) => React.ReactNode
  raw?: (p: Product) => string
  bar?: { get: (p: Product) => number; better: "high" | "low"; fmt?: (n: number) => string }
}
const SECTIONS: { title: string; icon: typeof Cpu; rows: Row[] }[] = [
  {
    title: "Price & condition", icon: Wallet, rows: [
      { label: "Price", value: p => <b className="num text-base">{fmt(p.price)}</b>, raw: p => String(p.price), bar: { get: p => p.price, better: "low" } },
      { label: "Condition", value: p => <ConditionBadge p={p} />, raw: p => p.condition },
      { label: "Warranty", value: p => p.condition === "new" ? "1 yr international" : p.condition === "certified" ? "1 yr Fattani" : "3 months, up to 1 yr", raw: p => p.condition },
      { label: "Availability", value: p => <span className={p.inStock ? "font-bold text-ok" : "text-muted-foreground"}>{p.inStock ? "In stock" : "Out of stock"}</span>, raw: p => String(p.inStock) },
    ],
  },
  {
    title: "Performance", icon: Cpu, rows: [
      { label: "Processor", value: p => <span><b className="block">{p.cpuFamily || "—"}{p.gen && !p.cpuFamily.startsWith("Apple") && !p.cpuFamily.includes("Ultra") ? ` · ${ordinal(p.gen)} Gen` : ""}</b><span className="text-xs text-muted-foreground">{p.cpu !== p.cpuFamily ? p.cpu : ""}</span></span>, raw: p => p.cpu, bar: { get: p => cpuTier(p) * 10 + p.gen, better: "high", fmt: () => "" } },
      { label: "Memory", value: p => p.ramGB ? `${p.ramGB}GB` : p.ram || "—", raw: p => String(p.ramGB), bar: { get: p => p.ramGB, better: "high", fmt: n => `${n}GB` } },
      { label: "Storage", value: p => p.storageGB ? `${storageLabel(p.storageGB)} SSD` : p.storage || "—", raw: p => String(p.storageGB), bar: { get: p => p.storageGB, better: "high", fmt: n => storageLabel(n) } },
      { label: "Graphics", value: p => <span className={p.dedicatedGpu ? "font-bold" : ""}>{p.gpuShort || p.gpu || "Integrated"}</span>, raw: p => p.gpuShort || p.gpu },
    ],
  },
  {
    title: "Display & build", icon: Zap, rows: [
      { label: "Screen size", value: p => p.screenIn ? `${p.screenIn}"` : "—", raw: p => String(p.screenIn) },
      { label: "Display", value: p => p.display || "—", raw: p => p.display },
      { label: "Touchscreen", value: p => p.touch ? "Yes" : "No", raw: p => String(p.touch) },
      { label: "Keyboard", value: p => p.keyboard || "—", raw: p => p.keyboard },
      { label: "Operating system", value: p => p.os || "—", raw: p => p.os },
    ],
  },
]

function AddSlot({ onAdd, exclude, compact }: { onAdd: (p: Product) => void; exclude: number[]; compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const results = q ? searchProducts(q, 8).filter(p => !exclude.includes(p.id)) : PRODUCTS.filter(p => p.inStock && !exclude.includes(p.id)).slice(0, 6)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={
        <button className={cn("group grid w-full place-items-center rounded-2xl border-2 border-dashed border-input bg-white/50 text-muted-foreground transition hover:border-brand hover:bg-white hover:text-brand", compact ? "h-full min-h-40" : "aspect-[4/3]")} />
      }>
        <span className="grid place-items-center gap-2 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-paper transition group-hover:bg-brand group-hover:text-white"><Plus className="size-5" /></span>
          <b className="text-sm">Add a laptop</b>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-[min(380px,92vw)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search model or spec…" value={q} onValueChange={setQ} />
          <CommandList>
            <CommandEmpty>No match.</CommandEmpty>
            <CommandGroup heading={q ? "Results" : "Popular right now"}>
              {results.map(p => (
                <CommandItem key={p.id} value={String(p.id)} onSelect={() => { onAdd(p); setOpen(false); setQ("") }} className="gap-3">
                  <Img src={p.images[0]} alt="" className="size-10 rounded-md border bg-white object-contain p-0.5 mix-blend-multiply" />
                  <span className="min-w-0 flex-1"><b className="block truncate text-[13px]">{p.model}</b><span className="block truncate text-[11px] text-muted-foreground">{specChips(p).slice(0, 3).join(" · ")}</span></span>
                  <b className="num text-xs text-brand">{fmt(p.price)}</b>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const SUGGESTED: [string, RegExp[]][] = [
  ["Office favourites", [/ThinkPad T14\b/i, /Latitude 5420/i, /EliteBook 840/i]],
  ["Gaming, brand new", [/Victus 15/i, /Legion/i, /TUF/i]],
  ["Under Rs 60,000", [/ThinkPad T480/i, /Latitude 7400|Latitude 5490/i, /ProBook 650/i]],
]

export default function ComparePage() {
  const { compare, setCompare, toggleCompare, addToCart } = useStore()
  const [sp, setSp] = useSearchParams()
  const [diffOnly, setDiffOnly] = useState(false)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [cardsVisible, setCardsVisible] = useState(true)
  useEffect(() => {
    const f = () => { const r = cardsRef.current?.getBoundingClientRect(); setCardsVisible(!r || r.bottom > (window.innerWidth < 768 ? 120 : 220)) }
    f(); window.addEventListener("scroll", f, { passive: true })
    return () => window.removeEventListener("scroll", f)
  }, [])

  // Shared links (?ids=1,2,3) load into the compare list
  useEffect(() => {
    const ids = (sp.get("ids") ?? "").split(",").map(Number).filter(id => byId.has(id))
    if (ids.length) { setCompare(ids.slice(0, MAX_COMPARE)); setSp({}, { replace: true }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const items = compare.map(id => byId.get(id)!).filter(Boolean)
  const cols = items.length + (items.length < MAX_COMPARE ? 1 : 0)
  const grid = { gridTemplateColumns: `repeat(${Math.max(cols, 2)}, minmax(150px, 1fr))` }

  const winners = useMemo(() => {
    if (items.length < 2) return {} as Record<number, string[]>
    const w: Record<number, string[]> = {}
    const push = (p: Product, t: string) => (w[p.id] = [...(w[p.id] ?? []), t])
    push([...items].sort((a, b) => a.price - b.price)[0], "Best price")
    push([...items].sort((a, b) => perfScore(b) - perfScore(a))[0], "Most powerful")
    push([...items].sort((a, b) => perfScore(b) / b.price - perfScore(a) / a.price)[0], "Best value")
    return w
  }, [items])

  const share = () => {
    const url = `${window.location.origin}/compare?ids=${compare.join(",")}`
    navigator.clipboard?.writeText(url)
    toast.success("Comparison link copied", { description: "Send it to anyone — it opens this exact comparison." })
  }

  if (items.length === 0)
    return (
      <div className="mx-auto max-w-[1100px] px-4 pt-8 pb-16 md:px-6 md:pt-14">
        <Reveal className="text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand"><GitCompareArrows className="size-8" /></span>
          <h1 className="mt-5 text-4xl font-bold md:text-5xl">Compare laptops side by side</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Add up to {MAX_COMPARE} laptops. We'll line up processor, memory, storage and price — and tell you which is the best value.</p>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-sm"><AddSlot onAdd={p => toggleCompare(p.id, p.model)} exclude={[]} /></div>
        <h2 className="mt-14 mb-4 text-center text-sm font-bold text-muted-foreground">Or start with a popular comparison</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {SUGGESTED.map(([title, res]) => {
            const ps = res.map(r => PRODUCTS.find(p => r.test(p.model))).filter(Boolean) as Product[]
            return (
              <button key={title} onClick={() => setCompare(ps.map(p => p.id))} className="group rounded-2xl border bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex -space-x-3">{ps.map(p => <span key={p.id} className="grid size-14 place-items-center rounded-xl border bg-white p-1 shadow-sm"><Img src={p.images[0]} alt="" className="max-h-full mix-blend-multiply" /></span>)}</div>
                <b className="mt-4 block">{title}</b>
                <span className="line-clamp-2 text-sm text-muted-foreground">{ps.map(p => p.model).join(" vs ")}</span>
              </button>
            )
          })}
        </div>
      </div>
    )

  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-5 pb-16 md:px-6 md:pt-8">
      {/* compact bar that slides in once the product cards scroll away */}
      <div className={cn("fixed inset-x-0 top-14 z-30 border-b bg-white/95 backdrop-blur-xl transition duration-300 md:top-[148px]", cardsVisible ? "pointer-events-none -translate-y-2 opacity-0" : "opacity-100")}>
        <div className="mx-auto grid max-w-[1320px] gap-3 px-4 py-2.5 md:px-10" style={{ gridTemplateColumns: `repeat(${Math.max(cols, 2)}, minmax(0, 1fr))` }}>
          {items.map(p => (
            <div key={p.id} className="flex min-w-0 items-center gap-2.5">
              <Img src={p.images[0]} alt="" className="size-10 shrink-0 rounded-lg border bg-white object-contain p-0.5 mix-blend-multiply max-sm:hidden" />
              <div className="min-w-0"><b className="block truncate text-[13px]">{p.model}</b><span className="num text-xs font-bold text-brand">{fmt(p.price)}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-brand max-md:hidden">Compare</span>
          <h1 className="mt-1 text-[32px] leading-none font-bold md:text-5xl">{items.length} laptops, side by side</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Label className="flex h-10 cursor-pointer items-center gap-2.5 rounded-full border bg-white px-4 text-sm font-bold"><Switch checked={diffOnly} onCheckedChange={(v: boolean) => setDiffOnly(v)} />Only differences</Label>
          <Button variant="outline" onClick={share} className="h-10 rounded-full bg-white px-4 font-bold"><Link2 />Share</Button>
          <Button variant="outline" onClick={() => setCompare([])} className="h-10 rounded-full bg-white px-4 font-bold text-destructive"><Trash2 />Clear</Button>
        </div>
      </div>

      <div className="thin-scroll -mx-4 mt-6 overflow-x-auto px-4 pb-4 md:mx-0 md:overflow-visible md:px-0">
        <div className="min-w-fit">
          {/* product cards */}
          <div ref={cardsRef} className="pt-1 pb-3">
            <div className="grid gap-3" style={grid}>
              {items.map(p => (
                <div key={p.id} className="relative flex flex-col rounded-2xl border bg-white p-3 md:p-4">
                  <button aria-label={`Remove ${p.model}`} onClick={() => toggleCompare(p.id, p.model)} className="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-paper hover:bg-deal hover:text-white"><X className="size-3.5" /></button>
                  <Link to={`/product/${p.slug}`} viewTransition className="grid aspect-[4/3] place-items-center"><Img src={p.images[0]} alt={p.model} className="max-h-full object-contain mix-blend-multiply" /></Link>
                  <div className="mt-2 flex items-center gap-1.5"><BrandMark brand={p.brand} className="h-3.5 w-4" colored={false} /><span className="eyebrow !text-[10px] text-muted-foreground">{p.brand}</span></div>
                  <Link to={`/product/${p.slug}`} viewTransition className="mt-1 line-clamp-2 min-h-[2.6em] text-[14px] leading-tight font-extrabold hover:text-brand">{p.model}</Link>
                  <div className="mt-2 flex flex-wrap gap-1">{(winners[p.id] ?? []).map(t => <span key={t} className="flex items-center gap-1 rounded-md bg-gold/20 px-1.5 py-0.5 text-[10.5px] font-extrabold text-[#7a5600]">{t === "Best value" ? <Award className="size-3" /> : <Trophy className="size-3" />}{t}</span>)}</div>
                  <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                    <Price p={p} size="sm" />
                    <Button size="icon" onClick={() => addToCart(p)} aria-label={`Add ${p.model} to cart`} className="size-9 rounded-lg bg-ink"><Plus /></Button>
                  </div>
                </div>
              ))}
              {items.length < MAX_COMPARE && <AddSlot compact onAdd={p => toggleCompare(p.id, p.model)} exclude={compare} />}
            </div>
          </div>

          {/* spec sections */}
          {SECTIONS.map(sec => {
            const rows = sec.rows.filter(r => !diffOnly || !r.raw || new Set(items.map(r.raw)).size > 1)
            if (!rows.length) return null
            return (
              <section key={sec.title} className="mt-6">
                <h2 className="mb-2 flex items-center gap-2 px-1 text-lg font-bold"><sec.icon className="size-5 text-brand" />{sec.title}</h2>
                <div className="overflow-hidden rounded-2xl border bg-white">
                  {rows.map(r => {
                    const vals = r.bar ? items.map(r.bar.get) : []
                    const max = Math.max(...vals, 1)
                    const bestVal = r.bar ? (r.bar.better === "high" ? Math.max(...vals) : Math.min(...vals)) : null
                    const allSame = new Set(vals).size <= 1
                    return (
                      <div key={r.label} className="border-b last:border-b-0">
                        <div className="sticky left-0 w-fit px-4 pt-3 font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">{r.label}</div>
                        <div className="grid gap-3 px-4 pt-1.5 pb-3.5" style={grid}>
                          {items.map((p, k) => {
                            const best = r.bar && !allSame && vals[k] === bestVal
                            return (
                              <div key={p.id} className="min-w-0 text-[14px]">
                                <div className="flex items-start gap-1.5">{r.value(p)}{best && <span className="ml-auto shrink-0 rounded bg-ok/10 px-1.5 py-0.5 text-[10px] font-extrabold text-ok">Best</span>}</div>
                                {r.bar && vals[k] > 0 && (
                                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div className={cn("h-full rounded-full transition-all duration-700", best ? "bg-ok" : "bg-brand/50")} style={{ width: `${r.bar.better === "low" ? (Math.min(...vals) / vals[k]) * 100 : (vals[k] / max) * 100}%` }} />
                                  </div>
                                )}
                              </div>
                            )
                          })}
                          {items.length < MAX_COMPARE && <div />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border bg-white p-6 text-center md:flex-row md:text-left">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand"><Search className="size-5" /></span>
        <div className="flex-1"><b className="block">Still deciding?</b><span className="text-sm text-muted-foreground">Tell us your budget and what you'll use it for — our team will recommend the right machine on WhatsApp.</span></div>
        <Button nativeButton={false} render={<Link to="/shop" viewTransition />} variant="outline" className="h-11 rounded-full px-5 font-bold">Keep browsing</Button>
      </div>
    </div>
  )
}
