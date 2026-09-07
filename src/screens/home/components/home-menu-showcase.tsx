'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { MENU_PANEL_SIZES } from '@/shared/components/ui/menu-page-flip';
import { DARK_PAPER_TILE, DARK_PAPER_TILE_SIZE } from '@/shared/constants/texture.constant';
import type { MenuSpread } from '@/shared/constants/menu-spreads.constant';
import { responsiveImage } from '@/shared/lib/image';
import { HomeMenuCategoryList } from './home-menu-category-list';
import { HomeMenuPanel } from './home-menu-panel';

export interface HomeMenuShowcaseCategory {
  id: string;
  label: string;
  alt: string;
  spreads: readonly MenuSpread[];
}

interface HomeMenuShowcaseProps {
  categories: HomeMenuShowcaseCategory[];
  /** The section's server-rendered copy block (heading, paragraph, CTA,
   * background layers) — kept out of this client bundle by passing it
   * through as children. */
  children: ReactNode;
}

/** Fetched the moment the pointer lands on a row, ahead of the hover
 * debounce, so an intentional hover lands on an image that is already
 * there. */
function prefetch(source: string | undefined) {
  if (!source) return;

  const { src, srcSet } = responsiveImage(source);
  const image = new window.Image();
  image.sizes = MENU_PANEL_SIZES;
  if (srcSet) image.srcset = srcSet;
  image.src = src;
}

/**
 * Owns which category is selected. It sits above both the list and the
 * image panel because they live in different grid columns, so nothing
 * smaller can hold it.
 *
 * Paging *within* a category — the timer, the forward arrow, the page
 * turn itself, and the panel's own static background — all belong to
 * `HomeMenuPanel`.
 */
export function HomeMenuShowcase({ categories, children }: HomeMenuShowcaseProps) {
  // Direction rides along so the sheet hinges on the edge it travels
  // toward: moving down the list turns the page forward, moving back up
  // turns it back.
  const [active, setActive] = useState({ index: 0, direction: 1 });

  const activeCategory = categories[active.index];

  const select = useCallback((index: number) => {
    setActive((previous) =>
      index === previous.index
        ? previous
        : { index, direction: index > previous.index ? 1 : -1 }
    );
  }, []);

  const prefetchCategory = useCallback(
    (index: number) => prefetch(categories[index].spreads[0]?.src),
    [categories]
  );

  return (
    // Equal columns, matching the current design: the image panel is no
    // longer sized to the menu page's own aspect ratio (that was the old
    // `[1fr_auto]` track). It now takes the same width as the copy column,
    // paints a solid background across the whole cell, and lets the page
    // artwork sit centered inside at whatever size its own ratio allows —
    // see `HomeMenuPanel`.
    <div className="flex min-h-0 flex-col lg:grid lg:h-full lg:grid-cols-2">
      {/* Content panel. `container-edge-left` rather than a fixed `px`:
          this panel starts at the viewport edge, so a fixed inset put its
          heading ~48px inboard of every `container-base` section's
          heading. */}
      <div className="container-edge-left relative flex min-h-0 flex-col">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 aspect-[430/500] bg-repeat lg:aspect-auto"
            style={{ backgroundImage: `url(${DARK_PAPER_TILE})`, backgroundSize: DARK_PAPER_TILE_SIZE }}
          />
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col py-[var(--section-py)] pr-4 sm:pr-10 lg:pr-16">
          {children}

          <HomeMenuCategoryList
            categories={categories}
            activeIndex={active.index}
            onSelect={select}
            onIntent={prefetchCategory}
          />
        </div>
      </div>

      {/* Image panel — pushes forward as the copy sweeps in beside it. */}
      <HomeMenuPanel
        spreads={activeCategory.spreads}
        alt={activeCategory.alt}
        resetKey={activeCategory.id}
        resetDirection={active.direction}
      />
    </div>
  );
}
