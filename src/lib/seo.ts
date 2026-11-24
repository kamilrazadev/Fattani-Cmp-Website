import { EMAIL, PHONE, LOCATIONS, FAQ } from "@/lib/site"

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://fattanicomputer.com").replace(/\/$/, "")
export const SITE_NAME = "Fattani Computers"
export const abs = (path: string) => `${SITE_URL}${path}`

export const organizationLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ComputerStore",
      "@id": `${SITE_URL}/#store`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: abs("/brand/logo.webp"),
      image: abs("/brand/logo.webp"),
      description: "Karachi's trusted laptop dealer since 1997 and official Dell Pakistan partner. New, certified and tested used business laptops at wholesale prices.",
      foundingDate: "1997",
      telephone: PHONE.salesTel,
      email: EMAIL,
      priceRange: "Rs 20,000 – Rs 600,000",
      currenciesAccepted: "PKR",
      paymentAccepted: "Cash, Bank transfer, Visa, Mastercard, JazzCash, Easypaisa, BaadMay installments",
      areaServed: "PK",
      address: {
        "@type": "PostalAddress",
        streetAddress: "GD-18, Ground Floor, Techno City Mall, I.I. Chundrigar Road",
        addressLocality: "Karachi",
        addressCountry: "PK",
      },
      sameAs: [] as string[],
      location: LOCATIONS.map(l => ({ "@type": "Place", name: l.name, address: l.address })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#store` },
      potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/shop?q={search_term_string}`, "query-input": "required name=search_term_string" },
    },
  ],
}

export const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
}

export const breadcrumbLd = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
})
