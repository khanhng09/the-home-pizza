'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { IcShare } from '@/shared/components/icons';
import { MenuPageFlip, MENU_PANEL_SIZES } from '@/shared/components/ui/menu-page-flip';
import { Reveal } from '@/shared/components/ui/reveal';
import type { MenuSpread } from '@/shared/constants/menu-spreads.constant';
import { DARK_PAPER_TILE, DARK_PAPER_TILE_SIZE } from '@/shared/constants/texture.constant';
import { responsiveImage } from '@/shared/lib/image';
import { cn } from '@/shared/lib/utils';

/** How long each page holds before the panel turns to the next one. */
export const HOME_MENU_INTERVAL_MS = 2000;

/** Warms the browser cache so the next page is decoded before it is turned
 * to — see the identical preloader on /menu's spread viewer. */
function preload(source: string | undefined, sizes: string) {
  if (!source) return;

  const { src, srcSet } = responsiveImage(source);
  const image = new window.Image();
  image.sizes = sizes;
  if (srcSet) image.srcset = srcSet;
  image.src = src;
}

interface HomeMenuPanelProps {
  spreads: readonly MenuSpread[];
  alt: string;
  /** Changing this restarts the panel at the first page. Pass the category
   * id: a newly picked category always opens on its first page. */
  resetKey: string;
  /** Which edge the first page of a new `resetKey` hinges on — ≥ 0 turns
   * forward, < 0 turns back (set by which way the visitor moved through
   * the category list, not by anything on this panel). */
  resetDirection?: number;
  sizes?: string;
  intervalMs?: number;
  className?: string;
}

/**
 * The home page's menu panel: one page at a time, turning forward on a
 * timer or on the visitor's own tap. The design gives it a single forward
 * arrow, not the prev/next pair /menu's own book spread has — that, the
 * two-up spread, and the cream theme are different enough from this that
 * the two no longer share a viewer. See `MenuSpreadViewer` under
 * `screens/menu` for /menu's version; both still turn pages through the
 * same low-level `MenuPageFlip`.
 *
 * Paints one static paper layer behind the pages, as a sibling of — not
 * inside — the scroll-in reveal, so it never scales/fades along with the
 * photo. It's painted once and never touched by the page-turn animation
 * either — see `MenuPageFlip`'s note on why that background moved out of
 * it.
 *
 * Sizes itself from the artwork's own aspect ratio rather than being
 * stretched to fill whatever height the caller hands it — the same reason
 * /menu's `MenuSpreadViewer` does the same. `HomeMenuShowcase` used to force
 * this panel's column to the section's own fixed height so the two columns
 * lined up; that fixed height was also what the copy column's own content
 * had to fit inside, so a longer translation or a wrapped category list
 * forced it into an internal scrollbar. Letting this panel's own ratio set
 * its height instead means the grid row (and with it the copy column) grows
 * to fit whichever side is taller, and the artwork always fills the panel
 * edge to edge with no paper showing through around it.
 */
export function HomeMenuPanel({
  spreads,
  alt,
  resetKey,
  resetDirection = 1,
  sizes = MENU_PANEL_SIZES,
  intervalMs = HOME_MENU_INTERVAL_MS,
  className,
}: HomeMenuPanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const tCommon = useTranslations('common');
  const rootRef = useRef<HTMLDivElement>(null);

  // Auto-advance only runs while the panel is on screen — left running in
  // the background it would page through every spread and pull down
  // megabytes the visitor never looks at.
  const isOnScreen = useInView(rootRef, { amount: 0.2 });

  // A backgrounded tab still reports the panel as in view, so the timer
  // needs its own visibility check too — see the identical guard on
  // /menu's spread viewer for the failure mode this avoids.
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const sync = () => setIsPageVisible(document.visibilityState === 'visible');

    sync();
    document.addEventListener('visibilitychange', sync);

    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const [active, setActive] = useState({ key: resetKey, index: 0, direction: resetDirection });

  // Adjusting state during render, not in an effect — see the identical
  // pattern on /menu's spread viewer for why.
  if (active.key !== resetKey) {
    setActive({ key: resetKey, index: 0, direction: resetDirection });
  }

  const index = active.key === resetKey ? active.index : 0;
  const page = spreads[index];

  const stepForward = useCallback(() => {
    setActive((previous) => ({
      ...previous,
      index: (previous.index + 1) % spreads.length,
      direction: 1,
    }));
  }, [spreads.length]);

  useEffect(() => {
    if (prefersReducedMotion || !isOnScreen || !isPageVisible || isPaused) return;
    if (spreads.length < 2) return;

    const timer = window.setTimeout(() => {
      setActive((previous) => ({
        ...previous,
        index: (previous.index + 1) % spreads.length,
        direction: 1,
      }));
    }, intervalMs);

    return () => window.clearTimeout(timer);
  }, [spreads.length, index, intervalMs, isOnScreen, isPageVisible, isPaused, prefersReducedMotion]);

  // One page ahead is enough: the timer never skips, so anything further
  // out would just be speculative bandwidth.
  useEffect(() => {
    preload(spreads[(index + 1) % spreads.length]?.src, sizes);
  }, [spreads, index, sizes]);

  if (!page) return null;

  // The panel's own height, not the caller's — driven by the category's
  // first page rather than whichever page happens to be showing, so
  // turning to the rare odd-cropped page (see `menu-spreads.constant.ts`'s
  // note on `dac-san-viet`'s last pair) letterboxes a couple of px inside
  // a stable box instead of resizing the whole panel — and with it the grid
  // row, the copy column beside it, and the illustration layer's offsets —
  // on every turn.
  const panelRatio = `${spreads[0].width} / ${spreads[0].height}`;

  return (
    <div
      ref={rootRef}
      className={cn('relative w-full', className)}
      style={{ aspectRatio: panelRatio }}
    >
      {/* The panel's own dó-paper, under everything — a sibling of the
          reveal below, not a child of it, so scrolling the section into
          view never scales or fades it. Painted once; every page turn
          after that just changes what's on top of it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink bg-repeat"
        style={{ backgroundImage: `url(${DARK_PAPER_TILE})`, backgroundSize: DARK_PAPER_TILE_SIZE }}
      />

      <Reveal variant="zoom-in" className="absolute inset-0" durationMs={1000} delayMs={150}>
        {/* Sized to this page's own aspect ratio, not stretched to the
            panel's — otherwise `object-contain` letterboxes inside a
            full-panel sheet, and the flip's shading (which paints across
            the whole sheet, not just the photo) darkens that letterbox
            gap against the background pattern behind it. Centering it
            here instead means the gap, if any, is *outside* the sheet —
            plain static background that the animation never touches. */}
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative h-full max-w-full" style={{ aspectRatio: `${page.width} / ${page.height}` }}>
            <MenuPageFlip
              pageKey={`${resetKey}-${index}`}
              src={page.src}
              alt={alt}
              width={page.width}
              height={page.height}
              direction={active.direction}
              sizes={sizes}
            />

            {/* Anchored to the page itself, not the panel, so it stays on
                the artwork's bottom-right corner the way the design draws
                it (Figma: 32x32 at x1348/y2711 on the 1400 frame — 20px in
                from the right edge, 18px up from the bottom). The sheet is
                centred with margins either side, so anchoring to the panel
                instead would float the arrow off the page and into the
                background.

                The design has no pill behind the glyph; `size-11` on the
                button with a `size-8` icon keeps the 44px tap target the
                a11y rules require while the *icon* still lands on the
                design's own offsets (44-32 = 6px of padding a side, so the
                button insets are 20-6 and 18-6). The drop shadow is the
                one addition: a bare light glyph on a photo can fall under
                the 3:1 contrast floor over a pale frame, and this holds it
                legible without adding a background the design doesn't have. */}
            {spreads.length > 1 && (
              <button
                type="button"
                onClick={stepForward}
                onPointerEnter={() => setIsPaused(true)}
                onPointerLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                aria-label={tCommon('nextPage')}
                className="absolute bottom-3 right-3.5 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full text-cream transition-transform duration-300 [filter:drop-shadow(0_1px_3px_rgb(0_0_0/0.55))] hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <IcShare aria-hidden="true" className="size-8" />
              </button>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
