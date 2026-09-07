'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { IcChevronRight, IcShare } from '@/shared/components/icons';
import { MenuPageFlip, MENU_PANEL_SIZES } from '@/shared/components/ui/menu-page-flip';
import { Reveal } from '@/shared/components/ui/reveal';
import type { MenuSpread } from '@/shared/constants/menu-spreads.constant';
import { responsiveImage } from '@/shared/lib/image';
import { cn } from '@/shared/lib/utils';

/** How long each page holds before the panel turns to the next one. */
export const HOME_MENU_INTERVAL_MS = 4000;

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
 * Fills its whole grid cell with a solid background (the design's flat
 * clay panel, not the dark dó-paper the rest of the section uses) rather
 * than being sized to the artwork's own aspect ratio — that sizing now
 * happens one level in, on the box that actually holds the page image, so
 * the sheet reads as artwork placed on a mat rather than wallpaper filling
 * the column edge to edge.
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
      // The clay mat: fills the whole grid cell and centers the artwork
      // box inside its own padding, so the sheet reads as artwork placed on
      // a mat rather than a full-bleed image.
      className={cn(
        'relative flex w-full items-center justify-center bg-gold p-6 sm:p-10 lg:h-full lg:p-14',
        className
      )}
    >
      {/* Sized to the category's own aspect ratio, then capped to the mat's
          padded content box — mobile is width-driven (`w-full` + ratio ->
          height follows); desktop is height-driven (`h-full w-auto` + ratio
          -> width follows), same reason /menu's `MenuSpreadViewer` does the
          same. `max-w-full`/`max-h-full` are what keep the artwork "vừa đủ"
          (just large enough) instead of stretching to fill the mat. */}
      <div
        className="relative h-auto max-h-full w-full max-w-full lg:h-full lg:w-auto"
        style={{ aspectRatio: panelRatio }}
      >
        <Reveal variant="fade" className="absolute inset-0" durationMs={1000} delayMs={150}>
          {/* Sized to this page's own aspect ratio, not stretched to the
              panel's — otherwise `object-contain` letterboxes inside a
              full-panel sheet, and the flip's shading (which paints across
              the whole sheet, not just the photo) darkens that letterbox
              gap against the background pattern behind it. Centering it
              here instead means the gap, if any, is *outside* the sheet —
              plain static background that the animation never touches. */}
          <div className="flex h-full w-full items-center justify-center">
            <div
              className="relative h-full max-w-full shadow-2xl"
              style={{ aspectRatio: `${page.width} / ${page.height}` }}
            >
              <MenuPageFlip
                pageKey={`${resetKey}-${index}`}
                src={page.src}
                alt={alt}
                width={page.width}
                height={page.height}
                direction={active.direction}
                sizes={sizes}
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* Anchored to the mat's own corner, not the artwork — the mat is
          always bigger than the sheet now, so anchoring to the page (as
          this used to) would float the control wherever that page's own
          ratio happens to end, instead of a stable spot on the panel. */}
      {spreads.length > 1 && (
        <button
          type="button"
          onClick={stepForward}
          onPointerEnter={() => setIsPaused(true)}
          onPointerLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          aria-label={tCommon('nextPage')}
          className="absolute bottom-3 right-3 flex size-11 cursor-pointer items-center justify-center text-white transition-colors hover:text-cream"
        >
          <IcShare className="size-8" />
        </button>
      )}
    </div>
  );
}
