'use client';

import { useState } from 'react';
import { MenuRegionList } from './menu-region-list';
import { cn } from '@/shared/lib/utils';

/**
 * Width reserved for the text column at `lg` and up — a fixed value rather
 * than a fraction of the row, for two reasons at once:
 *
 * 1. It's what lets the map ignore the row entirely and bleed across the
 *    full section width instead of being confined to whatever `max-w-1400`
 *    minus this column works out to (see the map wrapper below).
 * 2. Because it never changes with viewport width, the copy always wraps
 *    the same way at any `lg`+ width, so `PARAGRAPHS_HEIGHT_DESKTOP_PX`
 *    (measured against this exact width) stays valid everywhere it applies.
 */
const TEXT_COLUMN_WIDTH = '34rem';

/**
 * Fixed height — not a floor, an actual cap — for the paragraphs block
 * specifically (not the greeting above it, not the region list below it),
 * with the block scrolling internally past it. Two things depend on this
 * being a hard cap rather than a `min-height`:
 *
 * 1. It's what keeps the region list (and everything below the section,
 *    since the section itself is a fixed `h-svh`) from shifting every time
 *    a region with a different paragraph count is picked — the greeting is
 *    always one line and the list is always the same fixed set of items,
 *    so once this one piece stops growing, the whole column does too.
 * 2. It's what guarantees the column never pushes the map/list past the
 *    bottom of the `h-svh` section, where `overflow-hidden` would otherwise
 *    silently clip them — a `min-height` alone doesn't protect against
 *    that, since content taller than the floor just grows past it.
 *
 * Mobile gets its own (shorter) cap: it has far less vertical budget once
 * the map and region list below it are accounted for inside one `h-svh`
 * screen, and its narrower column already wraps text into more lines at
 * the same character count. Both were sized against the longest region's
 * copy (Bắc Bộ/Nam Bộ) at each breakpoint's actual column width, with some
 * headroom for font-rendering differences across browsers — see the
 * `overflow-y-auto` on the block itself for what happens past that.
 */
const PARAGRAPHS_HEIGHT_MOBILE_PX = 240;
const PARAGRAPHS_HEIGHT_DESKTOP_PX = 480;

export interface MenuHeroRegion {
  id: string;
  label: string;
  mapImage: string;
  /** Copy shown while this region is selected. */
  paragraphs: string[];
}

interface MenuHeroExplorerProps {
  greeting: string;
  /** Shown before any region is picked — the whole map, north to south. */
  introParagraphs: string[];
  introMapImage: string;
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
  mapAlt,
  regions,
}: MenuHeroExplorerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeRegion = regions.find((region) => region.id === activeId) ?? null;
  const paragraphs = activeRegion?.paragraphs ?? introParagraphs;
  const mapImage = activeRegion?.mapImage ?? introMapImage;

  // All five maps stay mounted and crossfade, so switching regions never
  // flashes the panel empty while the next one downloads. Only the intro
  // map is the LCP candidate (it's what paints on first load); the four
  // region maps load lazily since they're only ever seen after a click.
  const mapSources = [introMapImage, ...regions.map((region) => region.mapImage)].filter(
    (source, index, all) => all.indexOf(source) === index
  );

  const renderMaps = (sizes: string) =>
    mapSources.map((source) => {
      const isIntro = source === introMapImage;
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
            // No opacity transition here on purpose either: animating
            // `opacity` on these multi-megapixel, object-fit: cover images
            // made the compositor drop a repaint and leave the panel blank
            // until something unrelated forced a re-render — reproduced
            // only when the swap was animated, never on an instant one.
            'object-cover object-left',
            source === mapImage ? 'opacity-100' : 'opacity-0'
          )}
          loading={isIntro ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={isIntro ? 'high' : undefined}
        />
      );
    });

  return (
    <div className="relative w-full">
      {/* Map, desktop — full-bleed: sized off the section's own edges
          rather than `max-w-1400`, so on wide viewports it keeps using the
          extra width instead of stopping at whatever share a two-column
          `1.72fr` split inside that container would have given it. Height
          matches the row's height exactly — which is now constant on its
          own (see `PARAGRAPHS_HEIGHT_DESKTOP_PX`) — via the shared
          `relative` ancestor below, so `object-cover` fills it edge to edge
          with no letterboxing. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden lg:block"
        style={{ width: `calc(100% - ${TEXT_COLUMN_WIDTH} - 2.25rem)` }}
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
          without needing to also floor it here, and it's guaranteed to fit
          inside the section's `h-svh` rather than merely usually fitting. */}
      <div
        className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 px-4 pt-24 pb-12 md:px-6 lg:grid-cols-[1fr_var(--text-col)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-6 lg:px-8 lg:pt-20 lg:pb-10"
        style={{ '--text-col': TEXT_COLUMN_WIDTH } as React.CSSProperties}
      >
        {/* Text column — first on mobile, top-right on desktop */}
        <div className="order-1 flex flex-col items-start gap-4 lg:order-none lg:col-start-2 lg:row-start-1">
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
            text on desktop */}
        <div className="order-2 w-full lg:order-none lg:col-start-2 lg:row-start-2">
          <MenuRegionList regions={regions} activeId={activeId} onSelect={setActiveId} />
        </div>

        {/* Map, mobile — inline, same aspect-boxed treatment as before;
            the full-bleed desktop version above replaces it at `lg`. */}
        <div className="relative order-3 lg:hidden">
          <div className="relative aspect-[862/585] w-full">{renderMaps('100vw')}</div>
        </div>
      </div>
    </div>
  );
}
