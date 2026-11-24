"use client"

import { Link } from "@/lib/router"
import { GitCompareArrows, Heart, Plus, ShieldCheck, Sparkles, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BrandMark } from "@/components/logos"
import { fmt, savePct, specChips, type Product } from "@/lib/catalog-core"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Img } from "@/components/img"

export function ConditionBadge({ p, className }: { p: Product; className?: string }) {
  if (p.condition === "new") return <Badge className={cn("gap-1 bg-ink text-white", className)}><Sparkles className="size-3" />Brand new</Badge>
  if (p.condition === "certified") return <Badge className={cn("gap-1 bg-ok/10 text-ok ring-1 ring-ok/25", className)}><ShieldCheck className="size-3" />1-yr warranty</Badge>
  return <Badge variant="secondary" className={cn("bg-white/90 text-ink-2 ring-1 ring-border", className)}>Used · tested</Badge>
}

export function Price({ p, size = "md", className }: { p: Product; size?: "sm" | "md" | "lg"; className?: string }) {
  const big = size === "lg" ? "text-4xl" : size === "md" ? "text-[clamp(15px,9cqw,22px)]" : "text-lg"
  return (
    <div className={cn("num leading-none", className)}>
      {p.was > 0 && <s className="mb-1 block text-[13px] font-semibold text-muted-foreground">{fmt(p.was)}</s>}
      <span className={cn("font-heading font-bold tracking-tight", big)}>
        <span className="mr-0.5 text-[0.55em] font-bold">Rs</span>{p.price.toLocaleString("en-PK")}
      </span>
    </div>
  )
}

function IconToggle({ on, label, onClick, children }: { on: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={on}
      onClick={e => { e.preventDefault(); e.stopPropagation(); onClick() }}
      className={cn("grid size-9 place-items-center rounded-full bg-white/95 text-ink-2 shadow-sm ring-1 ring-black/5 transition hover:scale-105 hover:text-ink", on && "bg-ink text-white ring-ink hover:text-white")}
    >
      {children}
    </button>
  )
}

export function ProductCard({ p, className, layout = "grid", priority }: { p: Product; className?: string; layout?: "grid" | "list"; priority?: boolean }) {
  const { addToCart, toggleWish, toggleCompare, wishlist, compare, cart } = useStore()
  const inCart = cart.some(l => l.id === p.id)
  const wished = wishlist.includes(p.id)
  const comparing = compare.includes(p.id)
  const pct = savePct(p)
  const list = layout === "list"

  return (
    <article className={cn("group relative flex overflow-hidden rounded-2xl border bg-card transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_2px_6px_rgba(10,26,34,.05),0_18px_40px_-14px_rgba(10,26,34,.22)]", list ? "flex-row" : "flex-col", className)}>
      <Link to={`/product/${p.slug}`} viewTransition className={cn("relative block shrink-0 overflow-hidden bg-gradient-to-b from-white to-paper", list ? "w-40 sm:w-56" : "aspect-[5/4]")}>
        <Img
          src={p.images[0]}
          alt={p.model}
          fill
          sizes={list ? "224px" : "(min-width:1280px) 22vw, (min-width:768px) 32vw, 48vw"}
          priority={priority}
          className="absolute inset-0 size-full object-contain p-5 mix-blend-multiply transition duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
          {pct > 0 && <Badge className="bg-deal text-white">-{pct}%</Badge>}
          <ConditionBadge p={p} />
        </div>
        {!p.inStock && <span className="absolute inset-x-3 bottom-3 rounded-lg bg-white/90 py-1 text-center text-xs font-bold text-muted-foreground">Out of stock · ask us</span>}
      </Link>

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 transition md:translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 data-[on=true]:translate-x-0 data-[on=true]:opacity-100" data-on={wished || comparing}>
        <IconToggle on={wished} label={wished ? "Saved" : "Save to wishlist"} onClick={() => toggleWish(p.id, p.model)}>
          <Heart className={cn("size-4", wished && "fill-current")} />
        </IconToggle>
        <IconToggle on={comparing} label={comparing ? "In compare" : "Add to compare"} onClick={() => toggleCompare(p.id, p.model)}>
          <GitCompareArrows className="size-4" />
        </IconToggle>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BrandMark brand={p.brand} className="h-3.5 w-auto" colored={false} />
          <span className="eyebrow !text-[10.5px]">{p.brand}</span>
        </div>
        <Link to={`/product/${p.slug}`} viewTransition className="mt-1.5 line-clamp-2 text-[15.5px] leading-snug font-extrabold tracking-tight hover:text-brand">
          {p.model}
        </Link>
        <ul className="mt-2.5 mb-4 flex flex-wrap gap-1">
          {specChips(p).map(c => (
            <li key={c} className="rounded-md border bg-paper px-1.5 py-0.5 font-mono text-[10.5px] font-medium text-ink-2">{c}</li>
          ))}
        </ul>
        <div className="@container mt-auto flex items-end justify-between gap-2">
          <Price p={p} size="md" className="min-w-0 flex-1 whitespace-nowrap" />
          <button
            type="button"
            onClick={() => addToCart(p)}
            aria-label={`Add ${p.model} to cart`}
            className={cn("grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-white transition hover:bg-brand active:scale-95", inCart && "bg-ok hover:bg-ok")}
          >
            {inCart ? <Check className="size-5" /> : <Plus className="size-5" />}
          </button>
        </div>
      </div>
    </article>
  )
}
