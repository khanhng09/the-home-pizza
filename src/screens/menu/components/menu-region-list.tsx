'use client';

import { useState } from 'react';
import { IcArrowRight } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { menuRegionList } from '../constants/menu.constant';

interface MenuRegionListProps {
  onRegionChange?: (mapImage: string) => void;
}

/**
 * Region selector from the hero. Renders as horizontal underline tabs on
 * mobile and a vertical bordered arrow-list on desktop — two different
 * treatments in the Figma, sharing the same active-region state.
 *
 * Selecting a region is wired up for a future per-region map illustration —
 * today every region points at the same `map-1.png`, so the callback fires
 * but the visual stays the same until region-specific art ships.
 */
export function MenuRegionList({ onRegionChange }: MenuRegionListProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const selectRegion = (index: number) => {
    setActiveIndex(index);
    onRegionChange?.(menuRegionList[index].mapImage);
  };

  return (
    <>
      {/* Mobile: horizontal underline tabs */}
      <div className="flex gap-4.5 overflow-x-auto lg:hidden">
        {menuRegionList.map((region, index) => {
          const isActive = index === activeIndex;
          return (
            <Button
              key={region.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => selectRegion(index)}
              className="h-auto flex-col items-start gap-2 rounded-none bg-transparent px-0 pb-2 font-sans text-lg uppercase text-ink shrink-0 hover:bg-transparent"
            >
              {region.label}
              <span className={cn('h-0.5 w-full', isActive ? 'bg-gold' : 'bg-gold/0')} />
            </Button>
          );
        })}
      </div>

      {/* Desktop: vertical bordered list with arrows */}
      <ul className="hidden w-full lg:block">
        {menuRegionList.map((region, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={region.id} className="border-b border-ink/70">
              <Button
                type="button"
                aria-pressed={isActive}
                onClick={() => selectRegion(index)}
                className="group h-auto min-h-11 w-full items-center justify-between gap-4 rounded-none bg-transparent px-0 py-2.5 font-sans text-[27.5px] uppercase tracking-wide text-ink transition-colors hover:bg-transparent hover:text-umber"
              >
                {region.label}
                <IcArrowRight className="size-8 shrink-0 text-ink transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
