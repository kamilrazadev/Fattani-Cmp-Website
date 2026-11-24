import { ogCard, OG_SIZE } from "@/lib/og"

export const alt = "Fattani Computers — laptops in Karachi since 1997"
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return ogCard({
    eyebrow: "Karachi · Since 1997",
    title: "Laptops you can trust.",
    lines: ["New, certified and tested used laptops at wholesale prices.", "Nationwide delivery · Easy installments"],
  })
}
