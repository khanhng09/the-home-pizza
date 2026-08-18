'use client';

import { IcArrowRight } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { MenuHeroRegion } from './menu-hero-explorer';

interface MenuRegionListProps {
  regions: MenuHeroRegion[];
  /** `null` = nothing picked yet, i.e. the whole map is showing. */
  activeId: string | null;
  onSelect: (id: string) => void;
}

/**
 * Region selector from the hero. Renders as horizontal underline tabs on
 * mobile and a vertical bordered arrow-list on desktop — two different
 * treatments in the Figma, sharing the same active-region state.
 *
 * Presentational only: the selection lives in `MenuHeroExplorer`, which is
 * also what swaps the map and the copy in response to it.
 */
export function MenuRegionList({ regions, activeId, onSelect }: MenuRegionListProps) {
  return (
    <>
      {/* Mobile: horizontal underline tabs */}
      <div className="flex gap-4.5 overflow-x-auto lg:hidden">
        {regions.map((region) => {
          const isActive = region.id === activeId;
          return (
            <Button
              key={region.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(region.id)}
              className={cn(
                'h-auto flex-col items-start gap-2 rounded-none bg-transparent px-0 pb-2 font-sans text-lg uppercase shrink-0 hover:bg-transparent',
                isActive ? 'text-umber' : 'text-ink'
              )}
            >
              {region.label}
              <span className={cn('h-0.5 w-full', isActive ? 'bg-gold' : 'bg-gold/0')} />
            </Button>
          );
        })}
      </div>

      {/* Desktop: vertical bordered list with arrows */}
      <ul className="hidden w-full lg:block">
        {regions.map((region) => {
          const isActive = region.id === activeId;
          return (
            <li key={region.id} className="border-b border-ink/70">
              <Button
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(region.id)}
                className={cn(
                  'group h-auto min-h-11 w-full items-center justify-between gap-4 rounded-none bg-transparent px-0 py-2.5 font-sans text-[27.5px] uppercase tracking-wide transition-colors hover:bg-transparent hover:text-umber',
                  isActive ? 'text-umber' : 'text-ink'
                )}
              >
                {region.label}
                <IcArrowRight
                  className={cn(
                    'size-8 shrink-0 transition-transform duration-300 group-hover:translate-x-1',
                    isActive ? 'text-umber' : 'text-ink'
                  )}
                />
              </Button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
