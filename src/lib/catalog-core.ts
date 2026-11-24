import {
  Briefcase, Code2, Gamepad2, GraduationCap, Palette, Plane,
  type LucideIcon,
} from "lucide-react"

export type Condition = "new" | "certified" | "used"
export type LaptopType = "business" | "gaming" | "macbook" | "chromebook"

export interface Product {
  id: number
  slug: string
  title: string
  model: string
  brand: string
  condition: Condition
  type: LaptopType
  price: number
  was: number
  inStock: boolean
  images: string[]
  cpuFamily: string
  gen: number
  ramGB: number
  storageGB: number
  screenIn: number
  gpuShort: string
  dedicatedGpu: boolean
  touch: boolean
  cpu: string
  ram: string
  storage: string
  gpu: string
  display: string
  os: string
  keyboard: string
  colour: string
  warranty: string
  conditionNote: string
  intro: string[]
  whoFor: string[]
  features: string[]
  highlights: string[]
}

export const fmt = (n: number) => "Rs " + n.toLocaleString("en-PK")
export const ordinal = (n: number) => n + (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th")
export const storageLabel = (gb: number) => (gb >= 1024 ? `${+(gb / 1024).toFixed(1)}TB` : `${gb}GB`)
export const savePct = (p: Product) => (p.was ? Math.round(((p.was - p.price) / p.was) * 100) : 0)

export const CONDITION_LABEL: Record<Condition, string> = {
  new: "Brand new",
  certified: "Certified · 1-yr warranty",
  used: "Used · tested",
}
export const TYPE_LABEL: Record<LaptopType, string> = {
  business: "Business",
  gaming: "Gaming & workstation",
  macbook: "MacBook",
  chromebook: "Chromebook",
}

/** Short, scannable chips for cards. */
export function specChips(p: Product): string[] {
  const chips: string[] = []
  if (p.cpuFamily) chips.push(p.gen && !p.cpuFamily.startsWith("Apple") && !p.cpuFamily.includes("Ultra") ? `${p.cpuFamily} · ${ordinal(p.gen)} Gen` : p.cpuFamily)
  if (p.ramGB) chips.push(`${p.ramGB}GB RAM`)
  if (p.storageGB) chips.push(`${storageLabel(p.storageGB)} SSD`)
  if (p.gpuShort) chips.push(p.gpuShort)
  else if (p.screenIn) chips.push(`${p.screenIn}"`)
  return chips
}

export interface UseCase { id: string; label: string; icon: LucideIcon; test: (p: Product) => boolean }
export const USE_CASES: UseCase[] = [
  { id: "study", label: "Studies", icon: GraduationCap, test: p => p.price <= 90000 || p.type === "chromebook" },
  { id: "office", label: "Office work", icon: Briefcase, test: p => p.type === "business" && p.ramGB >= 8 },
  { id: "code", label: "Programming", icon: Code2, test: p => p.ramGB >= 16 && (p.gen >= 10 || p.cpuFamily.startsWith("Apple")) },
  { id: "design", label: "Design & 3D", icon: Palette, test: p => p.dedicatedGpu || p.type === "macbook" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, test: p => p.type === "gaming" || /RTX|GTX/.test(p.gpuShort) },
  { id: "travel", label: "Premium & travel", icon: Plane, test: p => (p.screenIn > 0 && p.screenIn <= 14) && (p.gen >= 11 || p.cpuFamily.startsWith("Apple")) },
]

export const BRANDS = ["HP", "Dell", "Lenovo", "Apple", "Asus", "Acer"] as const

/** Warranty options taken from the store's own product copy. */
export function warrantyOptions(p: Product) {
  if (p.condition === "new")
    return [
      { id: "intl", label: "1 year international warranty", note: "Included free", price: 0 },
      { id: "plus", label: "Fattani Plus · 1 year local warranty", note: "Repairs handled in Karachi", price: 17000 },
    ]
  if (p.condition === "certified")
    return [{ id: "1y", label: "1 year Fattani warranty", note: "Included with certified laptops", price: 0 }]
  return [
    { id: "3m", label: "3 months Fattani warranty", note: "Included", price: 0 },
    { id: "6m", label: "Extend to 6 months", note: "Same cover, longer", price: 10000 },
    { id: "1y", label: "Extend to 1 year", note: "Best for daily work", price: 16000 },
  ]
}

