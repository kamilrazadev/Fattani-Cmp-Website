import { readFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { ImageResponse } from "next/og"

export const OG_SIZE = { width: 1200, height: 630 }
const TEAL = "#166981"
const INK = "#0f2a33"

async function logoUri() {
  const buf = await readFile(path.join(process.cwd(), "public/brand/logo.png"))
  return `data:image/png;base64,${buf.toString("base64")}`
}

async function photoUri(url?: string) {
  if (!url) return null
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) return null
    const jpg = await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(520, 520, { fit: "contain", background: "#ffffff" })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 78 })
      .toBuffer()
    return `data:image/jpeg;base64,${jpg.toString("base64")}`
  } catch {
    return null
  }
}

type Card = { eyebrow?: string; title: string; lines?: string[]; price?: string; photo?: string }

export async function ogCard({ eyebrow, title, lines = [], price, photo }: Card) {
  const [logo, img] = await Promise.all([logoUri(), photoUri(photo)])
  const long = title.length > 48
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", color: INK }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "56px 56px 48px 64px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={240} height={75} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {eyebrow && <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: 3, marginBottom: 16 }}>{eyebrow}</div>}
            <div style={{ display: "flex", fontSize: img ? (long ? 46 : 56) : 76, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>{title}</div>
            {lines.map(l => (
              <div key={l} style={{ display: "flex", fontSize: 28, marginTop: 14, color: "#41606b" }}>{l}</div>
            ))}
            {price && <div style={{ display: "flex", fontSize: 60, fontWeight: 700, color: TEAL, marginTop: 24 }}>{price}</div>}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#41606b" }}>Dell Pakistan partner · Warranty included · Since 1997</div>
        </div>
        {img ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 540, background: "#eef3f4", borderLeft: `8px solid ${TEAL}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} width={460} height={460} alt="" style={{ borderRadius: 16 }} />
          </div>
        ) : (
          <div style={{ display: "flex", width: 24, background: TEAL }} />
        )}
      </div>
    ),
    OG_SIZE,
  )
}
