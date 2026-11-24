import raw from "@/data/products.json"
import type { Product } from "./catalog-core"
import { storageLabel } from "./catalog-core"
export * from "./catalog-core"

export const PRODUCTS = raw as Product[]
export const bySlug = new Map(PRODUCTS.map(p => [p.slug, p]))
export const byId = new Map(PRODUCTS.map(p => [p.id, p]))

export function searchProducts(q: string, limit = 8): Product[] {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return PRODUCTS.filter(p => {
    const hay = `${p.model} ${p.brand} ${p.title} ${p.cpuFamily} ${p.ramGB}gb ${storageLabel(p.storageGB)} ${p.gpuShort} ${p.type} ${p.condition}`.toLowerCase()
    return terms.every(t => hay.includes(t))
  }).slice(0, limit)
}

export function similar(p: Product, n = 8): Product[] {
  return PRODUCTS.filter(x => x.id !== p.id && x.type === p.type)
    .map(x => ({ x, d: Math.abs(x.price - p.price) / p.price + (x.brand === p.brand ? -0.15 : 0) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map(o => o.x)
}

const pickFeatured = (f: (p: Product) => boolean, n: number) => PRODUCTS.filter(p => p.inStock && f(p)).slice(0, n)
export const HOME_COLLECTIONS = {
  arrivals: pickFeatured(() => true, 7),
  gaming: pickFeatured(p => p.type === "gaming" && p.condition === "new", 7),
  business: pickFeatured(p => p.type === "business" && p.condition !== "new" && p.gen >= 11, 7),
  budget: [...PRODUCTS].filter(p => p.inStock && p.price <= 100000 && p.ramGB >= 8 && p.gen >= 8).sort((a, b) => b.gen - a.gen).slice(0, 7),
  apple: pickFeatured(p => p.type === "macbook", 7),
}
