import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ProductView, { type ProductDetail } from "@/views/product"
import { JsonLd } from "@/components/json-ld"
import { abs, breadcrumbLd, SITE_NAME } from "@/lib/seo"
import { bySlug, fmt, PRODUCTS, CONDITION_LABEL, similar } from "@/lib/products"
import details from "@/data/product-details.json"

const DETAILS = details as Record<string, ProductDetail>

export const dynamicParams = false

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = bySlug.get(slug)
  if (!p) return {}
  const d = DETAILS[slug]
  const description = `${p.model} — ${p.cpu}, ${p.ram} RAM, ${p.storage}. ${CONDITION_LABEL[p.condition]} for ${fmt(p.price)} at ${SITE_NAME}, Karachi. ${p.warranty.split(".")[0]}. Delivery across Pakistan.`.slice(0, 300)
  return {
    title: `${p.model} ${p.cpu.replace("Intel ", "")} ${p.ram} ${p.storage} — ${fmt(p.price)}`,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_PK", title: p.title, description, url: `/product/${slug}` },
    twitter: { card: "summary_large_image", title: p.title, description },
    other: {
      "product:price:amount": String(p.price),
      "product:price:currency": "PKR",
      "product:availability": p.inStock ? "in stock" : "out of stock",
      "product:condition": p.condition === "new" ? "new" : "used",
      "product:brand": p.brand,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = bySlug.get(slug)
  if (!p) notFound()
  const d = DETAILS[slug]
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    sku: String(p.id),
    mpn: p.model,
    image: d.images,
    description: d.intro[0] ?? `${p.model} — ${p.cpu}, ${p.ram} RAM, ${p.storage}.`,
    brand: { "@type": "Brand", name: p.brand },
    category: "Laptops",
    itemCondition: p.condition === "new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url: abs(`/product/${slug}`),
      priceCurrency: "PKR",
      price: p.price,
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
      shippingDetails: { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: 1500, currency: "PKR" }, shippingDestination: { "@type": "DefinedRegion", addressCountry: "PK" } },
      hasMerchantReturnPolicy: { "@type": "MerchantReturnPolicy", applicableCountry: "PK", returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow", merchantReturnDays: 7, returnMethod: "https://schema.org/ReturnByMail", returnFees: "https://schema.org/FreeReturn" },
    },
  }
  return (
    <>
      <JsonLd data={ld} />
      <JsonLd data={breadcrumbLd([["Home", "/"], ["Shop", "/shop"], [p.model, `/product/${slug}`]])} />
      <ProductView base={p} detail={d} related={similar(p, 8)} />
    </>
  )
}
