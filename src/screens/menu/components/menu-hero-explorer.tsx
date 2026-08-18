'use client';

import { useState } from 'react';
import { MenuRegionList } from './menu-region-list';
import { cn } from '@/shared/lib/utils';

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
 * Every region currently points at the same map file. The real per-region
 * artwork (each with its dishes already placed) is still being drawn — see
 * `menuRegionList` in ../constants/menu.constant.ts. The same is true of
 * the copy: `menuPage.regionContent.*.paragraphs` ship empty, and the
 * server component falls the region back to the intro text until they are
 * written. Both are data-only changes when they arrive; this component
 * does not need to change again.
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

  return (
    // Wider than `container-base`'s 80rem: the design draws the map 862px
    // across on a 1400 canvas, and inside the standard container it could
    // never get past ~576. This one section takes the design's own canvas
    // width so the map lands at roughly the size it is drawn at.
    <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 px-4 pt-24 pb-12 md:px-6 lg:grid-cols-[1.72fr_1fr] lg:grid-rows-[auto_auto] lg:items-center lg:gap-9 lg:px-8 lg:pt-44 lg:pb-20">
      {/* Text column — first on mobile, top-right on desktop */}
      <div className="order-1 flex flex-col items-start gap-6 lg:order-none lg:col-start-2 lg:row-start-1">
        <p className="font-sans text-lg tracking-wide text-ink lg:text-2xl">{greeting}</p>

        <div
          // Keyed on the selection so the copy crossfades in rather than
          // swapping between two blocks of text with no transition.
          key={activeId ?? 'intro'}
          className="flex animate-[fade-in_400ms_ease-out_both] flex-col gap-5 text-justify font-sans text-sm text-ink lg:text-xl"
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

      {/* Map illustration */}
      <div className="order-3 relative lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:w-full">
        <div className="relative aspect-[862/585] w-full">
          {/* Both maps stay mounted and crossfade. The region art is the
              same file today, but once the four real maps ship this is
              what stops the panel flashing empty while the next one
              downloads. */}
          {[introMapImage, ...regions.map((region) => region.mapImage)]
            .filter((source, index, all) => all.indexOf(source) === index)
            .map((source) => (
              <img
                key={source}
                src={source}
                alt={source === mapImage ? mapAlt : ''}
                aria-hidden={source === mapImage ? undefined : true}
                width={1600}
                height={979}
                sizes="(max-width: 1023px) 100vw, 60vw"
                className={cn(
                  'absolute inset-0 size-full object-contain transition-opacity duration-500',
                  source === mapImage ? 'opacity-100' : 'opacity-0'
                )}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
