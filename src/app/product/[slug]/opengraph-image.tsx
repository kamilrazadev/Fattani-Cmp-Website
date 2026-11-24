import { ogCard, OG_SIZE } from "@/lib/og"
import { bySlug, fmt, CONDITION_LABEL } from "@/lib/products"
import details from "@/data/product-details.json"

export const alt = "Laptop at Fattani Computers"
export const size = OG_SIZE
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = bySlug.get(slug)!
  const d = (details as Record<string, { images: string[] }>)[slug]
  return ogCard({
    eyebrow: CONDITION_LABEL[p.condition],
    title: p.model,
    lines: [[p.cpu.replace("Intel ", ""), p.ram, p.storage].join(" · ")],
    price: fmt(p.price),
    photo: d?.images[0],
  })
}
