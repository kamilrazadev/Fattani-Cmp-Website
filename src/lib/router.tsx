"use client"
/** Thin adapter so the shared components keep a React-Router-like API on top of next/navigation. */
import NextLink from "next/link"
import { usePathname, useRouter, useSearchParams as useNextSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, type ComponentProps, type ReactNode } from "react"

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & { to: string; viewTransition?: boolean }

export function Link({ to, viewTransition: _vt, ...rest }: LinkProps) {
  void _vt
  return <NextLink href={to} {...rest} />
}

type NavLinkProps = Omit<LinkProps, "className" | "children"> & {
  end?: boolean
  className?: string | ((s: { isActive: boolean }) => string)
  children?: ReactNode | ((s: { isActive: boolean }) => ReactNode)
}

export function NavLink({ to, end, className, children, ...rest }: NavLinkProps) {
  const pathname = usePathname()
  const base = to.split("?")[0]
  const isActive = end || base === "/" ? pathname === base : pathname === base || pathname.startsWith(base + "/")
  return (
    <Link to={to} aria-current={isActive ? "page" : undefined} className={typeof className === "function" ? className({ isActive }) : className} {...rest}>
      {typeof children === "function" ? children({ isActive }) : children}
    </Link>
  )
}

export function useNavigate() {
  const router = useRouter()
  return useCallback(
    (to: string | number, opts?: { replace?: boolean; viewTransition?: boolean }) => {
      if (typeof to === "number") { router.back(); return }
      if (opts?.replace) router.replace(to)
      else router.push(to)
    },
    [router],
  )
}

export function useLocation() {
  const pathname = usePathname()
  const [hash, setHash] = useState("")
  useEffect(() => {
    const f = () => setHash(window.location.hash)
    f(); window.addEventListener("hashchange", f)
    return () => window.removeEventListener("hashchange", f)
  }, [pathname])
  return { pathname, hash }
}

type SetSp = URLSearchParams | Record<string, string> | ((prev: URLSearchParams) => URLSearchParams)
export function useSearchParams(): [URLSearchParams, (next: SetSp, opts?: { replace?: boolean }) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useNextSearchParams()
  const set = useCallback(
    (next: SetSp, opts?: { replace?: boolean }) => {
      const prev = new URLSearchParams(sp.toString())
      const n = typeof next === "function" ? next(prev) : next instanceof URLSearchParams ? next : new URLSearchParams(next)
      const qs = n.toString()
      const url = qs ? `${pathname}?${qs}` : pathname
      if (opts?.replace) router.replace(url, { scroll: false })
      else router.push(url, { scroll: false })
    },
    [router, pathname, sp],
  )
  return [new URLSearchParams(sp.toString()), set]
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useRouter()
  useEffect(() => { if (replace) router.replace(to); else router.push(to) }, [router, to, replace])
  return null
}

export { useParams } from "next/navigation"
