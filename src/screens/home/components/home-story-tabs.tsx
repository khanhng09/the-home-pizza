'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import { storyStates } from '../constants/home.constant';
import { Link } from '@/i18n/navigation';
import { IcArrowRight } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { responsiveImage } from '@/shared/lib/image';
import { cn } from '@/shared/lib/utils';
import { Reveal } from '@/shared/components/ui/reveal';

const STORY_IMAGE_SIZES = '100vw';

/** Same slow dissolve as `HomeLocationGallery`'s panel: a scale-in fade on
 * enter, a plain fade on exit, so both crossfading photo panels on the
 * page read as one consistent motion language. */
const FADE_DURATION = 1.1;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const photoVariants: Variants = {
  enter: { opacity: 0, scale: 1.03 },
  center: { opacity: 1, scale: 1, transition: { duration: FADE_DURATION, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, transition: { duration: FADE_DURATION, ease: 'linear' } },
};

/** `prefers-reduced-motion`: opacity only, no scale drift. Framer Motion
 * animates via JS, so the global CSS override in `globals.css` never
 * reaches it. */
const reducedPhotoVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

/** Warms the browser cache for the tabs that aren't showing yet. There are
 * only three of these, fixed at build time, so — unlike the location
 * gallery's rotating queue — it's cheap to just preload all of them up
 * front instead of tracking which one is next. */
function preload(source: string) {
  const { src, srcSet } = responsiveImage(source);
  const image = new window.Image();
  image.sizes = STORY_IMAGE_SIZES;
  if (srcSet) image.srcset = srcSet;
  image.src = src;
}

export function HomeStoryTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations('home.story');
  const activeState = storyStates[activeIndex];

  useEffect(() => {
    storyStates.forEach((state, index) => {
      if (index !== activeIndex) preload(state.image);
    });
  }, [activeIndex]);

  return (
    // `h-full` on mobile so the photo fills whatever share of the screen
    // the section hands it; desktop keeps the design's fixed aspect.
    <div className="relative h-full">
      {/* Tabs */}
      <div className="absolute z-10 top-0 translate-y-[-50%] w-full">
        <div className="container-base flex md:grid md:grid-cols-3 gap-3.5 md:gap-10 lg:gap-20 items-center w-full justify-between overflow-x-auto">
          {storyStates.map((state, index) => {
            const isActive = index === activeIndex;
            return (
              <Reveal key={state.id} variant="slide-up" durationMs={400} delayMs={index * 200} className="w-full">
                <Button
                  key={state.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={cn(
                    // Same cubic-bezier as the photo's enter curve (see
                    // `EASE_OUT_EXPO` below, and the location switcher's
                    // underline) so the pill settles into its new color on
                    // the same easing feel as the crossfade it's paired
                    // with, instead of the mismatched default Tailwind ease.
                    'h-10 shrink-0 whitespace-nowrap rounded-full w-full px-5 font-display text-[20px] sm:text-xl md:text-2xl lg:text-[clamp(1.75rem,1.25vw,2.25rem)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-11 sm:px-6  lg:h-15 lg:px-9 ',
                    isActive
                      ? 'bg-gold text-ink hover:bg-gold'
                      : 'bg-ink text-cream hover:brightness-110 hover:bg-ink'
                  )}
                >
                  {t(`states.${state.id}`)}
                </Button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Crossfading state image: only the active tab's photo is mounted,
          swapped via AnimatePresence on a scale-in fade — the same
          transition as `HomeLocationGallery`'s panel, so both photo areas
          on the page move the same way. The other two tabs' images are
          still preloaded above so the swap never uncovers a blank frame. */}
      {/* Fills the share the section hands it at every breakpoint. The
          desktop `aspect-1402/512 min-h-109.5 max-h-128` trio is gone: a
          fixed aspect in a screen-locked section is a second, competing
          source of truth for the height, and it was the taller of the two.
          The photos are `absolute inset-0 object-cover`, so they crop to
          whatever band they get rather than resisting it. */}
      <div className="relative h-full w-full overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.img
            key={activeState.id}
            src={responsiveImage(activeState.image).src}
            srcSet={responsiveImage(activeState.image).srcSet}
            alt={t(`states.${activeState.id}`)}
            width={2804}
            height={1024}
            sizes={STORY_IMAGE_SIZES}
            loading="lazy"
            decoding="async"
            variants={prefersReducedMotion ? reducedPhotoVariants : photoVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* One arrow, not one per photo: only the active state's image is
            visible, so a link per image would leave two invisible links in
            the tab order. It re-targets as the tabs change instead. */}
        <Link
          href={activeState.href}
          aria-label={t('viewState', { state: t(`states.${activeState.id}`) })}
          className="group/arrow absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-ink/40 text-cream backdrop-blur-[2px] transition-colors hover:bg-ink/60 lg:bottom-8 lg:right-8"
        >
          <IcArrowRight
            aria-hidden="true"
            className="size-5"
          />
        </Link>
      </div>
    </div>
  );
}
