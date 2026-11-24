import { siAcer, siApple, siAsus, siDell, siGoogle, siHp, siLenovo, siVisa, siWhatsapp, siFacebook, siInstagram, siTiktok } from "simple-icons"
import { Banknote, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"

type SI = { path: string; hex: string; title: string }
export function SimpleIcon({ icon, className, color }: { icon: SI; className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={icon.title} className={className} fill={color ?? "currentColor"}>
      <path d={icon.path} />
    </svg>
  )
}

const BRAND_ICONS: Record<string, SI> = { HP: siHp, Dell: siDell, Lenovo: siLenovo, Apple: siApple, Asus: siAsus, Acer: siAcer }
export function BrandMark({ brand, className, colored = true }: { brand: string; className?: string; colored?: boolean }) {
  const icon = BRAND_ICONS[brand]
  if (!icon) return <span className={cn("font-heading font-bold", className)}>{brand}</span>
  const hex = icon.hex === "000000" || brand === "Apple" ? "0A1A22" : icon.hex
  return <SimpleIcon icon={icon} className={className} color={colored ? `#${hex}` : undefined} />
}
export const GoogleG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-label="Google">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
)
export const WhatsAppIcon = ({ className }: { className?: string }) => <SimpleIcon icon={siWhatsapp} className={className} />
export const SocialIcons = { facebook: siFacebook, instagram: siInstagram, tiktok: siTiktok, google: siGoogle }
export const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-label="LinkedIn"><path d="M4 9h3.5v11H4zM5.8 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h3.3v1.5h.1a3.7 3.7 0 0 1 3.3-1.8c3.5 0 4.2 2.3 4.2 5.3V20h-3.5v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V20H10z" /></svg>
)

/** Payment method badges drawn as proper marks rather than plain text chips. */
export function PaymentLogos({ className }: { className?: string }) {
  const tile = "h-9 w-[58px] rounded-md bg-white grid place-items-center shadow-[0_1px_0_rgba(0,0,0,.06)] ring-1 ring-black/5"
  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Accepted payment methods">
      <li className={tile} title="Visa"><SimpleIcon icon={siVisa} className="h-7 w-11" color="#1A1F71" /></li>
      <li className={tile} title="Mastercard">
        <svg viewBox="0 0 40 24" className="h-6" aria-label="Mastercard"><circle cx="15" cy="12" r="9" fill="#EB001B" /><circle cx="25" cy="12" r="9" fill="#F79E1B" /><path d="M20 4.6a9 9 0 0 1 0 14.8 9 9 0 0 1 0-14.8z" fill="#FF5F00" /></svg>
      </li>
      <li className={tile} title="JazzCash">
        <svg viewBox="0 0 64 24" className="h-[18px]" aria-label="JazzCash">
          <rect x="1" y="3" width="62" height="18" rx="9" fill="#FFD100" />
          <text x="32" y="16.4" textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="11" fill="#D71921" fontStyle="italic">Jazz<tspan fill="#231F20">Cash</tspan></text>
        </svg>
      </li>
      <li className={tile} title="Easypaisa">
        <svg viewBox="0 0 70 24" className="h-[18px]" aria-label="Easypaisa">
          <circle cx="9" cy="12" r="7.5" fill="#3BB54A" /><path d="M5.8 12.2h6.4M9 8.8c-2 0-3.4 1.5-3.4 3.4S7 15.6 9 15.6c1.2 0 2.2-.5 2.8-1.3" stroke="#fff" strokeWidth="1.7" fill="none" strokeLinecap="round" />
          <text x="19" y="16.2" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11.5" fill="#1E1E1E">easypaisa</text>
        </svg>
      </li>
      <li className={cn(tile, "flex w-auto gap-1.5 px-2.5 text-[11px] font-bold text-ink")} title="Bank transfer"><Landmark className="size-4 text-brand" />Bank</li>
      <li className={cn(tile, "flex w-auto gap-1.5 px-2.5 text-[11px] font-bold text-ink")} title="Cash on delivery"><Banknote className="size-4 text-ok" />COD</li>
      <li className={cn(tile, "flex w-auto px-2.5 text-[11px] font-extrabold tracking-tight text-[#6B2BD9]")} title="Pay in 3 installments with BaadMay">BaadMay</li>
    </ul>
  )
}
