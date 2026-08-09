'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { Reveal } from '@/shared/components/ui/reveal';
import { responsiveImage } from '@/shared/lib/image';
import { MENU_SPREAD_INTERVAL_MS } from '../constants/home.constant';
import { HomeMenuCategoryList } from './home-menu-category-list';
import { HomeMenuPageFlip, MENU_PANEL_SIZES } from './home-menu-page-flip';

export interface HomeMenuShowcaseSpread {
  src: string;
  width: number;
  height: number;
}

export interface HomeMenuShowcaseCategory {
  id: string;
  href: string;
  label: string;
  linkLabel: string;
  alt: string;
  spreads: readonly HomeMenuShowcaseSpread[];
}

interface HomeMenuShowcaseProps {
  categories: HomeMenuShowcaseCategory[];
  /** The section's server-rendered copy block (heading, paragraph, CTA,
   * background layers) — kept out of this client bundle by passing it
   * through as children. */
  children: ReactNode;
}

/** Warms the browser cache so the next sheet is decoded before it is
 * turned to. Without it every 2s tick uncovers an image that only starts
 * downloading once it mounts, and the panel shows a blank sheet. */
function preload(source: string | undefined) {
  if (!source) return;
  const { src, srcSet } = responsiveImage(source);
  const image = new window.Image();
  // `sizes`/`srcset` first: the browser resolves the candidate when `src`
  // is assigned, so setting them after would warm the wrong file.
  image.sizes = MENU_PANEL_SIZES;
  if (srcSet) image.srcset = srcSet;
  image.src = src;
}

/**
 * Owns the menu section's state: which category is selected, and which of
 * that category's spreads the panel is showing. It sits above both the
 * list and the image panel because they live in different grid columns,
 * so nothing smaller can hold it.
 */
export function HomeMenuShowcase({ categories, children }: HomeMenuShowcaseProps) {
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  // Auto-advance only runs while the section is on screen. Left running,
  // it would page through every spread in the background and pull down
  // megabytes the visitor never looks at. Tracked against the whole
  // showcase rather than just the image panel — below `lg` the grid
  // stacks the list above the image, so scoping this to the image panel
  // alone left the timer off whenever a visitor was reading the list
  // without the (much taller, further down) panel also in view.
  const isOnScreen = useInView(rootRef, { amount: 0.2 });

  // "On screen" is not the same as "being painted". A backgrounded tab
  // still reports the section as in view, so the timer kept ticking with
  // nothing to render: every tick mounted a new page and fetched its
  // image, while the page it replaced could never finish its exit (Motion
  // is driven by rAF, which the tab has none of) and so was never
  // unmounted. Left alone for a couple of minutes that stacks the whole
  // run of spreads in the panel — measured 16 pages, and 16 downloads —
  // which then resolve in a heap the moment the visitor comes back.
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const sync = () => setIsPageVisible(document.visibilityState === 'visible');

    sync();
    document.addEventListener('visibilitychange', sync);

    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  // Direction rides along with the indices so the panel knows which edge
  // to hinge on — moving down the list turns the page forward, moving
  // back up turns it back, and the timer always turns forward.
  const [active, setActive] = useState({ categoryIndex: 0, spreadIndex: 0, direction: 1 });

  const activeCategory = categories[active.categoryIndex];
  const activeSpread = activeCategory.spreads[active.spreadIndex] ?? activeCategory.spreads[0];

  const select = useCallback((categoryIndex: number) => {
    setActive((previous) =>
      categoryIndex === previous.categoryIndex
        ? previous
        : {
            categoryIndex,
            // A newly picked category always starts at its first spread —
            // the visitor asked for that category, not for wherever the
            // last one's timer happened to be.
            spreadIndex: 0,
            direction: categoryIndex > previous.categoryIndex ? 1 : -1,
          }
    );
  }, []);

  // Keyed on both indices, so picking a category by hand restarts the
  // clock and its first spread gets a full interval rather than whatever
  // was left of the previous one's.
  useEffect(() => {
    if (prefersReducedMotion || !isOnScreen || !isPageVisible) return;

    const spreadCount = categories[active.categoryIndex].spreads.length;
    if (spreadCount < 2) return;

    const timer = window.setTimeout(() => {
      setActive((previous) => ({
        ...previous,
        spreadIndex: (previous.spreadIndex + 1) % spreadCount,
        direction: 1,
      }));
    }, MENU_SPREAD_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [
    categories,
    active.categoryIndex,
    active.spreadIndex,
    isOnScreen,
    isPageVisible,
    prefersReducedMotion,
  ]);

  // One step ahead is enough: the timer never skips, so anything further
  // out would just be speculative bandwidth.
  useEffect(() => {
    const spreads = categories[active.categoryIndex].spreads;
    preload(spreads[(active.spreadIndex + 1) % spreads.length]?.src);
  }, [categories, active.categoryIndex, active.spreadIndex]);

  // Fetched the moment the pointer lands, not when the debounce fires —
  // that turns the 500ms wait into a head start, so an intentional hover
  // lands on an image that is already there.
  const prefetchCategory = useCallback(
    (categoryIndex: number) => preload(categories[categoryIndex].spreads[0]?.src),
    [categories]
  );

  return (
    // `flex-1`, not `h-full`: the section owns the design's height as a
    // `min-h` and lays this out as a flex column, so this has to take the
    // leftover height rather than resolve a percentage against a box whose
    // computed height is `auto`.
    <div ref={rootRef} className="grid grid-cols-1 lg:grid-cols-2 flex-1">
      {/* Content panel. On mobile the design gives it 371px of the section's
          932 (1981 -> 2352 on the 430 frame), with the copy starting 40px
          down; from `lg` it is half the width and the full height instead. */}
      {/* Same reason as the location panel: `overflow-hidden` here would
          zero this item's min-content contribution and clip the copy below
          430px. The background texture that needs clipping gets its own
          clipping wrapper in the section instead. */}
      <div className="relative min-h-[371px] px-4 pt-10 sm:px-10 lg:min-h-0 lg:px-16 lg:py-24">
        {children}

        <HomeMenuCategoryList
          categories={categories}
          activeIndex={active.categoryIndex}
          onSelect={select}
          onIntent={prefetchCategory}
        />
      </div>

      {/* Image panel — pushes forward as the copy sweeps in beside it.
          Its pages are absolutely positioned, so below `lg` (where the
          grid stacks and nothing stretches the row) it needs an explicit
          height of its own or the panel collapses to 0 and the page turn
          has nothing to happen in. */}
      <Reveal
        variant="zoom-in"
        className="relative min-h-[561px] lg:min-h-0"
        durationMs={1000}
        delayMs={150}
      >
        <div className="absolute inset-0">
          <HomeMenuPageFlip
            pageKey={`${activeCategory.id}-${active.spreadIndex}`}
            src={activeSpread.src}
            alt={activeCategory.alt}
            width={activeSpread.width}
            height={activeSpread.height}
            direction={active.direction}
          />
        </div>
      </Reveal>
    </div>
  );
}
