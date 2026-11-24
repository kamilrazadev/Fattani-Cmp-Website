import Link from "next/link"
import { BadgeCheck, Gamepad2, Laptop, Sparkles, Apple, School, ChevronDown } from "lucide-react"
import { BRANDS } from "@/lib/catalog-core"
import stats from "@/data/stats.json"

const CATS = [
  { to: "/shop?cond=new", icon: Sparkles, label: "Brand new laptops", sub: "Latest models, 1 yr international warranty" },
  { to: "/shop?cond=used", icon: Laptop, label: "Used business laptops", sub: "Tested ThinkPad, Latitude & EliteBook" },
  { to: "/shop?cond=certified", icon: BadgeCheck, label: "Certified used", sub: "1 year Fattani warranty included" },
  { to: "/shop?type=gaming", icon: Gamepad2, label: "Gaming & workstation", sub: "RTX 50-series, ZBook, Precision" },
  { to: "/shop?type=macbook", icon: Apple, label: "MacBooks", sub: "Air & Pro with Apple silicon" },
  { to: "/shop?type=chromebook", icon: School, label: "Chromebooks", sub: "Ideal for schools and students" },
]
const BUDGETS = [["Under Rs 50,000", 0, 50000], ["Rs 50k – 100k", 50000, 100000], ["Rs 100k – 200k", 100000, 200000], ["Rs 200k – 350k", 200000, 350000], ["Above Rs 350k", 350000, 2000000]] as const

const trigger = "flex h-10 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-ink transition hover:bg-white group-hover:bg-white group-focus-within:bg-white"
const panel = "invisible absolute top-full left-0 z-50 translate-y-1 rounded-2xl border bg-popover opacity-0 shadow-2xl ring-1 ring-black/5 transition duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 max-lg:hidden lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100"

/** Hover/focus mega-menu built with plain CSS (no client JS), server-rendered so every link is in the HTML. */
export function MegaNav() {
  return (
    <ul className="flex items-center gap-1">
      <li className="group relative">
        <Link href="/shop" className={trigger}>Laptops<ChevronDown className="size-3.5 opacity-60" aria-hidden /></Link>
        <div className={panel}>
          <div className="grid w-[760px] grid-cols-[1.3fr_1fr] gap-2 p-2">
            <ul className="grid grid-cols-2 gap-1">
              {CATS.map(c => (
                <li key={c.to}>
                  <Link href={c.to} className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted focus-visible:bg-muted">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand"><c.icon className="size-[18px]" aria-hidden /></span>
                    <span><b className="block text-sm">{c.label}</b><span className="text-xs leading-snug text-muted-foreground">{c.sub}</span></span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rounded-xl bg-paper p-3">
              <p className="eyebrow mb-2 px-1 text-muted-foreground">Shop by brand</p>
              <ul className="grid grid-cols-2 gap-1.5">
                {BRANDS.map(b => (
                  <li key={b}>
                    <Link href={`/shop?brand=${b}`} className="flex items-center gap-2.5 rounded-lg bg-white p-2.5 ring-1 ring-border hover:ring-brand/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/brands/${b.toLowerCase()}.svg`} alt="" width={24} height={24} className="h-5 w-6" loading="lazy" />
                      <span className="text-sm font-bold">{b}</span>
                      <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">{(stats.brands as Record<string, number>)[b] ?? 0}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </li>
      <li className="group relative">
        <Link href="/shop" className={trigger}>By budget<ChevronDown className="size-3.5 opacity-60" aria-hidden /></Link>
        <div className={panel}>
          <ul className="grid w-[420px] grid-cols-2 gap-1 p-2">
            {BUDGETS.map(([l, a, b], i) => (
              <li key={l}>
                <Link href={`/shop?min=${a}&max=${b}`} className="block rounded-lg p-3 hover:bg-muted focus-visible:bg-muted">
                  <b className="block text-sm">{l}</b>
                  <span className="text-xs text-muted-foreground">{stats.ranges[i]} laptops</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </ul>
  )
}
