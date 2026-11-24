import dims from "@/data/client-dims.json"
// Real business content gathered from fattanicomputers.com and fattanicomputer.com
export const LOGO = "/brand/logo.webp"
const U1 = "https://fattanicomputers.com/wp-content/uploads/"

export const IMG = {
  storeWide: U1 + "2026/11/IMG_5642-1536x1152.jpeg",
  storeStaff: U1 + "2026/11/IMG_6245.jpg",
  karachi: U1 + "2026/06/Karachi-Location.webp",
  newYork: U1 + "2026/06/NewYork-Location.webp",
}

export const PHONE = { main: "0321-8248070", mainTel: "+923218248070", sales: "0326-5900042", salesTel: "+923265900042", us: "+1 929 594 2850", usTel: "+19295942850" }
export const EMAIL = "admin@fattanicomputers.com"

export const CLIENTS = [
  "1-woodwards", "2-Sogo", "3-Saylani", "4-IdeaFuzion", "5-Beaconhouse", "6-Reon", "7-Tribe", "8-Ideas",
  "09-NKR", "10-telemart", "11-creditfix", "12-hive", "13-wave-tech", "14-skyia", "15-ossha-tech",
  "16-alkhidmat", "17-muslilm-gymkhana", "18-fyberbeam", "20-denima", "21-narkins", "22-highfy",
  "23-ashtex", "24-hotnspicy", "25-hs-logistics", "26-galceris",
].map(c => {
  const key = c.replace(/^\d+-/, "").toLowerCase()
  const [w, h] = (dims as Record<string, number[]>)[key] ?? [150, 150]
  return { name: c.replace(/^\d+-/, "").replace(/-/g, " "), src: `/clients/${key}.png`, w, h }
})

const av = (id: string) => `https://lh3.googleusercontent.com/${id}=w120-h120-c-rp-mo-br100`
export const REVIEWS = [
  { name: "Ali Muhammad", img: av("a-/ALV-UjWieXYuY_qGZM_Bh9g8fBRk6SlI2OJsGRkDmsjTfMPNO9XdgGzNzg"), tag: "Bought 7 laptops", text: "From the start, their team was professional, responsive, and genuinely helpful. They didn't just sell the products, they made sure everything was properly handled, configured, and delivered without any hassle. Every laptop was in excellent condition, exactly as promised." },
  { name: "Haris Ahmed Butt", img: av("a-/ALV-UjUFTw_QIdDNWZFFXVxIIc_pTMuiUYTntiX6wghCIPkf7_wWLotCuQ"), tag: "Dell Latitude 5400", text: "Flawless 10/10 condition — no repairs, no issues, just perfect. This is actually the fourth laptop I've bought from them, and every single one has been fully functional." },
  { name: "Sania Sadaf", img: av("a-/ALV-UjXQ1MtsNs2Ign9qBZwVjRyLSQhy4T3axf5OTOKA4tNWZZaTWYQl"), tag: "Verified buyer", text: "The team was professional, welcoming, and handled everything efficiently. Special thanks to Sir Fareed for being extremely cooperative and supportive throughout the process." },
  { name: "Shayan Abbas", img: av("a-/ALV-UjW7SEP-PlVr8RMgcnGaB2TsxvTsuWsL34AvBN06NNMHh2CiXOPx"), tag: "Reseller · 100+ laptops", text: "I've purchased over a hundred laptops from Fattani Computers and resell them. Their prices are wholesale, and the machines are thoroughly checked and tested." },
  { name: "Hammad Jawaid", img: av("a-/ALV-UjW-jlOmxVKssQpab0JvvVBNNeXzw0Vm0A2A6g-IdgI6okbVgiUcqA"), tag: "HP EliteBook 640 G5", text: "The laptop condition is excellent, neat and clean, and performance is very smooth. Perfect for office work, study and daily use. The price was also reasonable compared to the market." },
  { name: "Sajjad Awan", img: av("a/ACg8ocJWcB2z5_k3z91k-Xin7mNAyJMmoNpvPG0X3bOi1WSvBwxmUw"), tag: "Customer for 7 years", text: "I've already bought ten laptops from Fattani Computers, and for other people too. All their laptops are checked and tested. Their after-sales service is also very good." },
  { name: "Muhammad Rizwan Jamali", img: av("a-/ALV-UjXBC07JbnslWhdHQuzMMYZTtlfIZ9qOWz3cpTTihQDl4RQ7BsI"), tag: "HP EliteBook 640 G5", text: "Excellent condition and very smooth performance. The staff is very cooperative, polite, and guided me properly. I highly recommend Fattani Computer." },
  { name: "Adil Mangi", img: av("a/ACg8ocLYVSpHyuQsxiM7ePXjIAtEltOvUKoDeuvF_tEEvJq2VLmYqTU"), tag: "Dell Latitude 5400", text: "Fareed Fattani was cooperative and guided me properly before purchase. The laptop was fully checked and tested, and the condition matched what was promised." },
  { name: "Muhammad Mustafa", img: av("a/ACg8ocKOM8zLHRAV_quNNg4B7Y41D7N6calWamV-i7fOwXlVxN7n1g"), tag: "Dell Latitude 5430", text: "Laptop bilkul clean condition me mila, performance smooth hai, RAM aur SSD bilkul same hain jo batayi gayi thi. Trusted seller hai, zaroor recommend karunga." },
  { name: "Hammad Ibrahim", img: av("a/ACg8ocJOSYZ1IGJvc6wk8E3u8HcvwKh0vK98koEOQPrGAeSBHIonYA"), tag: "Customer for 1.5 years", text: "Everything is transparent and highly professional. What stood out was not just the quality of the laptop, but the exceptional after-sales support as well." },
  { name: "Muniba Khan", img: av("a/ACg8ocKIItw2SI2sK1va0hceChNSP1vC1aMJL_-TcmxpxmccUgf-nQ"), tag: "Verified buyer", text: "The staff was professional, helpful, and guided me to the best option. Highly recommended for genuine products and reasonable prices." },
  { name: "Danial Javed", img: av("a-/ALV-UjVr0GCfmynTk4gPUQfAspD-i9wiEJFjf_qLDoUXTO8lnoc14FTlRg"), tag: "Dell Latitude 5420", text: "The laptop is in excellent condition and performance is very smooth." },
]

export const LOCATIONS = [
  { city: "Head office · Karachi", name: "Regal Trade Square", address: "Suite # 302, Regal Trade Square, Saddar, Karachi", phone: PHONE.main, tel: PHONE.mainTel, img: IMG.karachi, map: "https://maps.google.com/?q=Regal+Trade+Square+Saddar+Karachi", hours: "Mon–Sat · 12 PM – 9 PM" },
  { city: "Retail shop · Karachi", name: "Techno City Mall", address: "GD-18, Techno City Mall, Karachi", phone: PHONE.sales, tel: PHONE.salesTel, img: IMG.storeWide, map: "https://maps.google.com/?q=Techno+City+Mall+Karachi", hours: "Mon–Sat · 12 PM – 9 PM" },
  { city: "Distribution · New York", name: "Hudson Valley Distribution", address: "73 Hi View Drive, Wingdale, NY 12594, USA", phone: PHONE.us, tel: PHONE.usTel, img: IMG.newYork, map: "https://maps.google.com/?q=73+Hi+View+Drive+Wingdale+NY+12594", hours: "By appointment" },
]

export const FAQ = [
  ["Is Fattani Computers a reliable laptop shop in Karachi?", "We have supplied laptops across Pakistan since 1997, we are NTN and Sales Tax registered, and every used machine is tested by our technicians before sale. We are also an official partner of Dell Pakistan."],
  ["What warranty do I get?", "Used laptops include 3 months Fattani warranty, which you can extend to 6 months (+Rs 10,000) or 1 year (+Rs 16,000) at checkout. Certified used laptops include 1 year. Brand new laptops include 1 year international warranty, with optional Fattani Plus local cover."],
  ["What if the laptop develops a fault?", "If a used device develops a fault within 7 days of purchase, you can return it for your money back. After that, the warranty covers faults in parts that appear in normal use — we repair or replace them free of charge."],
  ["How can I pay?", "Bank transfer, card, JazzCash, Easypaisa, cash on delivery (4% handling charge), or 3 interest-free installments with BaadMay."],
  ["Do you deliver outside Karachi?", "Yes, we deliver across Pakistan. You are also welcome to inspect any laptop in person at our shop in Techno City Mall or our head office in Saddar."],
  ["Do you supply companies and resellers?", "Yes. 60+ companies buy from us. Request a corporate quote and we reply within one working hour, Monday to Saturday, 12 PM to 8 PM. Resellers get wholesale pricing."],
] as const

export const WHATSAPP = "923218248070"
export function waLink(text: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
}
