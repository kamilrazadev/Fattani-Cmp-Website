import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { Address, Order } from "@/lib/store"
import { PAYMENT_LABEL } from "@/lib/store"

const BRAND: [number, number, number] = [22, 105, 129]
const INK: [number, number, number] = [10, 26, 34]
const MUTED: [number, number, number] = [93, 108, 116]
const LINE: [number, number, number] = [223, 231, 232]
const rs = (n: number) => "Rs " + n.toLocaleString("en-PK")

/** jsPDF can't embed WebP, so draw the local logo onto a canvas and export PNG. */
async function logoPng(): Promise<{ data: string; ratio: number } | null> {
  try {
    const img = new Image()
    img.src = "/brand/logo.webp"
    await img.decode()
    const c = document.createElement("canvas")
    c.width = img.naturalWidth; c.height = img.naturalHeight
    c.getContext("2d")!.drawImage(img, 0, 0)
    return { data: c.toDataURL("image/png"), ratio: img.naturalHeight / img.naturalWidth }
  } catch {
    return null
  }
}

const addressLines = (a: Address) => [
  `${a.first} ${a.last}`.trim(),
  a.company,
  [a.street, a.apt].filter(Boolean).join(", "),
  [a.city, a.province, a.postcode].filter(Boolean).join(", "),
].filter(Boolean)

export async function downloadInvoice(o: Order) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 16
  const date = new Date(o.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  const status = o.payment === "bank" ? "AWAITING PAYMENT" : o.payment === "cod" ? "PAY ON DELIVERY" : "INSTALLMENTS"

  // Top brand bar
  doc.setFillColor(...BRAND).rect(0, 0, W, 4, "F")

  // Logo + seller
  const logo = await logoPng()
  if (logo) doc.addImage(logo.data, "PNG", M, 12, 52, 52 * logo.ratio)
  else { doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(...BRAND).text("FATTANI COMPUTERS", M, 22) }
  doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...MUTED)
  ;["GD-18, Ground Floor, Techno City Mall", "I.I. Chundrigar Road, Karachi, Pakistan", "0326-5900042  ·  0321-8248070", "sales@fattanicomputer.com", "NTN & Sales Tax registered"]
    .forEach((l, k) => doc.text(l, M, 34 + k * 4.2))

  // Invoice title block
  doc.setFont("helvetica", "bold").setFontSize(26).setTextColor(...INK).text("INVOICE", W - M, 22, { align: "right" })
  const meta: [string, string][] = [["Invoice no.", `FC-${o.id}`], ["Order no.", `#${o.id}`], ["Date", date]]
  meta.forEach(([k, v], i) => {
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED).text(k, W - M - 42, 31 + i * 5.2)
    doc.setFont("helvetica", "bold").setTextColor(...INK).text(v, W - M, 31 + i * 5.2, { align: "right" })
  })
  doc.setFillColor(o.payment === "bank" ? 253 : 232, o.payment === "bank" ? 243 : 246, o.payment === "bank" ? 220 : 239)
  doc.roundedRect(W - M - 42, 48, 42, 7, 1.5, 1.5, "F")
  doc.setFontSize(7.5).setTextColor(o.payment === "bank" ? 122 : 18, o.payment === "bank" ? 86 : 153, o.payment === "bank" ? 0 : 106).text(status, W - M - 21, 52.6, { align: "center" })

  // Bill to / Ship to
  let y = 66
  doc.setDrawColor(...LINE).line(M, y, W - M, y)
  y += 7
  const col = (W - M * 2) / 3
  const block = (title: string, lines: string[], x: number) => {
    doc.setFont("helvetica", "bold").setFontSize(7.5).setTextColor(...BRAND).text(title.toUpperCase(), x, y)
    doc.setFontSize(9).setTextColor(...INK)
    let ly = y + 5.5
    lines.forEach((l, k) => {
      doc.setFont("helvetica", k === 0 ? "bold" : "normal")
      const wrapped = doc.splitTextToSize(l, col - 6) as string[]
      doc.text(wrapped, x, ly)
      ly += wrapped.length * 4.6
    })
    return ly
  }
  const b1 = block("Bill to", [...addressLines(o.billing), o.contact.phone, o.contact.email], M)
  const b2 = block(o.shippingAddress ? "Ship to" : "Collection", o.shippingAddress ? addressLines(o.shippingAddress) : ["Store pickup", "GD-18, Techno City Mall", "I.I. Chundrigar Road, Karachi"], M + col)
  const b3 = block("Payment", [o.payment === "bank" ? "Bank transfer" : o.payment === "cod" ? "Cash on delivery" : "BaadMay installments", o.shippingAddress ? "Courier delivery, 2–4 working days" : "Collect in store"], M + col * 2)

  // Items
  autoTable(doc, {
    startY: Math.max(b1, b2, b3) + 3,
    margin: { left: M, right: M },
    head: [["#", "Description", "Qty", "Unit price", "Amount"]],
    body: o.lines.map((l, k) => [
      String(k + 1),
      { content: `${l.model}\n${l.spec}\nWarranty: ${l.warranty.label}${l.warranty.price ? ` (+${rs(l.warranty.price)})` : ""}` },
      String(l.qty),
      rs(l.price + l.warranty.price),
      rs((l.price + l.warranty.price) * l.qty),
    ]),
    theme: "plain",
    styles: { font: "helvetica", fontSize: 9, textColor: INK, cellPadding: { top: 3.2, bottom: 3.2, left: 2.5, right: 2.5 }, valign: "top", lineColor: LINE },
    headStyles: { fillColor: INK, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    columnStyles: { 0: { cellWidth: 9, textColor: MUTED }, 2: { cellWidth: 14, halign: "center" }, 3: { cellWidth: 30, halign: "right" }, 4: { cellWidth: 32, halign: "right", fontStyle: "bold" } },
    bodyStyles: { lineWidth: { bottom: 0.2 } },
    didParseCell: d => { if (d.section === "head" && d.column.index >= 2) d.cell.styles.halign = d.column.index === 2 ? "center" : "right" },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 6

  // Totals
  const tx = W - M - 78
  const rows: [string, string][] = [["Subtotal", rs(o.subtotal)], ["Shipping", o.shipping ? `${rs(o.shipping)} (flat rate)` : "Free (store pickup)"]]
  if (o.fee) rows.push(["COD handling (4%)", rs(o.fee)])
  rows.forEach(([k, v], i) => {
    doc.setFont("helvetica", "normal").setFontSize(9.5).setTextColor(...MUTED).text(k, tx, y + i * 6)
    doc.setTextColor(...INK).text(v, W - M, y + i * 6, { align: "right" })
  })
  y += rows.length * 6 + 1
  doc.setFillColor(...BRAND).roundedRect(tx - 3, y - 1, 78 + 3, 11, 1.5, 1.5, "F")
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(255, 255, 255).text("Total due", tx, y + 6)
  doc.setFontSize(13).text(rs(o.total), W - M - 2, y + 6.2, { align: "right" })
  if (o.payment === "baadmay") { doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...MUTED).text(`3 payments of ${rs(Math.ceil(o.total / 3))}`, W - M, y + 16, { align: "right" }) }

  // Payment instructions
  const py = y + (o.payment === "baadmay" ? 24 : 18)
  doc.setFillColor(244, 247, 246).roundedRect(M, py, W - M * 2, 24, 2, 2, "F")
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...INK).text("How to pay", M + 5, py + 7)
  const how = o.payment === "bank"
    ? `Our team will send our bank details on WhatsApp (0326-5900042). Please pay ${rs(o.total)} using order number #${o.id} as the payment reference and share the payment screenshot on WhatsApp. Your order is confirmed once payment is received.`
    : o.payment === "cod"
      ? `Please keep ${rs(o.total)} ready in cash for the courier. The total includes a 4% cash-on-delivery handling charge.`
      : `Complete your BaadMay approval using the link sent to you. Your order is confirmed once BaadMay approves the first installment.`
  doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...MUTED).text(doc.splitTextToSize(how, W - M * 2 - 10), M + 5, py + 12.5)
  doc.setFontSize(8).text(PAYMENT_LABEL[o.payment], M + 5, py + 21.5)

  // Terms
  let ty = py + 33
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...INK).text("Warranty & returns", M, ty)
  doc.setFont("helvetica", "normal").setFontSize(7.8).setTextColor(...MUTED)
  ;[
    "Warranty covers faults in parts that appear in normal use; we repair or replace them free of charge.",
    "7-day cashback: if a used device develops a fault within 7 days of purchase, return it for your money back.",
    "Not covered: physical or liquid damage, burnt or broken parts, software issues, or devices opened by anyone other than Fattani Computers.",
    "Check your warranty any time at fattanicomputer.com/warranty-check using this invoice number.",
  ].forEach(t => { const lines = doc.splitTextToSize("•  " + t, W - M * 2); ty += 4.4; doc.text(lines, M, ty); ty += (lines.length - 1) * 3.6 })
  if (o.notes) { ty += 7; doc.setFont("helvetica", "bold").setTextColor(...INK).text("Order note", M, ty); doc.setFont("helvetica", "normal").setTextColor(...MUTED).text(doc.splitTextToSize(o.notes, W - M * 2), M, ty + 4.5) }

  // Footer
  doc.setDrawColor(...LINE).line(M, H - 20, W - M, H - 20)
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...BRAND).text("Thank you for shopping with Fattani Computers — the name you can trust.", M, H - 13)
  doc.setFont("helvetica", "normal").setFontSize(7.5).setTextColor(...MUTED).text("This is a computer-generated invoice and does not require a signature.", M, H - 8.5)
  doc.text("fattanicomputer.com", W - M, H - 8.5, { align: "right" })
  doc.setFillColor(...BRAND).rect(0, H - 3, W, 3, "F")

  doc.save(`Fattani-Invoice-FC-${o.id}.pdf`)
}
