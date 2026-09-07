# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key Next.js 16 breaking changes already confirmed for this repo (verified against `node_modules/next/dist/docs`, do not rely on older training data):

- Turbopack is the default bundler for both `next dev` and `next build`. Don't add `--turbopack` flags or webpack config unless a real need shows up.
- `cookies()`, `headers()`, `draftMode()`, and `params`/`searchParams` are **async-only** — always `await` them, no sync fallback exists anymore.
- `middleware.ts` is renamed to `proxy.ts` (export `proxy`, not `middleware`). Edge runtime is not supported in `proxy`.
- `revalidateTag(tag)` now requires a second `cacheLife` argument, e.g. `revalidateTag('menu', 'max')`. Use `updateTag` in Server Actions when the user needs to see their own change immediately.
- **This project deliberately does NOT use `next/image`** (see the Performance rules below for why). The `next/image`-specific breaking changes (`priority`→`preload`, `images.qualities`, `images.localPatterns`) therefore don't apply here. If you ever do reach for `next/image`, re-read the image guide in `node_modules/next/dist/docs/` first — but the default and expectation is native `<img>`/`<picture>`.

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
- Every `<img>` needs a meaningful `alt`. Decorative images get `alt=""`, never omitted. (We use native `<img>`/`<picture>`, not `next/image` — see Performance rules.)
- Internal navigation (nav links, CTAs to sections/routes) must use `next/link`'s `<Link>`, never a plain `<a>`, so Next.js can prefetch.
- `<html lang>` MUST match the page's actual content language **and** the `openGraph.locale` in metadata — keep them consistent. (e.g. `lang="vi"` ⇄ `locale: 'vi_VN'`; a `lang="vi"` page with `openGraph.locale: 'en_US'` is a bug.) Flag any mismatch you find and fix it.
- Provide a canonical URL per route via `alternates.canonical` (already wired in `generatePageMetadata`) — every page should resolve to exactly one canonical URL.
- Use descriptive, meaningful link/CTA text — never "click here" / "here". Link text should describe the destination (good for both SEO and screen readers).
- Add `app/manifest.ts` (the web app manifest file convention) and a `<meta name="theme-color">` in `layout.tsx` for PWA/installability signals and better Lighthouse SEO/PWA scores. Keep `name`, `short_name`, `theme_color`, `background_color`, and `icons` in sync with the brand.
- Keep `sitemap.ts` and `robots.ts` entries in sync with `SITE_URL` from `shared/constants/site.constant.ts` — don't hardcode the origin a second time.

## Performance rules

### Images (do NOT use `next/image`)

- **Never `import Image from 'next/image'`.** For a static landing page served from a CDN, `next/image` adds a runtime optimization endpoint + a client loader script that delays LCP and costs Lighthouse points without buying real value. Use **native `<picture>` + `<img>`** with **pre-optimized assets** instead.
- Always set an explicit **integer** `width` and `height` on `<img>` (or a CSS `aspect-ratio` on the container) so the browser reserves space — this is what prevents CLS. Avoid fractional pixel values like `width={170.53}` (round to `171`); they're invalid HTML and confuse layout. *(Migrate existing usages that still pass fractional widths when you touch them.)*
- **LCP image** (the single largest above-the-fold image — usually the hero poster/map): set `fetchPriority="high"`, `loading="eager"`, `decoding="async"`. Do **not** lazy-load it.
- **Every other image**: set `loading="lazy"` and `decoding="async"`. Never lazy-load an above-the-fold image.
- Always provide a `sizes` attribute so the browser picks the correct `srcset` variant — e.g. `sizes="(max-width: 768px) 100vw, 50vw"`.
- Serve modern formats via `<picture>`: an AVIF `<source>`, a WebP `<source>`, and a JPEG/PNG `<img src>` fallback in that order. Keep assets organized under `public/images/<screen>/`.
- Pre-optimize assets at build time (a `sharp` prebuild script, or commit pre-optimized files) — never ship a raw 3MB photo to the browser. Target sensible width steps (e.g. 480 / 768 / 1024 / 1920) in the `srcset`.
- Decorative images: `alt=""` **and** `aria-hidden="true"` **and** `loading="lazy"`, so they're ignored by AT and never block the LCP.
- For background imagery, prefer CSS (`background-image`) over an `<img>` when the image carries no semantic meaning; reserve `<img>` for content images.

### Lighthouse performance targets

- Target these Core Web Vitals on **both mobile and desktop**, but **mobile first** (Lighthouse mobile uses slow 4G + CPU throttling and is the stricter check):
  - **LCP < 2.5s** — keep the hero image/poster as the LCP candidate; avoid render-blocking JS/CSS ahead of it.
  - **CLS < 0.1** — every image/video/ad slot has reserved dimensions or `aspect-ratio`.
  - **INP < 200ms** / **TBT < 200ms** — minimal client JS; defer non-critical work.
- Zero render-blocking third-party scripts on the landing page. Lazy-load below-the-fold or interaction-gated client components with `next/dynamic`.
- The hero video keeps `preload="metadata"`/`"none"` and a poster image (poster = real LCP candidate, not the video).
- **Fonts**: keep using `next/font/local` and `next/font/google` as already set up in `layout.tsx` (the `abygaer` display font + `Raleway`). Never add a `<link>` to Google Fonts or an external font `@import` — that defeats self-hosting and adds a network request. Always set `display: "swap"`.
- **Video**: the hero video (`public/videos/home/hero-banner.mp4`) must be self-hosted `<video>` with `muted`, `playsInline`, and `preload="none"` or `"metadata"` (never `"auto"` for a large hero background) if `autoPlay` is used. Provide a poster image so there's no blank frame before load, and treat the poster image as the real LCP candidate, not the video.
- **JS bundle discipline**: default every component to a Server Component. Only add `"use client"` at the leaf that actually needs interactivity/state/browser APIs (e.g. a mobile-nav toggle, a video-controls overlay, a scroll-triggered animation hook) — not at the top of a whole section.
- **Lazy load** non-critical, below-the-fold, or interaction-gated client components with `next/dynamic` (e.g. a lightbox/modal, a map embed, a heavy carousel library). Use `{ ssr: false }` only for things that truly can't render on the server (e.g. code touching `window` directly).
- Don't hand-roll animation/carousel libraries pulled in eagerly on the landing page if a lighter CSS-only approach covers the same effect — check bundle cost before adding a dependency.
- Avoid client-side data fetching for content that's static at build time (menu items, hours, addresses) — keep that as plain server-rendered data in the relevant `*.constant.ts` file (screen-scoped or `shared/constants/`) or fetched in a Server Component.
- Don't introduce `cookies()`/`headers()`/other request-time APIs in the root layout or the landing page unless truly needed — any usage there opts the *entire app* into dynamic rendering, killing static prerendering of the landing page.

## Accessibility rules

Accessibility is scored as its own Lighthouse category — these rules exist to keep it ≥ 90 (target 100) on both mobile and desktop, and they overlap with SEO/Best Practices.

- Use **semantic landmarks**: `<header>`, `<nav>` (with `aria-label` if there's more than one nav), `<main>`, `<footer>`, and `<section>` with a visible heading or `aria-labelledby` — don't build layout out of `<div>`/`<span>` where a semantic element fits.
- Exactly one `<h1>` per page; never skip heading levels (don't jump `h2` → `h4`) for styling reasons — control size with CSS.
- Interactive elements must use the right role: `<button>` for actions, `<a href>` for navigation. Never `<div onClick>` / `<span onClick>` — they're not keyboard-focusable or announceable.
- **Touch targets ≥ 44×44px** (Lighthouse flags anything tighter). On mobile aim for 48×48px. Pad/icon-only buttons accordingly.
- Icon-only or ambiguous controls (e.g. a hamburger, social link) must have an `aria-label` describing the action/destination.
- **Color contrast** ≥ 4.5:1 for normal text, ≥ 3:1 for large text and UI component boundaries. Check the cream/clay/ink palette combos — light text on `gold/25` overlays is the usual failure.
- Forms: every input has a real `<label>` (or `aria-label`), the correct `type`, sensible `autocomplete`, and errors wired via `aria-describedby` + `aria-invalid`.
- Provide a **"skip to content"** link as the first focusable element in `<body>` (visually hidden until focused) — see the pattern already used in the layout.
- Respect `prefers-reduced-motion: reduce` (the global override is already in `globals.css`); don't ship an animation that can't be disabled this way.
- Keep `lang` on `<html>` matching the content language (and `lang` on individual elements that differ).
- Never use `tabindex` > 0; prefer `tabindex={0}` for custom focusable elements and `tabindex={-1}` only for programmatic focus. Avoid positive tabindex entirely.
- Decorative images: `alt=""` + `aria-hidden="true"` so screen readers skip them (see Performance rules).

## Animation rules

- Prefer CSS transitions/animations (Tailwind utilities, `@keyframes` in `globals.css`) for simple hover/reveal/entrance effects — cheapest on the main thread, no JS shipped.
- For page/route-level transitions or shared-element effects (e.g. a menu item image morphing into a detail view), use React's `<ViewTransition>` (from `react`) per the `view-transitions` guide, gated behind `experimental.viewTransition: true` in `next.config.ts`. Without that flag it's unavailable — don't assume it just works.
- Any animation must respect `prefers-reduced-motion: reduce` — at minimum, zero out animation durations/delays under that media query (see the pattern in the view-transitions guide); don't ship a motion effect that can't be disabled this way.
- For scroll-triggered reveals, prefer `IntersectionObserver` in a small client hook (`shared/hooks/use-in-view.hook.ts`, or a screen-scoped `*.hook.ts` if only one screen needs it) over a heavy scroll-animation library, unless the design genuinely needs one (parallax, scrubbed timelines).
- Keep animation logic in the client leaf component that needs it (see JS bundle discipline above) — don't mark an entire section `"use client"` just to animate one child element.

## Section height: one screen, minus the header

The client's requirement is that **most sections fit in a single view** — the visitor sees a whole section at a time rather than a fragment of one. Three utilities in `globals.css` carry this; use them instead of writing heights per section.

- **`.section-screen`** — `height: var(--section-height)` (`calc(100svh - var(--header-height))`) plus `min-height: fit-content`. That second line is the **soft lock**, and it is not optional: a bare `height` with `overflow: hidden` silently deletes content the moment anything grows (a longer translation, 200% browser zoom per WCAG 1.4.4, a short laptop). Below `40rem` of viewport height the utility hands the height back to the content entirely.
- **`.section-anchor`** — `scroll-margin-top: var(--header-height)`. Goes on **every** section, capped or not, so in-page jumps land below the fixed bar rather than behind it.
- **`.section-snap`** / **`.section-snap-flush`** — opt in to scroll snapping. `html` carries `scroll-snap-type: y proximity` (never `mandatory`: it traps keyboard and trackpad users, and makes a section that has outgrown one screen unreachable). Use `.section-snap` for a `.section-screen` section; use `.section-snap-flush` for a full-bleed `100svh` photo/video hero the header is *drawn* floating over, where a header-offset snap would leave a strip of the previous section showing.
- **`var(--section-py)`** — `clamp(1.5rem, 5vh, 6rem)`. Replaces the fixed `py-24`/`pt-32`/`pt-36.5` values lifted off the 1400px Figma frames; on a 720p laptop those alone ate a third of the screen.

### Exemptions — sections that must NOT be height-capped

The rule applies to **presentational** sections, not to list or long-form ones. These are exempt by design, get `.section-anchor` only, and no snap:

- `story-detail-article.section.tsx` — the article body (~3757px). Capping it would cut the read or bury it in a nested scroller.
- `story-list.section.tsx` — the post feed; its height is whatever Sanity returns.
- `humans-values.section.tsx` — three stacked blocks of real copy; it fits on desktop after the padding trim but is allowed to grow on mobile rather than lose text.
- `menu-catalog.section.tsx` — capped per accordion *item* instead; see "Pick the right one-screen unit" below.

### Pick the right one-screen *unit*

The unit is not always the `<section>`. On `/menu`'s catalog it is **one open accordion item**: header + that category's own trigger + its artwork = one screenful, via `--menu-panel-height` (`100svh - header - trigger`) on the `AccordionContent`. The section itself is left uncapped — it is as tall as its six triggers plus whichever panel is open — and `.section-anchor`/`.section-snap` go on the **item**, so scrolling parks that item under the bar.

Capping the *section* there instead divides one screen between six triggers and the artwork: 384px of a 674px band goes to navigation and the menu pages render ~200px wide. Per item, the same pages get 432px. Before capping a section that contains a list of controls plus content, check which of the two the visitor is actually meant to see one of at a time.

**And the cap is `lg:`-only.** A one-screen height is only worth having when the content can actually fill it. The menu pages are portrait (ratio 0.708), so at phone widths they are *width*-bound — filling a 718px band would need 508px of width, more than the viewport has — and pinning the screen height there left 188px, 26% of the panel, as bare cream paper above and below the page. Below `lg` the panel carries no height at all: `w-full` plus the viewer's own `aspect-ratio` makes it exactly as tall as the page it shows.

That split is why `MenuSpreadViewer` keeps its inline `aspect-ratio` at every breakpoint rather than taking a "fill" flag. `aspect-ratio` only sizes a box while one dimension is auto, so a caller that pins a height from `lg` up silently switches the panel from artwork-driven to screen-driven — something an inline style, which has no breakpoints, cannot express on its own.

### How to make a section actually fit

Cap the section, then make **one** child absorb the slack — never let two things both assert a height:

- A text block that can overflow gets `min-h-0 flex-1` plus its own `overflow-y-auto` (the pattern `humans-chef-story` and `humans-people-story` were already built around).
- A photo gets `h-full` + `object-cover` and its cell gets `self-stretch` — a grid with `items-start` will otherwise size the cell to the image's intrinsic height and overflow the row.
- **Artwork that must stay whole** (the menu pages, the story collage) is sized **height-driven**: `h-full w-auto` with its `aspect-ratio`, in an `auto` grid track. The width then follows from the locked height, so the sheet fills its column with no letterboxing. Do not give it a fixed-fraction column and hope it fits.
- **Before pinning a height on a box that holds artwork, check which dimension actually binds at that viewport.** If the artwork is width-bound there, a pinned height buys nothing and shows as bare background — let the aspect ratio drive instead, and scope the pinned height to the breakpoints where it holds.
- Keep `width`/`height` attributes on every `<img>` even when CSS drives the size, so CLS stays at 0.

### Two traps

- **`.section-screen` and Tailwind's `lg:h-*` are the same specificity in the same layer**, so which wins is decided by source order, not by breakpoint — `.section-screen` was beating `lg:h-auto`. When a section wants a *different* height at a breakpoint, spell both sides as Tailwind arbitrary values (`h-[var(--section-height)] min-h-fit lg:h-auto`) so Tailwind's own ordering applies. See `humans-cta.section.tsx`.
- **The home illustration layer positions `top` as a share of section *height* but `width` as a share of section *width*.** Shorten a section and the artwork keeps its size while the box around it shrinks, so anything sitting low can land on the copy. After changing a section's height, re-measure `home-illustration.constant.ts` for that section at both breakpoints. (Artwork bleeding past the *bottom* edge is often intentional — check the comp before "fixing" it.)

## Mobile & desktop rules

Lighthouse runs separately for mobile and desktop — both must pass, with **mobile as the stricter gate** (it applies slow-4G + CPU throttling).

- Build **mobile-first**: base styles target the smallest viewport, then progressively enhance with Tailwind `md:`/`lg:`/`xl:`. Don't start from desktop and scale down.
- **Touch targets ≥ 48×48 CSS px** on mobile (44 is Lighthouse's floor, 48 is the comfort target). Pay attention to icon-only buttons, nav links, and the mobile header — the current header's 46px-tall bar and 22px-tall CTA are below target and should be padded up.
- **Body/inputs ≥ 16px** to stop iOS Safari from auto-zooming on input focus. Use `text-base` (1rem) as the floor for body copy; go smaller only for labels/captions.
- **No hover-only interactions.** Every hover affordance (tooltips, dropdowns, reveal states) must have a tap/keyboard equivalent — there is no hover on touch.
- **Responsive media**: each `<img>`/`<picture>` needs `sizes` + a `srcset` with mobile-appropriate width steps so phones don't download desktop-sized assets (see Performance rules).
- Keep the mobile viewport free of horizontal overflow — test at 320px, 375px, and 768px. Use `overflow-x-hidden` only as a last resort; fix the root cause.
- Verify the layout at the standard breakpoints: 360 / 414 / 768 / 1024 / 1280 / 1536.

## Lighthouse quality gates (definition of done)

Every page/section is considered done only when it passes these gates on **both mobile and desktop**:

- **All four categories ≥ 90**: Performance, Accessibility, Best Practices, SEO (target 100 for Accessibility/SEO/Best Practices).
- Preempt the common, predictable failures before running Lighthouse:
  - Images without explicit dimensions → CLS.
  - Missing `alt` / `aria-hidden` on images.
  - Low-contrast text (especially cream/clay text on light or `gold/25` overlays).
  - Missing or mismatched `<html lang>` / `openGraph.locale` / `description`.
  - Tap targets < 44px.
  - Render-blocking or unused large JS/CSS on the landing page.
  - Oversized DOM, unoptimized/large images, non-modern image formats.
  - Missing `manifest.ts` / `<meta name="theme-color">` / canonical URL.
- **Required checks before closing a page**: `yarn build` must pass, `yarn lint` must be clean, and a Lighthouse run (mobile + desktop) must hit the gates above. Fix regressions before merging.
- When a gate can't be met for a legitimate reason, call it out explicitly with the tradeoff — don't silently ship a regression.

## General conventions to keep consistent with existing code

- Tailwind v4 via `@import "tailwindcss"` + CSS custom properties in `globals.css` (see the existing `--palette-*` / `--color-*` tokens) — add new design tokens there, don't hardcode hex values in components.
- TypeScript strict mode is on (`tsconfig.json`) — no `any` without a clear reason, no unchecked non-null assertions.
- Icons follow the existing `shared/components/icons/ic-*.tsx` + barrel pattern — new icons go there, same naming. Illustrations follow the same idea in `shared/components/illustrations/illus-*.tsx`.
- Run `yarn lint` (ESLint flat config) before considering a change done; Next.js 16 no longer runs lint as part of `next build`.

## Interactive primitives: use shadcn/ui, don't hand-roll accessibility

For any interactive UI primitive — accordion, dialog/modal, dropdown, tabs, popover, tooltip, select, toast, etc. — reach for **shadcn/ui** (Radix-backed) instead of hand-rolling the open/close state and ARIA wiring yourself. Radix gives correct keyboard nav, focus management, and `aria-*` attributes for free; re-implementing that from scratch is exactly the kind of accessibility bug this codebase's a11y rules (see above) are meant to prevent.

- **Install only the component(s) a task actually needs** — `npx shadcn@latest add <component>` (e.g. `accordion`), not the whole catalog. Each generated file lands in `src/shared/components/ui/<component>.tsx` per `components.json`'s aliases (`ui` → `@/shared/components/ui`, `utils` → `@/shared/lib/utils`, etc. — already wired to this project's `screens/`+`shared/` layout, not the shadcn-default `src/components`).
- **Never let `shadcn init` re-run over `globals.css`.** It ships a default neutral/oklch theme (`--background`, `--foreground`, `--accent`, etc.) that will stomp this project's cream/ink palette. If a future `add` command asks to overwrite `globals.css`, decline and wire any new CSS runtime it needs in by hand instead (see `globals.css`'s own `@theme inline` block for the accordion's open/close animation as a worked example).
  - **Bare `@keyframes` inside `@theme` are not enough** to get a Tailwind `animate-*` utility — Tailwind only generates the class if there's also an explicit `--animate-<name>: <name> <duration> <easing>;` line pointing at it. This project's `ui/accordion.tsx` ships with `data-open:animate-accordion-down`/`data-closed:animate-accordion-up` in its default classes, but those silently do nothing until both the `--animate-accordion-down`/`--animate-accordion-up` variables *and* their `@keyframes` are declared — check `globals.css` if a shadcn primitive's built-in transition/animation seems to not be firing.
  - Similarly, don't rely on `@import "<package>/tailwind.css"` for a dependency's runtime CSS (e.g. `shadcn/tailwind.css`) — in this project's Turbopack + Tailwind v4 setup that bare-specifier import silently resolves to nothing (no error, no CSS). Copy the specific keyframes/`@custom-variant`s actually needed straight into `globals.css` instead of importing the package's CSS file wholesale.
- **Treat the generated `ui/*.tsx` file as a primitive you don't restyle in place.** Its default classNames reference generic shadcn tokens (`bg-background`, `text-muted-foreground`, `ring-ring`, …) that don't exist in this project's theme and are intentionally left alone. Do the actual visual work with Tailwind at the **call site**, passing `className` — the project's `cn()` (`@/shared/lib/utils`, clsx + `tailwind-merge`) correctly lets your classes override the component's defaults instead of fighting them.
  - To suppress a piece of the primitive's built-in markup you can't reach via props (e.g. the chevron icon shadcn's `AccordionTrigger` always renders), target its `data-slot` with an arbitrary-variant selector rather than editing the generated file: `className="[&_[data-slot=accordion-trigger-icon]]:hidden"`.
- Keep using this project's own icon set (`shared/components/icons`) for any glyph that needs to match the Figma illustrations — only fall back to `lucide-react` (already a dependency via shadcn) for incidental chrome a component needs internally.
- **`ui/button.tsx`'s base classes force any child `<svg>` to 16px** via `[&_svg:not([class*='size-'])]:size-4` — a compound `:not()` selector that beats a plain `h-* w-*` utility on the icon regardless of source order. Size icons inside a `Button` with a `size-*` class (e.g. `size-[62px]`, `size-8`), not separate `h-*`/`w-*` — anything else silently renders at 16px no matter what height/width you pass.
- **After editing Tailwind classes inside a component already rendered by the dev server, verify computed styles, not just that the class string looks right in JSX.** This project's Turbopack + Tailwind v4 combo has repeatedly served stale CSS after edits (old rules lingering alongside new ones, sometimes in a broken order) — confirmed multiple times by diffing `getComputedStyle()` against the intended value. If a class that's clearly present in the DOM isn't taking visual effect, `rm -rf .next` and restart the dev server before assuming the CSS/selector logic itself is wrong.
