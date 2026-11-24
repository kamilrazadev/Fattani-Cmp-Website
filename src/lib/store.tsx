"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { fmt, type Product } from "@/lib/catalog-core"

export interface CartLine { id: number; qty: number; price: number; warranty: { label: string; price: number } }

interface StoreValue {
  cart: CartLine[]
  wishlist: number[]
  compare: number[]
  cartCount: number
  cartTotal: number
  addToCart: (p: Product, opts?: { qty?: number; warranty?: { label: string; price: number }; silent?: boolean }) => void
  setQty: (id: number, qty: number) => void
  removeFromCart: (id: number) => void
  setLineWarranty: (id: number, warranty: { label: string; price: number }) => void
  clearCart: () => void
  toggleWish: (id: number, model?: string) => void
  toggleCompare: (id: number, model?: string) => void
  setCompare: (ids: number[]) => void
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
}

const Ctx = createContext<StoreValue | null>(null)
export const MAX_COMPARE = 4

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}
function save(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage unavailable */ }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [compare, setCompareState] = useState<number[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Read persisted state after hydration so server and client markup match.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setCart(load<CartLine[]>("fc.cart", []).filter(l => typeof l.price === "number"))
    setWishlist(load<number[]>("fc.wish", []))
    setCompareState(load<number[]>("fc.compare", []))
    setReady(true)
  }, [])
  useEffect(() => { if (ready) save("fc.cart", cart) }, [cart, ready])
  useEffect(() => { if (ready) save("fc.wish", wishlist) }, [wishlist, ready])
  useEffect(() => { if (ready) save("fc.compare", compare) }, [compare, ready])

  const addToCart: StoreValue["addToCart"] = useCallback((p, opts = {}) => {
    const qty = opts.qty ?? 1
    const warranty = opts.warranty ?? { label: "Standard warranty", price: 0 }
    setCart(c => {
      const ex = c.find(l => l.id === p.id)
      if (ex) return c.map(l => (l.id === p.id ? { ...l, qty: l.qty + qty, warranty } : l))
      return [...c, { id: p.id, qty, price: p.price, warranty }]
    })
    if (!opts.silent)
      toast.success(`${p.model} added to cart`, {
        description: fmt(p.price + warranty.price),
        action: { label: "View cart", onClick: () => setCartOpen(true) },
      })
  }, [])

  const setQty = useCallback((id: number, qty: number) => {
    setCart(c => (qty <= 0 ? c.filter(l => l.id !== id) : c.map(l => (l.id === id ? { ...l, qty } : l))))
  }, [])
  const removeFromCart = useCallback((id: number) => setCart(c => c.filter(l => l.id !== id)), [])
  const setLineWarranty = useCallback((id: number, warranty: { label: string; price: number }) => setCart(c => c.map(l => (l.id === id ? { ...l, warranty } : l))), [])
  const clearCart = useCallback(() => setCart([]), [])

  // Side effects (toasts) stay outside state updaters: React may run updaters twice in StrictMode.
  const toggleWish = useCallback((id: number, model?: string) => {
    const on = !wishlist.includes(id)
    setWishlist(w => (on ? (w.includes(id) ? w : [...w, id]) : w.filter(x => x !== id)))
    toast(on ? "Saved to wishlist" : "Removed from wishlist", { id: `wish-${id}`, description: model })
  }, [wishlist])

  const toggleCompare = useCallback((id: number, model?: string) => {
    if (compare.includes(id)) { setCompareState(c => c.filter(x => x !== id)); return }
    if (compare.length >= MAX_COMPARE) {
      toast.warning(`You can compare up to ${MAX_COMPARE} laptops`, { id: "compare-max", description: "Remove one from the compare bar first." })
      return
    }
    setCompareState(c => (c.includes(id) ? c : [...c, id]))
    toast(`Added to compare`, { id: `cmp-${id}`, description: `${model ?? "Laptop"} · ${compare.length + 1} of ${MAX_COMPARE}` })
  }, [compare])

  const value = useMemo<StoreValue>(() => {
    const cartCount = cart.reduce((s, l) => s + l.qty, 0)
    const cartTotal = cart.reduce((s, l) => s + (l.price + l.warranty.price) * l.qty, 0)
    return {
      cart, wishlist, compare, cartCount, cartTotal,
      addToCart, setQty, removeFromCart, setLineWarranty, clearCart, toggleWish, toggleCompare,
      setCompare: setCompareState,
      cartOpen, setCartOpen, searchOpen, setSearchOpen,
    }
  }, [cart, wishlist, compare, cartOpen, searchOpen, addToCart, setQty, removeFromCart, setLineWarranty, clearCart, toggleWish, toggleCompare])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error("useStore must be used inside StoreProvider")
  return v
}

export { WHATSAPP, waLink } from "@/lib/site"

/* Orders (prototype: kept in this browser only) */
export interface Address { first: string; last: string; company: string; street: string; apt: string; city: string; province: string; postcode: string }
export interface Order {
  id: number
  date: string
  lines: { id: number; model: string; image: string; spec: string; qty: number; price: number; warranty: { label: string; price: number } }[]
  subtotal: number
  shipping: number
  fee: number
  total: number
  payment: "bank" | "cod" | "baadmay"
  delivery: "ship" | "pickup"
  contact: { phone: string; email: string }
  billing: Address
  shippingAddress: Address | null
  notes: string
}
export const SHIPPING_FLAT = 1500
export const COD_FEE_RATE = 0.04
export const PAYMENT_LABEL: Record<Order["payment"], string> = {
  bank: "Advance payment (bank transfer) — no extra charges",
  cod: "Cash on delivery (+4% handling charge)",
  baadmay: "BaadMay — pay in 3 installments",
}
export function saveOrder(o: Order) {
  try { const all = JSON.parse(localStorage.getItem("fc.orders") || "[]"); localStorage.setItem("fc.orders", JSON.stringify([o, ...all].slice(0, 20))) } catch { /* storage unavailable */ }
}
export function loadOrder(id: number): Order | null {
  try { return (JSON.parse(localStorage.getItem("fc.orders") || "[]") as Order[]).find(o => o.id === id) ?? null } catch { return null }
}
