import type { MetadataRoute } from "next"
import { PRODUCTS } from "@/lib/products"
import { abs } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: abs("/shop"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...PRODUCTS.map(p => ({ url: abs(`/product/${p.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
  ]
}
