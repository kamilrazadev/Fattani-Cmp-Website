import type { Metadata } from "next"
import ShopView from "@/views/shop"
import { JsonLd } from "@/components/json-ld"
import { abs, breadcrumbLd } from "@/lib/seo"
import { PRODUCTS } from "@/lib/products"

export const metadata: Metadata = {
  title: "Laptops for sale in Pakistan — new, certified & used",
  description: "Browse 360+ tested laptops: Dell Latitude, HP EliteBook, Lenovo ThinkPad, MacBook, gaming and Chromebooks. Filter by price, processor, RAM and storage. Warranty included, delivery across Pakistan.",
  alternates: { canonical: "/shop" },
}

const list = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: PRODUCTS.slice(0, 24).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/product/${p.slug}`), name: p.model })),
}

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await searchParams // opt into per-request rendering so filters render on the server
  return (
    <>
      <JsonLd data={breadcrumbLd([["Home", "/"], ["Shop", "/shop"]])} />
      <JsonLd data={list} />
      <ShopView />
    </>
  )
}
