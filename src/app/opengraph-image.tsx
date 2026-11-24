import { ImageResponse } from "next/og"

export const alt = "Fattani Computers — laptops in Karachi since 1997"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#0a1a22,#166981)", color: "white" }}>
        <div style={{ fontSize: 34, letterSpacing: 6, textTransform: "uppercase", opacity: 0.8 }}>Fattani Computers</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>Laptops you can trust.</div>
          <div style={{ fontSize: 36, marginTop: 24, opacity: 0.85 }}>New, certified & tested used laptops · Dell Pakistan partner · Since 1997</div>
        </div>
      </div>
    ),
    size,
  )
}
