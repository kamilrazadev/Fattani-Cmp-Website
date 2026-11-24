import type { Metadata } from "next"
import HomeView from "@/views/home"
import { JsonLd } from "@/components/json-ld"
import { faqLd } from "@/lib/seo"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default function Page() {
  return (
    <>
      <JsonLd data={faqLd} />
      <HomeView />
    </>
  )
}
