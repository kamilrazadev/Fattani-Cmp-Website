
import { Link } from "@/lib/router"
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react"
import { LinkedInIcon, PaymentLogos, SimpleIcon, SocialIcons } from "@/components/logos"
import { EMAIL, LOGO, PHONE } from "@/lib/site"
import { Img } from "@/components/img"

const COLS: [string, [string, string][]][] = [
  ["Shop", [["Brand new laptops", "/shop?cond=new"], ["Used business laptops", "/shop?cond=used"], ["Certified · 1-yr warranty", "/shop?cond=certified"], ["Gaming laptops", "/shop?type=gaming"], ["MacBooks", "/shop?type=macbook"], ["Chromebooks", "/shop?type=chromebook"]]],
  ["Services", [["Fattani Rewards", "/#rewards"], ["Corporate quote", "/#corporate"], ["Check my warranty", "/#services"], ["Network setup", "/#networking"], ["Compare laptops", "/compare"]]],
  ["Help", [["Track order", "/track-order"], ["Delivery & payment", "/#faq"], ["Warranty & returns", "/#faq"], ["Store locations", "/#visit"], ["About Fattani", "/#about"]]],
]

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-white/70 max-md:mb-16">
      <div className="tx-grid pointer-events-none absolute inset-0 text-white/40 [mask-image:linear-gradient(180deg,#000,transparent_70%)]" />
      <div className="relative mx-auto max-w-[1320px] px-5 pt-16 pb-8 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
          <div>
            <span className="inline-block rounded-xl bg-white px-3 py-2"><Img src={LOGO} width={400} height={125} sizes="144px" quality={90} alt="Fattani Computers" className="h-9 w-auto" /></span>
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed">Empowering businesses with trusted IT solutions since 1997. Tested laptops at wholesale prices, from Karachi to New York.</p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-white/85"><ShieldCheck className="size-4 text-sky" />NTN & Sales Tax registered</span>
            <div className="mt-5 flex gap-2">
              {[["Facebook", SocialIcons.facebook], ["Instagram", SocialIcons.instagram], ["TikTok", SocialIcons.tiktok]].map(([n, ic]) => (
                <a key={n as string} href="#" aria-label={n as string} className="grid size-10 place-items-center rounded-xl border border-white/15 transition hover:bg-white hover:text-ink"><SimpleIcon icon={ic as never} className="size-4" /></a>
              ))}
              <a href="#" aria-label="LinkedIn" className="grid size-10 place-items-center rounded-xl border border-white/15 transition hover:bg-white hover:text-ink"><LinkedInIcon className="size-4" /></a>
            </div>
          </div>
          {COLS.map(([h, links]) => (
            <div key={h}>
              <p className="eyebrow mb-4 text-white">{h}</p>
              <ul className="grid gap-2.5 text-[14.5px] font-medium">
                {links.map(([l, to]) => <li key={l}><Link to={to} className="transition hover:text-white">{l}</Link></li>)}
              </ul>
            </div>
          ))}
          <div>
            <p className="eyebrow mb-4 text-white">Get in touch</p>
            <ul className="grid gap-3 text-[14.5px] font-medium">
              <li><a href={`tel:${PHONE.mainTel}`} className="flex items-center gap-2.5 hover:text-white"><Phone className="size-4 text-sky" />{PHONE.main}</a></li>
              <li><a href={`tel:${PHONE.salesTel}`} className="flex items-center gap-2.5 hover:text-white"><Phone className="size-4 text-sky" />{PHONE.sales} · Sales</a></li>
              <li><a href={`mailto:${EMAIL}`} className="flex items-center gap-2.5 hover:text-white"><Mail className="size-4 text-sky" />{EMAIL}</a></li>
              <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-sky" />Suite # 302, Regal Trade Square, Saddar, Karachi</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between">
          <span className="text-[13px]">© 2026 Fattani Computers. All rights reserved.</span>
          <PaymentLogos />
        </div>
      </div>
    </footer>
  )
}
