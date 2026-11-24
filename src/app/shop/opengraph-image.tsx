import { ogCard, OG_SIZE } from "@/lib/og"
import { PRODUCTS } from "@/lib/products"

export const alt = "Laptops for sale in Pakistan — Fattani Computers"
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return ogCard({
    eyebrow: "Shop",
    title: "Laptops for sale in Pakistan",
    lines: [`${PRODUCTS.length}+ tested laptops: Dell, HP, Lenovo, Apple and more`, "Warranty included · Delivery across Pakistan"],
  })
}
