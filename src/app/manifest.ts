import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fattani Computers",
    short_name: "Fattani",
    description: "Laptops in Karachi since 1997 — Dell Pakistan partner.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7f6",
    theme_color: "#166981",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" }, { src: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  }
}
