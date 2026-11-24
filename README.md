# Fattani Computers — storefront redesign

Redesigned storefront for [Fattani Computers](https://fattanicomputer.com), a Karachi laptop dealer since 1997 and Dell Pakistan partner. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and shadcn/ui (Base UI).

## Features

- Home: hero slider, deal of the day, bento product grid, services, client marquee, reviews, locations, FAQ
- Shop with filters, search (Ctrl+K or `/`), product pages, compare, wishlist
- Cart, checkout, order confirmation with PDF invoice, order tracking
- App-like mobile layout (bottom tab bar, cart sheet)
- 363 products pre-rendered as static pages

## Getting started

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```powershell
npm run build
npm start
```

## Configuration

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, sitemap, robots and JSON-LD | `https://fattanicomputer.com` |

Set it to the live domain before deploying.

## Project structure

```
src/app/          Routes, metadata, sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx
src/views/        Page-level views (home, shop, product, cart, checkout, ...)
src/components/   Shared UI, layout (header, mega menu, footer), shadcn components
src/lib/          Catalog, cart/wishlist store, SEO helpers (seo.ts), site content (site.ts)
src/data/         Generated catalog JSON (slim list + server-only product details)
scripts/          split-products.cjs: builds src/data/* from scripts/products.full.json
public/           Brand logo, client logos, brand SVGs
```

To refresh the catalog, replace `scripts/products.full.json` and run `node scripts/split-products.cjs`.

## SEO, performance and accessibility

- Metadata API with title template, Open Graph/Twitter cards, canonical URLs and generated OG image
- JSON-LD: store and website (with search action), Product (offers, shipping, returns), FAQ, BreadcrumbList, ItemList
- Sitemap and robots; cart, checkout, order and compare pages are `noindex`
- Images through `next/image` (AVIF/WebP, explicit sizes), fonts through `next/font`
- Heavy UI (cart panel, search dialog, compare bar) loaded lazily; server components for static sections
- Skip link, labelled controls, focus-visible styles, contrast-checked colours

Lighthouse (local production build): SEO 100, best practices 100, accessibility 94–100, desktop performance 95–98. Mobile performance is 95+ on the shop and cart pages, but about 54–75 on the image-heavy home and product pages (LCP about 5 s under simulated throttling). Measure on real devices after deploy.

## Deployment

Any Next.js host works; Vercel is the simplest. Connect the repository (or run `npx vercel --prod`) and set `NEXT_PUBLIC_SITE_URL`. On Windows, the Vercel CLI needs symlink permission (Developer Mode or an elevated terminal).

## Notes

- Next.js 16 has breaking changes from older versions; docs ship in `node_modules/next/dist/docs/`.
- Client-module exports cannot be called from server components, so shared helpers such as `waLink` live in `src/lib/site.ts`.
- Cart, wishlist, compare and orders are stored in the browser (localStorage/sessionStorage); there is no backend yet.
