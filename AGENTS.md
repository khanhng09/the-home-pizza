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

Code is organized **by screen** (one route/page = one folder under `screens/`), plus a **`shared/`** layer for anything used by more than one screen. This replaced an earlier flat `components/`+`lib/` layout — if you see stray files still using the old shape, migrate them instead of adding more to it.

> **Never create a top-level folder literally named `pages`.** Next.js scans *any* `pages/` (including `src/pages/`) as the legacy Pages Router even when the app only uses the App Router, and it will hard-fail the build on barrel `export *` files inside it (`export-all-in-page` error) no matter what the individual files are named. Use `screens/` for this project's "one folder per page" concept.

```
src/
  app/
    layout.tsx            # root layout: fonts, metadata, <html>/<body>
    page.tsx               # thin composition for the `/` route — imports sections from screens/home
    globals.css            # Tailwind v4 import + design tokens (CSS vars)
    sitemap.ts              # generated sitemap (file convention)
    robots.ts               # generated robots.txt (file convention)
    opengraph-image.tsx     # static or generated OG image (optional)
    favicon.ico
  screens/
    home/                   # everything specific to the `/` (home) screen — nothing here is imported by another screen
      sections/
        home-hero.section.tsx        # export HomeHeroSection
        home-story.section.tsx       # export HomeStorySection
      components/
        home-story-tabs.tsx          # export HomeStoryTabs — a section's client-only sub-piece
      hooks/
        home-use-something.hook.ts   # export useHomeSomething
      constants/
        home.constant.ts             # content/data used only by this screen (hero copy, trust badges, ...)
      types/
        home.type.ts                 # types used only by this screen
      index.ts                       # barrel: re-exports this screen's *sections* only
    menu/                   # the next screen follows the exact same shape
      sections/
      components/
      constants/
      index.ts
  shared/                   # anything used by 2+ screens, or with no single screen owner
    components/
      layout/               # Header, Footer, Container — site chrome
        header.tsx
        footer.tsx
        index.ts
      ui/                    # small reusable primitives (Button, Badge, SectionHeading)
      icons/                 # SVG icon components — existing `ic-*.tsx` convention, keep as-is
      illustrations/         # SVG ingredient/illustration components — existing `illus-*.tsx` convention
      index.ts
    constants/
      site.constant.ts       # business info, nav items, social links — used by shared/components/layout
    lib/
      utils.ts                # small pure helpers (cn(), formatters)
      metadata.ts              # shared metadata/JSON-LD builders
      design-tokens.ts         # design token objects (color/spacing/type scale)
      tailwind-utils.ts        # reusable Tailwind class collections
    hooks/
      use-in-view.hook.ts      # export useInView
    types/
      shared.type.ts

public/
  fonts/                    # self-hosted font files for next/font/local
  images/                   # organize by screen, e.g. images/home/*
  videos/                   # self-hosted video sources
```

### Naming rules

- **File names inside a screen start with that screen's name**: `screens/home/sections/home-story.section.tsx`, `screens/home/components/home-story-tabs.tsx`. Files under `shared/` are never screen-prefixed (`shared/components/layout/header.tsx`, not `shared-header.tsx`).
- **Only section files get a type suffix on the filename — `.section.tsx`.** A section is a top-level slice of a screen, composed directly in that screen's `index.ts`/`app/page.tsx` (Hero, Story, Menu, ...). Its exported component is PascalCase `<Screen><Name>Section` — e.g. `home-story.section.tsx` exports `HomeStorySection`.
- **Regular components get no suffix** — `<screen>-<name>.tsx` exporting `<Screen><Name>` for screen-scoped pieces (`home-story-tabs.tsx` → `HomeStoryTabs`), or `<name>.tsx` exporting `<Name>` for anything in `shared/components/` (`header.tsx` → `Header`, `footer.tsx` → `Footer`).
- **Icons and illustrations are exempt** from both the prefix and suffix rules — keep the existing `ic-*.tsx` / `illus-*.tsx` naming (it's already an unambiguous type signal on its own) in `shared/components/icons/` and `shared/components/illustrations/`.
- **Hooks get `.hook.ts`**: `<screen>-<name>.hook.ts` exporting `use<Screen><Name>` under a screen, or `<name>.hook.ts` exporting `use<Name>` under `shared/hooks/`.
- **Constants get `.constant.ts`**: `<screen>.constant.ts` under `screens/<screen>/constants/` (one file per screen is normally enough), or `<name>.constant.ts` under `shared/constants/`.
- **Types get `.type.ts`**: `<screen>.type.ts` under `screens/<screen>/types/`, or `<name>.type.ts` under `shared/types/` (e.g. the existing `icon.type.ts`).
- **Decide screen-scoped vs. shared by actual usage, not by guessing**: if only one screen uses a component/hook/constant/type, it lives inside that screen's folder. Move it to `shared/` the moment a second screen needs it — don't shared-ify things pre-emptively "just in case".
- A screen's `index.ts` barrel re-exports only that screen's **sections** — the pieces `app/page.tsx` composes. It does not re-export the screen's internal components/hooks/constants/types; import those directly by relative path from within the screen (`../constants/home.constant`).
- Keep every route's `page.tsx` a thin composition that imports sections from `@/screens/<name>` and renders them in order — no business logic or large JSX trees directly in `page.tsx`.
- Use the `@/*` path alias for all cross-folder imports (`@/shared/...`, `@/screens/...`) — no deep relative `../../../` chains. Relative imports are fine *within* a screen (e.g. a section importing its own screen's constants).
- Barrel files (`index.ts`) only re-export; never put logic in them.
- Anything not meant to be a route must live outside `app/` — this project keeps all non-route code in `screens/` and `shared/`, don't put components back under `app/`.

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
- Avoid client-side data fetching for content that's static at build time (menu items, hours, addresses) — keep that as plain server-rendered data in the relevant `*.constant.ts` file (screen-scoped or `shared/constants/`) or fetched in a Server Component.
- Don't introduce `cookies()`/`headers()`/other request-time APIs in the root layout or the landing page unless truly needed — any usage there opts the *entire app* into dynamic rendering, killing static prerendering of the landing page.

## Animation rules

- Prefer CSS transitions/animations (Tailwind utilities, `@keyframes` in `globals.css`) for simple hover/reveal/entrance effects — cheapest on the main thread, no JS shipped.
- For page/route-level transitions or shared-element effects (e.g. a menu item image morphing into a detail view), use React's `<ViewTransition>` (from `react`) per the `view-transitions` guide, gated behind `experimental.viewTransition: true` in `next.config.ts`. Without that flag it's unavailable — don't assume it just works.
- Any animation must respect `prefers-reduced-motion: reduce` — at minimum, zero out animation durations/delays under that media query (see the pattern in the view-transitions guide); don't ship a motion effect that can't be disabled this way.
- For scroll-triggered reveals, prefer `IntersectionObserver` in a small client hook (`shared/hooks/use-in-view.hook.ts`, or a screen-scoped `*.hook.ts` if only one screen needs it) over a heavy scroll-animation library, unless the design genuinely needs one (parallax, scrubbed timelines).
- Keep animation logic in the client leaf component that needs it (see JS bundle discipline above) — don't mark an entire section `"use client"` just to animate one child element.

## General conventions to keep consistent with existing code

- Tailwind v4 via `@import "tailwindcss"` + CSS custom properties in `globals.css` (see the existing `--palette-*` / `--color-*` tokens) — add new design tokens there, don't hardcode hex values in components.
- TypeScript strict mode is on (`tsconfig.json`) — no `any` without a clear reason, no unchecked non-null assertions.
- Icons follow the existing `shared/components/icons/ic-*.tsx` + barrel pattern — new icons go there, same naming. Illustrations follow the same idea in `shared/components/illustrations/illus-*.tsx`.
- Run `yarn lint` (ESLint flat config) before considering a change done; Next.js 16 no longer runs lint as part of `next build`.
