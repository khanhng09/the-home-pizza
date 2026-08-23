'use client';

import { useState } from 'react';
import { MenuRegionList } from './menu-region-list';
import { cn } from '@/shared/lib/utils';

/**
 * Width reserved for the text column at `xl` and up — a fixed value rather
 * than a fraction of the row, for two reasons at once:
 *
 * 1. It's what lets the map ignore the row entirely and bleed across the
 *    full section width instead of being confined to whatever `max-w-1400`
 *    minus this column works out to (see the map wrapper below).
 * 2. Because it never changes with viewport width, the copy always wraps
 *    the same way at any `xl`+ width, so `PARAGRAPHS_HEIGHT_DESKTOP_PX`
 *    (measured against this exact width) stays valid everywhere it applies.
 *
 * Between `lg` and `xl` (small desktop / laptop widths) there isn't enough
 * room to give the map a real side-by-side column without cropping most of
 * the illustration out via `object-cover object-left` — so in that range
 * the map bleeds full width as a background instead, and the text column +
 * region list float on top of it as a translucent card (see the `lg:`/`xl:`
 * pairs below). `xl:` switches back to the tidy side-by-side split.
 */
const TEXT_COLUMN_WIDTH = '34rem';

/**
 * Fixed height — not a floor, an actual cap — for the paragraphs block
 * specifically (not the greeting above it, not the region list below it),
 * with the block scrolling internally past it rather than growing.
 *
 * This is what keeps the region list below it (and, at `lg` and up where
 * the section is a fixed `h-svh`, the map alongside it) from shifting every
 * time a region with a different paragraph count is picked — the greeting
 * is always one line and the list is always the same fixed set of items,
 * so once this one piece stops growing, the whole column does too. Below
 * `lg` the section scrolls with the page instead of clipping at one
 * viewport (see `MenuHeroSection`), so this cap there is purely about that
 * shift, not about avoiding clipping — nothing below it can run off the
 * bottom of anything anymore.
 *
 * Mobile gets its own (shorter) cap than desktop: its narrower column wraps
 * the same copy into more lines, so matching desktop's cap would either cut
 * mobile off much earlier relative to its content or, sized for mobile's
 * line count, waste a lot of vertical space on desktop's wider column. Both
 * were sized against the longest region's copy (Bắc Bộ/Nam Bộ) at each
 * breakpoint's actual column width, with some headroom for font-rendering
 * differences across browsers — see the `overflow-y-auto` on the block
 * itself for what happens past that.
 */
const PARAGRAPHS_HEIGHT_MOBILE_PX = 240;
const PARAGRAPHS_HEIGHT_DESKTOP_PX = 480;

export interface MenuHeroRegion {
  id: string;
  label: string;
  mapImage: string;
  /**
   * Mobile-only counterpart to `mapImage` — the same illustration, trimmed
   * to its content's bounding box (see `introMobileMapImage` below for why
   * mobile can't just reuse `mapImage`).
   */
  mobileMapImage: string;
  /** Copy shown while this region is selected. */
  paragraphs: string[];
}

interface MenuHeroExplorerProps {
  greeting: string;
  /** Shown before any region is picked — the whole map, north to south. */
  introParagraphs: string[];
  introMapImage: string;
  /**
   * A separate, content-trimmed asset for mobile — not just a smaller crop
   * of `introMapImage`. The desktop source has its illustration sitting in
   * only the left ~45% of the canvas, with blank margin filling the rest
   * (desktop's `object-cover object-left` relies on that margin — see the
   * desktop map wrapper below). Mobile shows the map with `object-contain`
   * so the whole thing is always visible at once; pointed at the same wide
   * source, `contain` would render mostly blank margin and shrink the
   * actual artwork to a fraction of the box. This asset is that source run
   * through `sharp().trim()` down to just the artwork, so `contain` has
   * nothing but map to fit.
   */
  introMobileMapImage: string;
  mapAlt: string;
  regions: MenuHeroRegion[];
}

/**
 * The hero's map + region selector, and the copy that answers it.
 *
 * Picking a region swaps two things at once — the map illustration and the
 * paragraph beside it — which is why they are held together here rather
 * than left as three independent pieces of the section.
 *
 * Nothing is selected on first paint: the opening state is the full map,
 * north to south, with the general introduction. That is the design's own
 * starting frame, and it also means the selector reads as "narrow this
 * down" rather than as a set of tabs one of which happens to be open.
 *
 * Only a click picks a region — hovering the list is purely a visual
 * affordance (see `MenuRegionList`) and never changes what's shown here.
 */
export function MenuHeroExplorer({
  greeting,
  introParagraphs,
  introMapImage,
  introMobileMapImage,
  mapAlt,
  regions,
}: MenuHeroExplorerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeRegion = regions.find((region) => region.id === activeId) ?? null;
  const paragraphs = activeRegion?.paragraphs ?? introParagraphs;
  const mapImage = activeRegion?.mapImage ?? introMapImage;
  const mobileMapImage = activeRegion?.mobileMapImage ?? introMobileMapImage;

  // All five maps stay mounted and crossfade, so switching regions never
  // flashes the panel empty while the next one downloads. The intro map is
  // still the LCP candidate (it's what paints on first load) — see
  // `MenuHeroSection`'s `<link rel="preload">` for how it actually gets
  // priority, since `loading="lazy"` below applies to it too now. The four
  // region maps stay genuinely lazy, since they're only ever seen after a
  // click.
  const mapSources = [introMapImage, ...regions.map((region) => region.mapImage)].filter(
    (source, index, all) => all.indexOf(source) === index
  );
  const mobileMapSources = [
    introMobileMapImage,
    ...regions.map((region) => region.mobileMapImage),
  ].filter((source, index, all) => all.indexOf(source) === index);

  const renderMaps = (sizes: string) =>
    mapSources.map((source) => {
      return (
        <img
          key={source}
          src={source}
          alt={source === mapImage ? mapAlt : ''}
          aria-hidden={source === mapImage ? undefined : true}
          width={1600}
          height={979}
          sizes={sizes}
          className={cn(
            'absolute inset-0 size-full',
            // `object-cover object-left` everywhere, not `contain`: every
            // source has its artwork sitting in the left/upper portion of
            // the canvas with blank margin to the right (see the source
            // PNGs) — `contain` shows that blank margin too, shrinking the
            // actual illustration down to a fraction of the box. `cover`
            // fills the box and `object-left` crops the blank margin
            // instead of the illustration.
            //
            // The opacity crossfade used to be instant (no `transition-*`):
            // animating opacity on these multi-megapixel, object-fit: cover
            // images made the compositor drop a repaint and leave the panel
            // blank until something unrelated forced a re-render.
            // `will-change-[opacity]` (NOT the bare `will-change-opacity` —
            // that's not a real Tailwind utility and silently no-ops) fixes
            // it by promoting each layer onto its own compositor layer up
            // front instead of only once the animation starts, which is
            // what the browser was dropping. Verified by clicking every
            // region repeatedly — both slowly and rapid-fire — at both
            // breakpoints. (Separately, this dev preview sometimes shows a
            // blank map right on first paint, before any click — that's a
            // pre-existing, unrelated first-paint quirk that also happens
            // with no transition at all; an incidental repaint, e.g. a
            // scroll, always clears it.)
            'object-cover object-left will-change-[opacity] transition-opacity duration-500 ease-out',
            source === mapImage ? 'opacity-100' : 'opacity-0'
          )}
          // Always `lazy`, intro included — even the LCP candidate. Eager +
          // `fetchPriority="high"` here would fetch this on every device,
          // desktop or mobile, since a `display:none` ancestor (this whole
          // set is `hidden` below `lg`) doesn't stop an eager image from
          // loading, only from painting. `MenuHeroSection` gives the intro
          // image its priority instead, via a `media`-gated
          // `<link rel="preload">` per breakpoint — only the matching
          // device's request actually fires, and by the time this `<img>`
          // mounts the resource is already in cache, so `lazy` here costs
          // nothing.
          loading="lazy"
          decoding="async"
        />
      );
    });

  // Mobile's own set, from the content-trimmed assets (see
  // `introMobileMapImage`) — `contain`, not `cover`, so the whole map is
  // always in view instead of `object-left`-cropped, and no `object-left`
  // since these sources have no blank margin left to crop past.
  //
  // The intro/Bắc Bộ/Trung Bộ/Nam Bộ assets are all cropped to one shared
  // rectangle (the union of their content bounds), not each trimmed to its
  // own tightest bounding box — that was the bug behind the map appearing
  // to "jump" between some regions and not others. Independent trims give
  // each file a different canvas size depending on where that region's
  // food-icon overlays happen to extend the content bounds, so `contain`
  // scaled/positioned the *shared mainland silhouette* differently per
  // image even though the silhouette itself is pixel-identical across all
  // of them in the source `-2k.png` files. With one shared crop rect, all
  // four mainland assets are byte-identical in size (1102×1120) and the
  // coastline sits at the exact same spot in every one — only the food
  // icons differ, so switching between them now reads as icons fading in
  // and out over a static map, not the map itself shifting. Phú Quốc is
  // exempt: it's a genuinely different, independently-zoomed island
  // composition, not a crop of the same mainland shape, so there's no
  // shared rectangle that would make sense for it to share.
  //
  // The shared rect itself is tighter than a plain content bounding box: a
  // straight non-transparent bbox still includes a wide, mostly-empty strip
  // of open sea (plus sparse, barely-visible scattered-island specks) to
  // the mainland's east, which made the actual map read as small inside
  // its box even though nothing was technically cropped. It's cropped by
  // *pixel density* instead (a column/row needs a meaningful amount of
  // non-transparent content to count, not just one stray island dot), with
  // ~30px of padding kept around that tighter bound — so the mainland +
  // food icons now fill most of the box instead of a third of it.
  const renderMobileMaps = () =>
    mobileMapSources.map((source) => {
      return (
        <img
          key={source}
          src={source}
          alt={source === mobileMapImage ? mapAlt : ''}
          aria-hidden={source === mobileMapImage ? undefined : true}
          width={1102}
          height={1120}
          sizes="100vw"
          className={cn(
            // See the desktop set's comment on `will-change-[opacity]` above —
            // same fix for the same dropped-repaint-on-swap issue.
            'absolute inset-0 size-full object-contain object-center will-change-[opacity] transition-opacity duration-500 ease-out',
            source === mobileMapImage ? 'opacity-100' : 'opacity-0'
          )}
          // Always `lazy` — see the desktop set's comment above. Same
          // reasoning, mirrored: this set is the one `hidden` (via
          // `lg:hidden`) from `lg` up, and `MenuHeroSection`'s
          // `(max-width: 1023.98px)` preload is what gets its own intro
          // image fetched early on the devices that actually show it.
          loading="lazy"
          decoding="async"
        />
      );
    });

  return (
    <div
      className="relative w-full"
      style={{ '--text-col': TEXT_COLUMN_WIDTH } as React.CSSProperties}
    >
      {/* Map, desktop — full-bleed: sized off the section's own edges
          rather than `max-w-1400`, so on wide viewports it keeps using the
          extra width instead of stopping at whatever share a two-column
          `1.72fr` split inside that container would have given it. Height
          matches the row's height exactly — which is now constant on its
          own (see `PARAGRAPHS_HEIGHT_DESKTOP_PX`) — via the shared
          `relative` ancestor below, so `object-cover` fills it edge to edge
          with no letterboxing.

          Width is a CSS var so it can differ by breakpoint without a JS
          media-query hook: full width from `lg` (the map is a background
          the text/list float over in that range — see the foreground grid
          below), then narrowed at `xl` to make room for the side-by-side
          text column once there's enough room to do that without cropping
          the illustration. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden lg:block [--map-w:100%] xl:[--map-w:calc(100%_-_var(--text-col)_-_2.25rem)]"
        style={{ width: 'var(--map-w)' }}
      >
        {renderMaps('60vw')}
      </div>

      {/* Foreground: text, tabs, and (mobile only) the map inline. Kept at
          the design's own 1400px canvas width and centered, same as
          before — only the map broke out of it. No explicit height on this
          grid itself: the greeting is always one line, the region list is
          always the same 4 items, and the paragraphs block below is capped
          to a fixed height (see `PARAGRAPHS_HEIGHT_MOBILE_PX`/
          `PARAGRAPHS_HEIGHT_DESKTOP_PX`) with the overflow scrolling
          internally — so the row's total height is already constant
          without needing to also floor it here. At `lg` and up, where the
          section really is a fixed `h-svh` (see `MenuHeroSection`), that
          constant height is what keeps the row inside it; below `lg` the
          section now grows and scrolls with the page instead, so nothing
          here needs to fit inside a fixed budget at all.

          The two-column split only kicks in at `xl` — from `lg` to just
          under `xl` the grid stays single-column so the text/list items sit
          directly on top of the full-bleed map above (each carries its own
          `lg:`/`xl:` card treatment below) instead of being squeezed into a
          narrow side column. */}
      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-4 pt-21.5 pb-8 md:px-6 lg:gap-5 lg:px-8 lg:pt-36.5 lg:pb-10 xl:grid-cols-[1fr_var(--text-col)] xl:grid-rows-[auto_auto] xl:items-start xl:gap-6">
        {/* Text column — first on mobile, top-right on desktop. The
            `lg:`/`xl:` pair here is the overlay card: translucent cream
            panel while the map bleeds full-width behind it (`lg` only),
            removed once the two-column split gives it its own clear space
            (`xl`). */}
        <div className="order-1 flex w-full flex-col items-start gap-4 rounded-2xl lg:order-none lg:ml-auto lg:w-[var(--text-col)] xl:col-start-2 xl:row-start-1 xl:m-0 xl:w-auto">
          <p className="font-sans text-lg tracking-wide text-ink lg:text-2xl">{greeting}</p>

          <div
            // Keyed on the selection so the copy crossfades in rather than
            // swapping between two blocks of text with no transition.
            // `h`/`lg:h` cap this block's height (see
            // `PARAGRAPHS_HEIGHT_MOBILE_PX`/`PARAGRAPHS_HEIGHT_DESKTOP_PX`)
            // so the region list below it never shifts when a shorter/
            // longer region is picked — `overflow-y-auto` is what lets a
            // region whose copy doesn't fit that cap still be read in full.
            key={activeId ?? 'intro'}
            className="flex w-full animate-[fade-in_400ms_ease-out_both] flex-col gap-5 overflow-y-auto pr-2 text-justify font-sans text-sm text-ink h-[var(--paragraphs-h-mobile)] lg:h-[var(--paragraphs-h-desktop)] lg:text-lg"
            style={
              {
                '--paragraphs-h-mobile': `${PARAGRAPHS_HEIGHT_MOBILE_PX}px`,
                '--paragraphs-h-desktop': `${PARAGRAPHS_HEIGHT_DESKTOP_PX}px`,
              } as React.CSSProperties
            }
          >
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Region tabs — between the text and the map on mobile, under the
            text on desktop. Same overlay-card treatment as the text column
            above from `lg` to just under `xl`. */}
        <div className="order-2 w-full rounded-2xl lg:order-none lg:ml-auto lg:w-[var(--text-col)] xl:col-start-2 xl:row-start-2 xl:m-0 xl:w-full">
          <MenuRegionList regions={regions} activeId={activeId} onSelect={setActiveId} />
        </div>

        {/* Map, mobile — its own content-trimmed assets shown with
            `object-contain` (see `introMobileMapImage`), not the desktop
            set: those have a wide blank margin baked in for `object-cover`
            to crop, which `contain` would show instead of cropping,
            shrinking the actual map down to a sliver of the box. The
            `aspect-[1102/1120]` box matches the shared crop rect the
            intro/Bắc Bộ/Trung Bộ/Nam Bộ assets all share exactly (see
            `renderMobileMaps` above) — Phú Quốc's own different aspect just
            letterboxes slightly inside it via `contain`, which is fine since
            it's already a visually distinct island view. The full-bleed
            desktop version above replaces this from `lg`.

            `max-h-[460px]` caps how tall that aspect-ratio box is allowed to
            get: aspect-ratio ties height to the box's own width, which is
            fine on an actual phone (max ~430px wide, so ~440px tall — this
            asset is nearly square, taller than the old wide crop was) but
            balloons past 800px tall on wider "still under `lg`" widths like
            a tablet or a resized browser window. The section scrolls with
            the page below `lg` (see `MenuHeroSection`), so an uncapped box
            wouldn't get clipped by anything anymore — this cap is purely
            about not letting the map get comically tall relative to the
            text above it at those in-between widths. A no-op at real phone
            widths (aspect-driven height stays under it); `object-contain`
            on the images inside handles fitting into whatever box results,
            capped or not. */}
        <div className="relative order-3 lg:hidden">
          <div className="relative aspect-[1102/1120] max-h-[460px] w-full">
            {renderMobileMaps()}
          </div>
        </div>
      </div>
    </div>
  );
}
