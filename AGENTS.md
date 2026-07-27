# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key Next.js 16 breaking changes already confirmed for this repo (verified against `node_modules/next/dist/docs`, do not rely on older training data):

- Turbopack is the default bundler for both `next dev` and `next build`. Don't add `--turbopack` flags or webpack config unless a real need shows up.
- `cookies()`, `headers()`, `draftMode()`, and `params`/`searchParams` are **async-only** — always `await` them, no sync fallback exists anymore.
- `next/image`'s `priority` prop is **deprecated**. Use `preload` (boolean) instead for LCP/above-the-fold images. Prefer `loading="eager"` or `fetchPriority="high"` over `preload` when there are multiple candidate LCP images.
- `images.qualities` defaults to `[75]` only — if a design calls for a different quality, add it explicitly to `next.config.ts` (`images.qualities`), otherwise the closest allowed value is silently substituted.
- Local image `src` with a query string requires `images.localPatterns[].search` to be configured, or the request 400s.
- `middleware.ts` is renamed to `proxy.ts` (export `proxy`, not `middleware`). Edge runtime is not supported in `proxy`.
- `revalidateTag(tag)` now requires a second `cacheLife` argument, e.g. `revalidateTag('menu', 'max')`. Use `updateTag` in Server Actions when the user needs to see their own change immediately.

---

# Building the landing page: rules to follow

This project is a marketing/landing site (The Home Pizza). Everything below applies to any page, section, or component built for it. These rules are derived from the actual Next.js docs shipped in `node_modules/next/dist/docs/` — re-check that folder before deviating, since this Next.js build differs from public docs.

## Folder structure

Follow and extend the existing convention already in `src/` — barrel-exported, feature/kind-based folders, colocated with the `app` router but outside route segments:

```
src/
  app/
    layout.tsx            # root layout: fonts, metadata, <html>/<body>
    page.tsx               # the landing page route (/)
    globals.css            # Tailwind v4 import + design tokens (CSS vars)
    sitemap.ts              # generated sitemap (file convention)
    robots.ts               # generated robots.txt (file convention)
    opengraph-image.tsx     # static or generated OG image (optional)
    favicon.ico
  components/
    layout/                # Header, Footer, Container, PageShell — structural chrome
    sections/               # One folder per landing-page section (Hero, Menu, About, Testimonials, CTA, ...)
      hero/
        hero.tsx
        hero-video.tsx      # split out client-only pieces from the server section
        index.ts
    ui/                     # Small reusable primitives (Button, Badge, SectionHeading)
    icons/                  # SVG icon components (existing convention, keep as-is)
    index.ts                # top-level barrel, re-exports the above
  lib/
    constants.ts            # nav items, social links, business info
    metadata.ts             # shared metadata builders (title templates, defaults)
    utils.ts                # small pure helpers (cn(), formatters)
  hooks/                    # client-only hooks (must be used from "use client" components)
  types/                    # shared TS types/interfaces not colocated with a component

public/
  fonts/                    # self-hosted font files for next/font/local
  images/                   # organize by section, e.g. images/home/*
  videos/                   # self-hosted video sources
```

Rules:

- A section = a folder under `components/sections/<name>/`, not a single giant file. Split client-interactive pieces (carousels, video controls, animated reveals) into their own `"use client"` file inside that folder so the rest of the section stays a Server Component.
- Keep `page.tsx` a thin composition of `<Hero />`, `<Menu />`, etc. — no business logic or large JSX trees directly in `page.tsx`.
- Use the `@/*` path alias (already configured in `tsconfig.json`) for all internal imports — no deep relative `../../../` chains.
- Barrel files (`index.ts`) only re-export; never put logic in them.
- Anything not meant to be a route must live outside `app/`, or inside an `_private` folder if colocated — this project keeps everything outside `app/`, don't break that.

## SEO rules

- Define metadata via the `Metadata` object exported from `app/layout.tsx` (site-wide) and override per-section needs via `generateMetadata` only if the landing page grows dynamic routes later. For a single static landing page, static `export const metadata` in `layout.tsx`/`page.tsx` is sufficient — don't reach for `generateMetadata` without a data dependency.
- Always fill: `title` (with a template if more routes are added later), `description`, `openGraph` (title/description/images/url/siteName), and `twitter` card metadata. These drive link-preview quality on social/chat shares.
- Add `app/sitemap.ts` and `app/robots.ts` using the file conventions (return the typed objects Next.js expects) instead of static `.xml`/`.txt` files, so they stay correct as routes are added.
- Provide a real OG image: either a static `opengraph-image.png/jpg` in `app/`, or a generated `opengraph-image.tsx` using `next/og`'s `ImageResponse` if it needs to include dynamic branding. 1200x630 minimum.
- Use exactly one `<h1>` per page (the hero headline), and a logical heading order (`h2` per section) — do not skip levels for styling reasons; control size with CSS, not heading level.
- Add JSON-LD structured data (e.g. `Restaurant` or `LocalBusiness` schema from schema.org) as a native `<script type="application/ld+json">` in `page.tsx` or `layout.tsx` — not `next/script`, since JSON-LD isn't executable code. Escape `<` in the serialized payload (`.replace(/</g, '\\u003c')`) to avoid injection.
- Every `<Image>` needs a meaningful `alt`. Decorative images get `alt=""`, never omitted.
- Internal navigation (nav links, CTAs to sections/routes) must use `next/link`'s `<Link>`, never a plain `<a>`, so Next.js can prefetch.

## Performance rules

- **Images**: always use `next/image`, never a raw `<img>`. Statically import local images so width/height/blur are inferred automatically. Set `preload` (not the deprecated `priority`) on the single largest above-the-fold image (hero). Provide `sizes` on any image that isn't a fixed pixel size, especially anything using `fill`.
- **Fonts**: keep using `next/font/local` and `next/font/google` as already set up in `layout.tsx` (the `abygaer` display font + `Raleway`). Never add a `<link>` to Google Fonts or an external font `@import` — that defeats self-hosting and adds a network request. Always set `display: "swap"`.
- **Video**: the hero video (`public/videos/home/hero-banner.mp4`) must be self-hosted `<video>` with `muted`, `playsInline`, and `preload="none"` or `"metadata"` (never `"auto"` for a large hero background) if `autoPlay` is used. Provide a poster image so there's no blank frame before load, and treat the poster image as the real LCP candidate, not the video.
- **JS bundle discipline**: default every component to a Server Component. Only add `"use client"` at the leaf that actually needs interactivity/state/browser APIs (e.g. a mobile-nav toggle, a video-controls overlay, a scroll-triggered animation hook) — not at the top of a whole section.
- **Lazy load** non-critical, below-the-fold, or interaction-gated client components with `next/dynamic` (e.g. a lightbox/modal, a map embed, a heavy carousel library). Use `{ ssr: false }` only for things that truly can't render on the server (e.g. code touching `window` directly).
- Don't hand-roll animation/carousel libraries pulled in eagerly on the landing page if a lighter CSS-only approach covers the same effect — check bundle cost before adding a dependency.
- Avoid client-side data fetching for content that's static at build time (menu items, hours, addresses) — keep that as plain server-rendered data/constants in `lib/constants.ts` or fetched in a Server Component.
- Don't introduce `cookies()`/`headers()`/other request-time APIs in the root layout or the landing page unless truly needed — any usage there opts the *entire app* into dynamic rendering, killing static prerendering of the landing page.

## Animation rules

- Prefer CSS transitions/animations (Tailwind utilities, `@keyframes` in `globals.css`) for simple hover/reveal/entrance effects — cheapest on the main thread, no JS shipped.
- For page/route-level transitions or shared-element effects (e.g. a menu item image morphing into a detail view), use React's `<ViewTransition>` (from `react`) per the `view-transitions` guide, gated behind `experimental.viewTransition: true` in `next.config.ts`. Without that flag it's unavailable — don't assume it just works.
- Any animation must respect `prefers-reduced-motion: reduce` — at minimum, zero out animation durations/delays under that media query (see the pattern in the view-transitions guide); don't ship a motion effect that can't be disabled this way.
- For scroll-triggered reveals, prefer `IntersectionObserver` in a small client hook (`hooks/use-in-view.ts`) over a heavy scroll-animation library, unless the design genuinely needs one (parallax, scrubbed timelines).
- Keep animation logic in the client leaf component that needs it (see JS bundle discipline above) — don't mark an entire section `"use client"` just to animate one child element.

## General conventions to keep consistent with existing code

- Tailwind v4 via `@import "tailwindcss"` + CSS custom properties in `globals.css` (see the existing `--palette-*` / `--color-*` tokens) — add new design tokens there, don't hardcode hex values in components.
- TypeScript strict mode is on (`tsconfig.json`) — no `any` without a clear reason, no unchecked non-null assertions.
- Icons follow the existing `components/icons/ic-*.tsx` + barrel pattern — new icons go there, same naming.
- Run `yarn lint` (ESLint flat config) before considering a change done; Next.js 16 no longer runs lint as part of `next build`.
