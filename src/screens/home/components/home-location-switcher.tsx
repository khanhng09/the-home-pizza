'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { IcArrowRight } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { Reveal } from '@/shared/components/ui/reveal';
import { DARK_PAPER_TILE, DARK_PAPER_TILE_SIZE } from '@/shared/constants/texture.constant';
import { cn } from '@/shared/lib/utils';
import { LOCATION_HOVER_DEBOUNCE_MS, locationStates } from '../constants/home.constant';
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

  const hoverTimer = useRef<number | null>(null);

  const cancelHover = useCallback(() => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  // A row unmounting mid-hover would otherwise leave the timer to fire
  // into a dead component.
  useEffect(() => cancelHover, [cancelHover]);

  const handleEnter = useCallback(
    (index: number) => {
      cancelHover();
      hoverTimer.current = window.setTimeout(() => setActiveIndex(index), LOCATION_HOVER_DEBOUNCE_MS);
    },
    [cancelHover]
  );

  const handleClick = useCallback(
    (index: number) => {
      cancelHover();
      setActiveIndex(index);
    },
    [cancelHover]
  );

  return (
    // Both breakpoints are the design's own section box — 3515 -> 4447 on
    // the 430 frame, 3771 -> 4685 on the 1400 one — split into the copy
    // panel and the photo exactly where the design splits them (371/561 on
    // mobile, half and half on desktop).
    <div
      ref={rootRef}
      className="flex h-svh flex-col bg-deep lg:grid lg:h-auto lg:min-h-[914px] lg:grid-cols-2"
    >
      {/* No `overflow-hidden` here: it makes this a scroll container, which
          zeroes its min-content contribution to the grid row — the row then
          sizes off `min-h` alone and clips the copy on any viewport narrower
          than the design's 430 (the location buttons lost 14px at 375). The
          background layers below are `inset-0`, so nothing needs clipping. */}
      <div className="container-edge-left relative flex min-h-0 flex-[371_1_0%] overflow-y-auto pr-7 pt-10 pb-10 sm:pr-10 lg:flex-none lg:overflow-visible lg:min-h-[914px] lg:pr-14 lg:pt-32 lg:pb-14 xl:pr-16">
        <div
          className="absolute inset-0 bg-repeat"
          style={{ backgroundImage: `url(${DARK_PAPER_TILE})`, backgroundSize: DARK_PAPER_TILE_SIZE }}
          aria-hidden="true"
        />

        {/* `z-10` keeps the copy and the location list above the section's
            illustration layer, which is painted after this subtree so it
            clears the panel's background texture. The design stacks them the
            same way — the nghêu/bánh đa/húng quế nodes sit *below* the
            paragraph and the PHÚ QUỐC / NHA TRANG rows in the Figma order. */}
        <div className="relative isolate z-10 flex w-full flex-col">
          <Reveal variant="slide-right">
            {/* The design sets this at 14px in a 296px column on mobile. 14
                is under the project's 16px floor for body copy, so it goes
                to `text-base` at the design's measure — the closest fit that
                still keeps the panel inside its 371px box. */}
            <p className="max-w-[296px] text-justify font-sans text-base leading-[1.4] text-cream lg:max-w-[600px] lg:text-xl xl:text-[22px]">
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
          <Reveal variant="slide-right" delayMs={570}>
            <Button
              asChild
              className="btn-cta mt-7 w-full max-w-40 border border-cream bg-cream text-ink hover:bg-linen lg:mt-10 lg:w-auto"
            >
              <Link href="/space">
                {t('cta')}
                {/* <IcArrowRight className="size-5" /> */}
              </Link>
            </Button>
          </Reveal>

          {/* Each location sweeps in from the left in turn, so the list
              builds up rather than appearing as one block. */}
          <div className="mt-auto">
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
                      onPointerEnter={() => handleEnter(index)}
                      onPointerLeave={cancelHover}
                      aria-pressed={isActive}
                      className="group relative flex h-auto flex-col items-start justify-start gap-2 rounded-none bg-transparent px-0 pb-2 text-left font-sans text-xl uppercase leading-[1.2] text-cream hover:bg-transparent lg:w-full lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-8 lg:font-display lg:text-[clamp(2.5rem,5.3vw,4.65rem)] lg:leading-none"
                    >
                      <span className="lg:hidden">
                        {(t.raw(`states.${location.id}.mobileLabel`) as string[]).map((line) => (
                          <span key={line} className="block font-sans font-normal">
                            {line}
                          </span>
                        ))}
                      </span>
                      <span className="hidden lg:block font-sans font-normal">{t(`states.${location.id}.label`)}</span>
                      <span
                        aria-hidden="true"
                        className={cn('h-1 w-full lg:hidden', isActive ? 'bg-gold' : 'bg-gold/0')}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-x-0 bottom-0 hidden h-[2px] origin-left scale-x-0 bg-gold transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:block',
                          isActive && 'scale-x-100'
                        )}
                      />
                      <IcArrowRight className="hidden size-[62px] shrink-0 text-cream transition-transform duration-300 group-hover:translate-x-2 lg:block" />
                    </Button>
                  </Reveal>
                );
              })}
            </div>


          </div>
        </div>
      </div>

      <div className="relative flex-[561_1_0%] overflow-hidden lg:flex-none lg:min-h-[914px]">
        <HomeLocationGallery
          locationId={activeLocation.id}
          spreads={activeLocation.spreads}
          alt={t(`states.${activeLocation.id}.alt`)}
          isOnScreen={isOnScreen}
        />
        {/* Centering stays on this wrapper — Framer Motion writes its own
            inline `transform`, which would otherwise clobber the
            `-translate-x-1/2` that centers the title. */}
        <div className="absolute bottom-7 left-1/2 w-full max-w-full -translate-x-1/2 px-4 text-center lg:top-[103px] lg:bottom-auto lg:px-8">
          <Reveal variant="zoom-in" delayMs={450} durationMs={950}>
            <h2
              id="home-location-heading"
              className="font-display text-5xl md:text-6xl lg:text-[80px] leading-none text-cream uppercase"
            >
              {t('heading')}
            </h2>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
