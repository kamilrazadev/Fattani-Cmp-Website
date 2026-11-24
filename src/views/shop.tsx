"use client"

import { useMemo, useState } from "react"
import { Link, useSearchParams } from "@/lib/router"
import { ArrowDownUp, LayoutGrid, List, PackageSearch, Search, SlidersHorizontal, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Label } from "@/components/ui/label"
import { ProductCard } from "@/components/product-card"
import { BrandMark } from "@/components/logos"
import { ResponsivePanel } from "@/components/layout/overlays"
import { BRANDS, CONDITION_LABEL, PRODUCTS, TYPE_LABEL, USE_CASES, fmt, storageLabel, type Product } from "@/lib/products"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const PRICE_MAX = Math.ceil(Math.max(...PRODUCTS.map(p => p.price)) / 10000) * 10000
const CPU_FAMILIES = ["Core i3", "Core i5", "Core i7", "Core i9", "Core Ultra", "Ryzen", "Apple M"]
const RAM_OPTS = ["8", "16", "32"]
const STORAGE_OPTS = ["256", "512", "1024"]
const SCREEN_OPTS = [["13", "≤ 13\""], ["14", "14\""], ["15", "15.6\""], ["16", "16\"+"]]
const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest-gen", label: "Newest processor" },
  { value: "ram", label: "Most memory" },
  { value: "savings", label: "Biggest savings" },
]
const PAGE = 24

type Params = ReturnType<typeof useSearchParams>[0]
const screenMatch = (s: string, p: Product) =>
  s === "13" ? p.screenIn > 0 && p.screenIn <= 13.5 : s === "14" ? p.screenIn > 13.5 && p.screenIn < 15 : s === "15" ? p.screenIn >= 15 && p.screenIn < 16 : p.screenIn >= 16
const list = (sp: Params, k: string) => (sp.get(k) ? sp.get(k)!.split(",").filter(Boolean) : [])

function applyFilters(sp: Params, wishlist: number[], skip?: string) {
  const q = (sp.get("q") ?? "").toLowerCase().trim()
  const brands = list(sp, "brand"), conds = list(sp, "cond"), types = list(sp, "type"), cpus = list(sp, "cpu")
  const uses = list(sp, "use"), screens = list(sp, "screen")
  const min = +(sp.get("min") ?? 0), max = +(sp.get("max") ?? PRICE_MAX)
  const ram = +(sp.get("ram") ?? 0), storage = +(sp.get("storage") ?? 0)
  return PRODUCTS.filter(p => {
    if (q && !q.split(/\s+/).every(t => `${p.model} ${p.title} ${p.brand} ${p.cpuFamily} ${p.ramGB}gb ${p.gpuShort}`.toLowerCase().includes(t))) return false
    if (skip !== "brand" && brands.length && !brands.includes(p.brand)) return false
    if (skip !== "cond" && conds.length && !conds.includes(p.condition)) return false
    if (skip !== "type" && types.length && !types.includes(p.type)) return false
    if (skip !== "cpu" && cpus.length && !cpus.some(c => p.cpuFamily.startsWith(c))) return false
    if (uses.length && !uses.some(u => USE_CASES.find(x => x.id === u)?.test(p))) return false
    if (p.price < min || p.price > max) return false
    if (ram && p.ramGB < ram) return false
    if (storage && p.storageGB < storage) return false
    if (skip !== "screen" && screens.length && !screens.some(s => screenMatch(s, p))) return false
    if (sp.get("gpu") && !p.dedicatedGpu) return false
    if (sp.get("touch") && !p.touch) return false
    if (sp.get("deals") && !p.was) return false
    if (sp.get("stock") && !p.inStock) return false
    if (sp.get("saved") && !wishlist.includes(p.id)) return false
    return true
  })
}

function sortProducts(items: Product[], sort: string) {
  const s = [...items]
  if (sort === "price-asc") s.sort((a, b) => a.price - b.price)
  else if (sort === "price-desc") s.sort((a, b) => b.price - a.price)
  else if (sort === "newest-gen") s.sort((a, b) => b.gen - a.gen || b.price - a.price)
  else if (sort === "ram") s.sort((a, b) => b.ramGB - a.ramGB || a.price - b.price)
  else if (sort === "savings") s.sort((a, b) => (b.was ? b.was - b.price : 0) - (a.was ? a.was - a.price : 0))
  else s.sort((a, b) => Number(b.inStock) - Number(a.inStock))
  return s
}

function FilterPanel({ sp, set, wishlist }: { sp: Params; set: (k: string, v: string | null) => void; wishlist: number[] }) {
  const toggleIn = (k: string, v: string) => {
    const cur = list(sp, k)
    set(k, (cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]).join(",") || null)
  }
  const countFor = (k: string, f: (p: Product) => boolean) => applyFilters(sp, wishlist, k).filter(f).length
  const [price, setPrice] = useState<number[]>([+(sp.get("min") ?? 0), +(sp.get("max") ?? PRICE_MAX)])

  const CheckRow = ({ k, v, label, n, icon }: { k: string; v: string; label: string; n: number; icon?: React.ReactNode }) => (
    <Label className={cn("flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[14px] font-semibold hover:bg-muted", n === 0 && !list(sp, k).includes(v) && "opacity-45")}>
      <Checkbox aria-label={label} checked={list(sp, k).includes(v)} onCheckedChange={() => toggleIn(k, v)} />
      {icon}<span className="flex-1">{label}</span><span className="num font-mono text-[11px] text-muted-foreground">{n}</span>
    </Label>
  )
  const Chips = ({ k, opts }: { k: string; opts: [string, string][] }) => (
    <ToggleGroup
      value={sp.get(k) ? [sp.get(k)!] : []}
      onValueChange={(v: string[]) => set(k, v[v.length - 1] ?? null)}
      className="flex w-full flex-wrap gap-1.5"
      spacing={6}
    >
      {opts.map(([v, l]) => <ToggleGroupItem key={v} value={v} variant="outline" className="h-9 flex-1 rounded-lg px-3 text-[13px] font-bold data-pressed:border-ink data-pressed:bg-ink data-pressed:text-white">{l}</ToggleGroupItem>)}
    </ToggleGroup>
  )

  return (
    <>
    <h2 className="sr-only">Filter laptops</h2>
    <Accordion multiple defaultValue={["price", "cond", "brand", "type"]} className="w-full">
      <AccordionItem value="price">
        <AccordionTrigger className="text-[15px] font-bold hover:no-underline">Price</AccordionTrigger>
        <AccordionContent className="px-1 pt-2">
          <Slider
            min={0} max={PRICE_MAX} step={5000} value={price}
            onValueChange={(v: number | readonly number[]) => setPrice([...(v as number[])])}
            onValueCommitted={(v: number | readonly number[]) => { const [a, b] = v as number[]; set("min", a > 0 ? String(a) : null); set("max", b < PRICE_MAX ? String(b) : null) }}
            className="[&_[data-slot=slider-range]]:bg-brand [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-brand [&_[data-slot=slider-track]]:h-1.5"
          />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {price.map((v, k) => <div key={k} className="rounded-lg border bg-white px-3 py-2"><span className="block text-[10px] font-bold text-muted-foreground uppercase">{k ? "Max" : "Min"}</span><b className="num text-sm">{fmt(v)}</b></div>)}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="cond">
        <AccordionTrigger className="text-[15px] font-bold hover:no-underline">Condition</AccordionTrigger>
        <AccordionContent className="grid gap-0.5">
          {(Object.keys(CONDITION_LABEL) as (keyof typeof CONDITION_LABEL)[]).map(c => <CheckRow key={c} k="cond" v={c} label={CONDITION_LABEL[c]} n={countFor("cond", p => p.condition === c)} />)}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="brand">
        <AccordionTrigger className="text-[15px] font-bold hover:no-underline">Brand</AccordionTrigger>
        <AccordionContent className="grid gap-0.5">
          {BRANDS.map(b => <CheckRow key={b} k="brand" v={b} label={b} n={countFor("brand", p => p.brand === b)} icon={<BrandMark brand={b} className="h-4 w-5" />} />)}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="type">
        <AccordionTrigger className="text-[15px] font-bold hover:no-underline">Category</AccordionTrigger>
        <AccordionContent className="grid gap-0.5">
          {(Object.keys(TYPE_LABEL) as (keyof typeof TYPE_LABEL)[]).map(t => <CheckRow key={t} k="type" v={t} label={TYPE_LABEL[t]} n={countFor("type", p => p.type === t)} />)}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="cpu">
        <AccordionTrigger className="text-[15px] font-bold hover:no-underline">Processor</AccordionTrigger>
        <AccordionContent className="grid gap-0.5">
          {CPU_FAMILIES.map(c => <CheckRow key={c} k="cpu" v={c} label={c === "Apple M" ? "Apple M-series" : c} n={countFor("cpu", p => p.cpuFamily.startsWith(c))} />)}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="ram">
        <AccordionTrigger className="text-[15px] font-bold hover:no-underline">Memory (at least)</AccordionTrigger>
        <AccordionContent className="pt-1"><Chips k="ram" opts={RAM_OPTS.map(r => [r, `${r}GB`])} /></AccordionContent>
      </AccordionItem>
      <AccordionItem value="storage">
        <AccordionTrigger className="text-[15px] font-bold hover:no-underline">Storage (at least)</AccordionTrigger>
        <AccordionContent className="pt-1"><Chips k="storage" opts={STORAGE_OPTS.map(s => [s, storageLabel(+s)])} /></AccordionContent>
      </AccordionItem>
      <AccordionItem value="screen">
        <AccordionTrigger className="text-[15px] font-bold hover:no-underline">Screen size</AccordionTrigger>
        <AccordionContent className="grid gap-0.5">
          {SCREEN_OPTS.map(([v, l]) => <CheckRow key={v} k="screen" v={v} label={l} n={countFor("screen", p => screenMatch(v, p))} />)}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="more" className="border-b-0">
        <AccordionTrigger className="text-[15px] font-bold hover:no-underline">Features</AccordionTrigger>
        <AccordionContent className="grid gap-3 pt-1">
          {[["gpu", "Dedicated graphics"], ["touch", "Touchscreen / 2-in-1"], ["deals", "On sale"], ["stock", "In stock only"]].map(([k, l]) => (
            <Label key={k} className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-[14px] font-semibold">
              {l}<Switch checked={!!sp.get(k)} onCheckedChange={(v: boolean) => set(k, v ? "1" : null)} />
            </Label>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </>
  )
}

export default function ShopPage() {
  const [sp, setSp] = useSearchParams()
  const { wishlist } = useStore()
  const [shown, setShown] = useState(PAGE)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [query, setQuery] = useState(sp.get("q") ?? "")
  const view = sp.get("view") === "list" ? "list" : "grid"
  const sort = sp.get("sort") ?? "featured"

  const set = (k: string, v: string | null) => {
    setSp(prev => { const n = new URLSearchParams(prev); if (v === null || v === "") n.delete(k); else n.set(k, v); return n }, { replace: true })
    setShown(PAGE)
  }
  const results = useMemo(() => sortProducts(applyFilters(sp, wishlist), sort), [sp, wishlist, sort])

  const active: { k: string; v?: string; label: string }[] = []
  for (const k of ["brand", "cond", "type", "cpu", "use", "screen"]) for (const v of list(sp, k)) {
    const label = k === "cond" ? CONDITION_LABEL[v as keyof typeof CONDITION_LABEL] : k === "type" ? TYPE_LABEL[v as keyof typeof TYPE_LABEL] : k === "use" ? USE_CASES.find(u => u.id === v)?.label ?? v : k === "screen" ? SCREEN_OPTS.find(s => s[0] === v)?.[1] ?? v : v
    active.push({ k, v, label: label ?? v })
  }
  if (sp.get("min") || sp.get("max")) active.push({ k: "price", label: `${fmt(+(sp.get("min") ?? 0))} – ${fmt(+(sp.get("max") ?? PRICE_MAX))}` })
  if (sp.get("ram")) active.push({ k: "ram", label: `${sp.get("ram")}GB+ RAM` })
  if (sp.get("storage")) active.push({ k: "storage", label: `${storageLabel(+sp.get("storage")!)}+ storage` })
  for (const [k, l] of [["gpu", "Dedicated graphics"], ["touch", "Touchscreen"], ["deals", "On sale"], ["stock", "In stock"], ["saved", "Wishlist"], ["q", `“${sp.get("q")}”`]]) if (sp.get(k)) active.push({ k, label: l })

  const removeChip = (c: (typeof active)[number]) => {
    if (c.k === "price") { set("min", null); set("max", null); return }
    if (c.v) { const cur = list(sp, c.k).filter(x => x !== c.v); set(c.k, cur.join(",") || null) }
    else { set(c.k, null); if (c.k === "q") setQuery("") }
  }
  const clearAll = () => { setSp(sp.get("view") ? { view: sp.get("view")! } : {}, { replace: true }); setQuery("") }

  const heading = sp.get("saved") ? "Your wishlist" : sp.get("type") === "gaming" ? "Gaming laptops" : sp.get("type") === "macbook" ? "MacBooks" : sp.get("cond") === "new" ? "Brand new laptops" : sp.get("brand") && list(sp, "brand").length === 1 ? `${sp.get("brand")} laptops` : "All laptops"

  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-5 pb-10 md:px-6 md:pt-8">
      <Breadcrumb className="max-md:hidden">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{heading}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-4 md:mt-4">
        <div>
          <h1 className="text-[32px] leading-none font-bold md:text-5xl">{heading}</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground"><b className="num text-ink">{results.length}</b> of {PRODUCTS.length} laptops · prices in PKR, updated November 2026</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); set("q", query.trim() || null) }} className="relative w-full md:w-80">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search within results" className="h-11 w-full rounded-full border border-input bg-white pr-4 pl-11 text-sm font-medium outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" />
        </form>
      </div>

      {/* Use-case quick chips */}
      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {USE_CASES.map(u => {
          const on = list(sp, "use").includes(u.id)
          return (
            <button key={u.id} onClick={() => set("use", on ? list(sp, "use").filter(x => x !== u.id).join(",") || null : [...list(sp, "use"), u.id].join(","))}
              className={cn("flex h-10 shrink-0 items-center gap-2 rounded-full border bg-white px-4 text-[13.5px] font-bold transition", on ? "border-ink bg-ink text-white" : "hover:border-ink/40")}>
              <u.icon className="size-4" />{u.label}
            </button>
          )
        })}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-[150px] max-h-[calc(100vh-170px)] overflow-y-auto rounded-2xl border bg-white px-4 thin-scroll">
            <div className="flex items-center justify-between border-b py-4"><b className="flex items-center gap-2"><SlidersHorizontal className="size-4" />Filters</b>{active.length > 0 && <button onClick={clearAll} className="text-xs font-bold text-brand hover:underline">Clear all</button>}</div>
            <FilterPanel sp={sp} set={set} wishlist={wishlist} />
          </div>
        </aside>

        <div className="min-w-0">
          {/* toolbar */}
          <div className="sticky top-14 z-20 -mx-4 mb-4 flex items-center gap-2 border-b bg-background/90 px-4 py-2.5 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
            <Button variant="outline" onClick={() => setFiltersOpen(true)} className="h-10 flex-1 rounded-full font-bold lg:hidden"><SlidersHorizontal />Filters{active.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-ink text-[10px] text-white">{active.length}</span>}</Button>
            <Button variant="outline" onClick={() => setSortOpen(true)} className="h-10 flex-1 rounded-full font-bold md:hidden"><ArrowDownUp />Sort</Button>
            <div className="hidden flex-1 flex-wrap gap-1.5 md:flex">
              {active.map(c => (
                <button key={c.k + (c.v ?? "")} onClick={() => removeChip(c)} className="flex h-8 items-center gap-1.5 rounded-full bg-ink px-3 text-xs font-bold text-white transition hover:bg-deal">{c.label}<X className="size-3.5" /></button>
              ))}
              {active.length > 1 && <button onClick={clearAll} className="h-8 px-2 text-xs font-bold text-brand hover:underline">Clear all</button>}
            </div>
            <Select value={sort} onValueChange={(v: string | null) => set("sort", v === "featured" || !v ? null : v)} items={SORTS}>
              <SelectTrigger aria-label="Sort laptops" className="hidden h-10 w-52 rounded-full bg-white px-4 font-bold md:flex"><SelectValue /></SelectTrigger>
              <SelectContent>{SORTS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
            <div role="radiogroup" aria-label="Layout" className="hidden h-10 items-center rounded-full border bg-white p-1 md:flex">
              {([["grid", LayoutGrid, "Grid view"], ["list", List, "List view"]] as const).map(([v, Icon, l]) => (
                <button key={v} role="radio" aria-checked={view === v} aria-label={l} onClick={() => set("view", v === "list" ? "list" : null)}
                  className={cn("grid h-8 w-10 place-items-center rounded-full transition", view === v ? "bg-ink text-white" : "text-muted-foreground hover:text-ink")}><Icon className="size-4" /></button>
              ))}
            </div>
          </div>

          {results.length === 0 ? (
            <div className="grid place-items-center rounded-3xl border-2 border-dashed bg-white/60 px-6 py-20 text-center">
              <span className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand"><PackageSearch className="size-8" /></span>
              <h2 className="mt-5 text-2xl font-bold">{sp.get("saved") ? "No saved laptops yet" : "No exact match"}</h2>
              <p className="mt-2 max-w-sm text-muted-foreground">{sp.get("saved") ? "Tap the heart on any laptop to save it here." : "Try removing a filter — or ask us on WhatsApp, new stock arrives every week."}</p>
              <Button onClick={clearAll} className="mt-6 h-11 rounded-full px-6 font-bold">Clear filters</Button>
            </div>
          ) : (
            <>
              <div className={cn("grid gap-3 md:gap-4", view === "grid" ? "grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
                {results.slice(0, shown).map((p, k) => (
                  <div key={p.id}>
                    <ProductCard p={p} layout={view} priority={k < 4} className="h-full" />
                  </div>
                ))}
              </div>
              <div className="mt-10 grid place-items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground">Showing <b className="num text-ink">{Math.min(shown, results.length)}</b> of <b className="num text-ink">{results.length}</b></span>
                <div className="h-1 w-52 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(Math.min(shown, results.length) / results.length) * 100}%` }} /></div>
                {shown < results.length && <Button variant="outline" onClick={() => setShown(s => s + PAGE)} className="mt-2 h-12 rounded-full bg-white px-8 font-bold">Load {Math.min(PAGE, results.length - shown)} more</Button>}
              </div>
            </>
          )}
        </div>
      </div>

      <ResponsivePanel open={filtersOpen} onOpenChange={setFiltersOpen} title="Filters" description={`${results.length} laptops match`}
        footer={<div className="flex gap-2"><Button variant="outline" onClick={clearAll} className="h-12 flex-1 rounded-xl font-bold">Clear all</Button><Button onClick={() => setFiltersOpen(false)} className="h-12 flex-[2] rounded-xl font-bold">Show {results.length} laptops</Button></div>}>
        <FilterPanel sp={sp} set={set} wishlist={wishlist} />
      </ResponsivePanel>
      <ResponsivePanel open={sortOpen} onOpenChange={setSortOpen} title="Sort by">
        <ul className="grid gap-1 pb-4">
          {SORTS.map(s => (
            <li key={s.value}><button onClick={() => { set("sort", s.value === "featured" ? null : s.value); setSortOpen(false) }} className={cn("flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left font-bold", sort === s.value ? "bg-ink text-white" : "hover:bg-muted")}>{s.label}{sort === s.value && <span className="text-xs">Selected</span>}</button></li>
          ))}
        </ul>
      </ResponsivePanel>
    </div>
  )
}
