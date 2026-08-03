'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { Reveal } from '@/shared/components/ui/reveal';
import { HomeMenuCategoryList } from './home-menu-category-list';
import { HomeMenuPageFlip } from './home-menu-page-flip';

export interface HomeMenuShowcaseCategory {
  id: string;
  href: string;
  image: string;
  label: string;
  linkLabel: string;
  alt: string;
}

interface HomeMenuShowcaseProps {
  categories: HomeMenuShowcaseCategory[];
  imageWidth: number;
  imageHeight: number;
  /** The section's server-rendered copy block (heading, paragraph, CTA,
   * background layers) — kept out of this client bundle by passing it
   * through as children. */
  children: ReactNode;
}

/**
 * Owns the one piece of state the menu section needs: which category is
 * selected. It sits above both the list and the image panel because they
 * live in different grid columns, so nothing smaller can hold it.
 */
export function HomeMenuShowcase({
  categories,
  imageWidth,
  imageHeight,
  children,
}: HomeMenuShowcaseProps) {
  // Direction rides along with the index so the panel knows which edge to
  // hinge on — moving down the list turns the page forward, moving back
  // up turns it back.
  const [active, setActive] = useState({ index: 0, direction: 1 });

  const select = useCallback((index: number) => {
    setActive((previous) =>
      index === previous.index ? previous : { index, direction: index > previous.index ? 1 : -1 }
    );
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
      {/* Content panel */}
      <div className="relative overflow-hidden px-4 pt-16 sm:px-10 lg:px-16 lg:py-24">
        {children}

        <HomeMenuCategoryList
          categories={categories}
          activeIndex={active.index}
          onSelect={select}
        />
      </div>

      {/* Image panel — pushes forward as the copy sweeps in beside it.
          Its pages are absolutely positioned, so below `lg` (where the
          grid stacks and nothing stretches the row) it needs an explicit
          height of its own or the panel collapses to 0 and the page turn
          has nothing to happen in. */}
      <Reveal
        variant="zoom-in"
        className="relative min-h-[530px] lg:min-h-0"
        durationMs={1000}
        delayMs={150}
      >
        <HomeMenuPageFlip
          pages={categories}
          activeIndex={active.index}
          direction={active.direction}
          width={imageWidth}
          height={imageHeight}
        />
      </Reveal>
    </div>
  );
}
