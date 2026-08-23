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
 * also what swaps the map and the copy in response to it. Only a click
 * calls `onSelect` — the `hover:`/`group-hover:` classes below are plain
 * CSS affordance and never touch the selection itself.
 */
export function MenuRegionList({ regions, activeId, onSelect }: MenuRegionListProps) {
  return (
    <>
      {/* Mobile: horizontal underline tabs. A single hairline runs under
          all four; the active tab's gold underline sits on top of it. */}
      <div className="grid grid-cols-4 gap-4.5 border-b border-ink/20 lg:hidden">
        {regions.map((region) => {
          const isActive = region.id === activeId;
          return (
            <Button
              key={region.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(region.id)}
              className={cn(
                'h-auto flex-col items-start gap-0 text-left rounded-none bg-transparent px-0 pb-2 font-sans text-lg uppercase shrink-0 hover:bg-transparent',
                isActive ? 'text-umber' : 'text-ink'
              )}
            >
              {/* Each region name is two words ("Bắc Bộ", "Phú Quốc", ...).
                  Breaking on the space explicitly — rather than leaving it
                  to natural wrap — keeps every tab at the same two-line
                  height regardless of column width, instead of some tabs
                  wrapping and others (whichever happens to be short enough
                  for its column) staying on one line. Only worth doing at
                  genuinely narrow (phone) widths, where a column is too
                  narrow to fit either word on one line anyway — `sm:` and up
                  a column is comfortably wide enough for the full two-word
                  label, so the words sit side by side instead of forcing a
                  two-line tab with a wide dead gap next to it. This inner
                  span is its own flex row/column, separate from the
                  underline bar below, since the Button's own `flex-col`
                  would otherwise blockify these into forced separate rows
                  regardless of `inline`/`block`. */}
              <span className="flex flex-col sm:flex-row sm:gap-1">
                {region.label.split(' ').map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </span>
              <span className={cn('-mb-px h-0.5 w-full', isActive ? 'bg-gold' : 'bg-gold/0')} />
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
