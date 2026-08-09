'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { IcArrowRight } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage } from '@/shared/lib/image';
import { cn } from '@/shared/lib/utils';
import { LOCATION_HOVER_DEBOUNCE_MS, locationContent, locationStates } from '../constants/home.constant';
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
    <div ref={rootRef} className="grid min-h-[932px] bg-deep lg:min-h-[914px] lg:grid-cols-2">
      {/* No `overflow-hidden` here: it makes this a scroll container, which
          zeroes its min-content contribution to the grid row — the row then
          sizes off `min-h` alone and clips the copy on any viewport narrower
          than the design's 430 (the location buttons lost 14px at 375). The
          background layers below are `inset-0`, so nothing needs clipping. */}
      <div className="relative flex min-h-[371px] px-7 pt-10 pb-10 sm:px-10 lg:min-h-[914px] lg:px-14 lg:pt-32 lg:pb-14 xl:px-16">
        <div
          className="absolute inset-0 bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${optimizedImage(locationContent.backgroundImageMobile)})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${optimizedImage(locationContent.backgroundImage)})` }}
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
            <p className="max-w-[296px] font-sans text-base leading-[1.4] text-cream lg:max-w-[600px] lg:text-xl xl:text-[22px]">
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
              className="btn-base h-8 w-full bg-cream font-bold uppercase tracking-wide text-ink hover:bg-linen mt-7 max-w-40 border border-cream px-6 font-sans text-[15px] lg:mt-10 lg:w-auto"
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

      <div className="relative min-h-[561px] overflow-hidden lg:min-h-[914px]">
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
              className="font-display text-[clamp(2.5rem,15vw,4.5rem)] leading-none text-cream uppercase lg:text-[clamp(4rem,8.5vw,9.5rem)]"
            >
              {t('heading')}
            </h2>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
