# Rowan & Ash

A design-driven storefront template for a boutique brand selling home and lifestyle
objects — lighting, ceramics, furniture, textiles and vases. Warm Scandinavian
palette, editorial layouts, slow-living tone.

Built with Next.js (App Router), TypeScript, Tailwind CSS and shadcn/ui.

## Getting started

Requires Node.js 20.9+ and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev
```

The site runs at http://localhost:3000.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint (`next/core-web-vitals`) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest, single run |
| `pnpm test:watch` | Vitest, watch mode |

## Structure

```
src/
├── app/                    Routes. Server components that fetch and hand off to views.
│   ├── products/           Listing (filter + sort from search params)
│   │   └── [slug]/         Detail pages, prerendered via generateStaticParams
│   ├── robots.ts           Generated robots.txt
│   └── sitemap.ts          Generated sitemap.xml
├── components/
│   ├── commerce/           Product, collection, cart and quick-view pieces
│   ├── layout/             Header, Footer, SiteShell
│   ├── media/              next/image wrapper for remote catalog imagery
│   ├── providers/          Tooltip provider, toaster, store rehydration
│   ├── ui/                 shadcn/ui primitives (only the ones in use)
│   └── views/              Client views rendered by the route segments
├── data/                   The static catalog: collections and products
├── hooks/                  Cart and wishlist stores, toast
├── lib/                    Catalog queries, price formatting, site config
├── styles/                 Global stylesheet and design tokens
├── test/                   Vitest suites
└── types/                  Catalog domain types
```

**Route segments own the data.** A page in `src/app` reads from `src/lib/catalog`
and passes plain props into a client view in `src/components/views`. Nothing in
`views/` imports the catalog data modules directly.

**Listing state lives in the URL.** `/products?collection=lighting&sort=price-asc`
is filtered and sorted on the server; the view only writes the query string back.

## Design system

Tokens are HSL triples on `:root` in `src/styles/globals.css`, surfaced through
`tailwind.config.ts`. The palette is warm neutrals with a muted terracotta
primary; type is Cormorant Garamond (serif) over Inter (sans), both loaded via
`next/font`. A `.dark` block is defined but no toggle ships — wire one up if you
want it.

Custom utilities: `.container-full`, `.container-narrow`, `.bg-linen`,
`.btn-premium`, `.link-underline`, `.divider-ornament`, `.scrollbar-hide`.

## Catalog

The catalog is static TypeScript in `src/data/` — 13 products across 8
collections, with imagery hotlinked from Unsplash. There is no backend: the cart
and wishlist persist to `localStorage` via Zustand, and checkout collects an
order request and acknowledges it locally without taking payment.

To swap in a real backend, replace the bodies of the query helpers in
`src/lib/catalog.ts`. Callers only depend on their signatures.

Images are served straight from Unsplash rather than through the Next image
optimizer (`images.unsplash.com` URLs already carry their own `w` and `q`
params, so the extra server round trip bought nothing).

## Configuration

None required. Brand strings — name, tagline, contact email, shipping
thresholds — live in `src/lib/site.ts`. Canonical URLs read `VERCEL_URL`, which
Vercel sets automatically, and fall back to `localhost:3000`.
