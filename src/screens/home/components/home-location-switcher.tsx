'use client';

import { useCallback, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { IcArrowRight } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { Reveal } from '@/shared/components/ui/reveal';
import { DARK_PAPER_TILE, DARK_PAPER_TILE_SIZE } from '@/shared/constants/texture.constant';
import { cn } from '@/shared/lib/utils';
import { locationStates } from '../constants/home.constant';
import { HomeLocationGallery } from './home-location-gallery';

export function HomeLocationSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLocation = locationStates[activeIndex];
  const t = useTranslations('home.location');
  const rootRef = useRef<HTMLDivElement>(null);
  // Auto-advance only runs while the panel is on screen — see the same
  // guard on the menu showcase for why it's scoped to the whole switcher
  // rather than just the image panel (below `lg` the grid stacks, so a
  // visitor reading the list without the panel in view would otherwise
  // still be running the timer).
  const isOnScreen = useInView(rootRef, { amount: 0.2 });


  // A row unmounting mid-hover would otherwise leave the timer to fire
  // into a dead component.
  const handleClick = useCallback(
    (index: number) => {
      setActiveIndex(index);
    },
    []
  );

  return (
    // One screen at both breakpoints, split into the copy panel and the
    // photo exactly where the design splits them (371/561 on mobile, half
    // and half on desktop). The desktop `min-h-[914px]` this replaces was
    // the comp's own frame height — 240px past a 720p laptop.
    <div
      ref={rootRef}
      className="relative flex min-h-0 flex-1 flex-col bg-deep lg:grid lg:grid-cols-2"
    >
      {/* Moved up from the copy panel so the same paper texture also shows
          through the gap the desktop photo panel now leaves around itself
          (see `location-photo-inset`) instead of stopping at the old
          full-bleed image edge. Being a sibling that comes first in the DOM,
          it still paints under both columns without needing a z-index. */}
      <div
        className="pointer-events-none absolute inset-0 bg-repeat"
        style={{ backgroundImage: `url(${DARK_PAPER_TILE})`, backgroundSize: DARK_PAPER_TILE_SIZE }}
        aria-hidden="true"
      />

      {/* No `overflow-hidden` here: it makes this a scroll container, which
          zeroes its min-content contribution to the grid row — the row then
          sizes off `min-h` alone and clips the copy on any viewport narrower
          than the design's 430 (the location buttons lost 14px at 375). The
          background layers below are `inset-0`, so nothing needs clipping. */}
      <div className="container-edge-left relative flex min-h-0 flex-[371_1_0%] overflow-y-auto py-[var(--section-py)] pr-7 lg:flex-none lg:pr-14 xl:pr-16">
        {/* `z-10` keeps the copy and the location list above the section's
            illustration layer, which is painted after this subtree so it
            clears the panel's background texture. The design stacks them the
            same way — the nghêu/bánh đa/húng quế nodes sit *below* the
            paragraph and the PHÚ QUỐC / NHA TRANG rows in the Figma order. */}
        <div className="relative isolate z-10 flex h-full w-full flex-col justify-between">
          <div className="flex flex-col">
            <Reveal variant="slide-right">
              <h2
                id="home-location-heading"
                className="font-display text-5xl md:text-6xl lg:text-[80px] text-cream"
              >
                {t('heading')}
              </h2>
            </Reveal>
            <Reveal variant="slide-right" delayMs={200}>
              {/* The design sets this at 14px in a 296px column on mobile. 14
                is under the project's 16px floor for body copy, so it goes
                to `text-base` at the design's measure — the closest fit that
                still keeps the panel inside its 371px box. */}
              <p className="mt-6 max-w-[296px] text-justify font-sans text-sm sm:text-base md:text-lg text-cream leading-[1.4] lg:max-w-[600px]">
                {t('paragraph')}
              </p>
            </Reveal>
            {/* The rows above only swap the photo panel — nothing on this
                page led anywhere near /space. This is the way in: one link
                to the whole screen, deliberately not tied to the active
                row, so it reads as "there is more over there" rather than
                as a third thing the selection controls.

                Same cream pill as the /humans CTA so the site has one
                primary-action shape. */}
            <Reveal variant="slide-right" delayMs={400}>
              <Button
                asChild
                className="btn-cta mt-7 w-full max-w-40 border border-cream bg-cream text-ink hover:bg-linen lg:mt-[clamp(1rem,3vh,2.5rem)] lg:w-auto"
              >
                <Link href="/space">
                  {t('cta')}
                  {/* <IcArrowRight className="size-5" /> */}
                </Link>
              </Button>
            </Reveal>
          </div>

          {/* Each location sweeps in from the left in turn, so the list
              builds up rather than appearing as one block. */}
          <div className="mt-[clamp(1rem,3vh,2rem)]">
            <div className="flex gap-4.5 lg:block">
              {locationStates.map((location, index) => {
                const isActive = index === activeIndex;

                return (
                  <Reveal
                    key={location.id}
                    variant="slide-right"
                    delayMs={250 + index * 160}
                    className="lg:w-full"
                  >
                    <Button
                      type="button"
                      onClick={() => handleClick(index)}
                      aria-pressed={isActive}
                      className="group relative flex h-auto flex-col gap-0 items-start justify-start rounded-none bg-transparent px-0 text-left font-sans text-xl uppercase leading-[1.2] text-cream hover:bg-transparent lg:w-full lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-[clamp(0.75rem,2vh,2rem)] lg:font-display lg:text-[clamp(2.5rem,min(5.3vw,7vh),4.65rem)] lg:leading-none"
                    >
                      <span className="lg:hidden">
                        {(t.raw(`states.${location.id}.mobileLabel`) as string[]).map((line) => (
                          <span key={line} className="block font-sans font-normal py-3">
                            {line}
                          </span>
                        ))}
                      </span>
                      <span className="hidden lg:block py-3 font-sans font-normal">{t(`states.${location.id}.label`)}</span>
                      <span
                        aria-hidden="true"
                        className={cn('h-0.5 w-full lg:hidden', isActive ? 'bg-gold' : 'bg-gold/0')}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-x-0 bottom-0 hidden h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:block',
                          isActive && 'scale-x-100'
                        )}
                      />
                      <IcArrowRight className="hidden size-[clamp(36px,5vh,62px)] shrink-0 text-cream transition-transform duration-300 group-hover:translate-x-2 lg:block" />
                    </Button>
                  </Reveal>
                );
              })}
            </div>


          </div>
        </div>
      </div>

      {/* `location-photo-inset` only takes effect from `lg` up (mobile keeps
          the photo edge-to-edge) — see the utility in globals.css for why a
          plain `lg:` Tailwind variant can't express this directly. */}
      <div className="location-photo-inset relative min-h-0 flex-[561_1_0%] overflow-hidden lg:flex-none">
        <div className="relative h-full w-full overflow-hidden">
          <HomeLocationGallery
            locationId={activeLocation.id}
            spreads={activeLocation.spreads}
            alt={t(`states.${activeLocation.id}.alt`)}
            isOnScreen={isOnScreen}
          />
        </div>
      </div>
    </div>
  );
}
