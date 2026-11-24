import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, JetBrains_Mono, Manrope } from "next/font/google"
import { Shell } from "@/components/layout/shell"
import { Footer } from "@/components/layout/footer"
import { JsonLd } from "@/components/json-ld"
import { organizationLd, SITE_NAME, SITE_URL } from "@/lib/seo"
import "./globals.css"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" })
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap", weight: ["700", "800"] })
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["500", "600"], preload: false })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Fattani Computers — Laptops in Karachi since 1997 | Dell Pakistan Partner", template: "%s | Fattani Computers" },
  description: "Buy new, certified and tested used laptops in Pakistan from Fattani Computers — Dell Pakistan partner since 1997. Wholesale prices, warranty on every laptop, nationwide delivery and easy installments.",
  applicationName: SITE_NAME,
  keywords: ["laptops Karachi", "used laptops Pakistan", "Dell laptops Pakistan", "HP laptops", "Lenovo ThinkPad", "MacBook Pakistan", "gaming laptops", "Fattani Computers"],
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_PK", url: "/", title: "Fattani Computers — Laptops in Karachi since 1997", description: "New, certified and tested used laptops at wholesale prices. Dell Pakistan partner. Warranty on every laptop." },
  twitter: { card: "summary_large_image", title: "Fattani Computers — Laptops in Karachi since 1997", description: "New, certified and tested used laptops at wholesale prices." },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#166981",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${bricolage.variable} ${jetbrains.variable}`}>
      <body>
        <JsonLd data={organizationLd} />
        <Shell footer={<Footer />}>{children}</Shell>
      </body>
    </html>
  )
}
