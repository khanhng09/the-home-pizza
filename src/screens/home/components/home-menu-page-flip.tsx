'use client';

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import { useMediaQuery } from '@/shared/hooks/use-media-query.hook';
import { cn } from '@/shared/lib/utils';

interface MenuPage {
  id: string;
  image: string;
  alt: string;
}

const FLIP_DURATION = 0.78;
const FADE_DURATION = 0.45;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** A real page doesn't sweep at a constant rate: it peels up slowly
 * against its own stiffness, falls fast once past the balance point, then
 * settles. Shaping `rotateY` as keyframes buys that weight — 18° in the
 * first fifth of the turn, 144° through the middle, the last 18° easing
 * out — which no single cubic-bezier can express. `z` lifts the sheet off
 * the stack over the same arc so it clears the page beneath it. */
const FLIP_TIMES = [0, 0.22, 0.8, 1];
const FLIP_EASE = ['easeIn', 'linear', 'easeOut'] as const;

/**
 * Only the *outgoing* page animates: it hinges on the edge it travels
 * toward (left when moving down the list, right when moving back up) and
 * turns a full 180° out of the way, uncovering the incoming page already
 * sitting flat underneath.
 *
 * `originX` and `zIndex` get zero-duration transitions of their own —
 * they must be in place the instant the exit starts, not eased into,
 * otherwise the hinge slides across the panel mid-turn.
 */
const flipPageVariants: Variants = {
  enter: { rotateY: 0, z: 0, zIndex: 0 },
  center: { rotateY: 0, z: 0, zIndex: 0 },
  exit: (direction: number) => ({
    rotateY: direction >= 0 ? [0, -18, -162, -180] : [0, 18, 162, 180],
    z: [0, 48, 48, 0],
    originX: direction >= 0 ? 0 : 1,
    zIndex: 1,
    transition: {
      rotateY: { duration: FLIP_DURATION, times: FLIP_TIMES, ease: [...FLIP_EASE] },
      z: { duration: FLIP_DURATION, times: FLIP_TIMES, ease: 'easeInOut' },
      originX: { duration: 0 },
      zIndex: { duration: 0 },
    },
  }),
};

/** The turning sheet's two faces are lit in opposition — that contrast is
 * what sells it as one physical page rather than two stacked images.
 *
 * Front (the photo) is square to the light at rest and rakes away from it
 * as it stands up, so it darkens; it is hidden past 90° by
 * `backface-visibility`, hence the shading finishing early. The back
 * starts edge-on and swings *into* the light, so it runs the opposite
 * way: near-black as it comes into view at 90°, clean by the time it
 * lands. */
const frontShadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 0 },
  exit: {
    opacity: [0, 0.12, 0.75],
    transition: { duration: FLIP_DURATION, times: [0, 0.35, 0.6], ease: 'easeIn' },
  },
};

const backShadeVariants: Variants = {
  enter: { opacity: 0.95 },
  center: { opacity: 0.95 },
  exit: {
    opacity: [0.95, 0.9, 0],
    transition: { duration: FLIP_DURATION, times: [0, 0.5, 1], ease: 'easeOut' },
  },
};

/** Cast by the standing page onto the one being uncovered, pooled at the
 * spine and lifting as the turn completes. This rides the *entering*
 * page, so it reads the live `direction` straight from props. */
const gutterShadeVariants: Variants = {
  enter: { opacity: 0.8 },
  center: { opacity: 0, transition: { duration: FLIP_DURATION, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

/** Below `lg` the panel drops the whole 3D model. A 375px-wide sheet
 * turning in perspective is mostly illegible at that size, and it is the
 * expensive path: `preserve-3d` plus a promoted layer plus three
 * animating overlays, on the CPU/GPU budget Lighthouse mobile throttles
 * hardest. A compositor-only crossfade reads the same at that width. */
const fadePageVariants: Variants = {
  enter: { opacity: 0, scale: 1.02, zIndex: 1 },
  center: {
    opacity: 1,
    scale: 1,
    zIndex: 1,
    transition: { duration: FADE_DURATION, ease: EASE_OUT_EXPO },
  },
  exit: { opacity: 0, zIndex: 0, transition: { duration: FADE_DURATION, ease: 'linear' } },
};

/** `prefers-reduced-motion`: opacity only, no rotation and no scale.
 * Framer Motion animates via JS, so the global CSS override in
 * `globals.css` never reaches it. */
const reducedPageVariants: Variants = {
  enter: { opacity: 0, zIndex: 1 },
  center: { opacity: 1, zIndex: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, zIndex: 0, transition: { duration: 0.25 } },
};

interface HomeMenuPageFlipProps {
  pages: readonly MenuPage[];
  activeIndex: number;
  direction: number;
  width: number;
  height: number;
}

export function HomeMenuPageFlip({
  pages,
  activeIndex,
  direction,
  width,
  height,
}: HomeMenuPageFlipProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const isFlip = !prefersReducedMotion && isDesktop;
  const pageVariants = prefersReducedMotion
    ? reducedPageVariants
    : isDesktop
      ? flipPageVariants
      : fadePageVariants;

  const activePage = pages[activeIndex];
  const hingeLeft = direction >= 0;

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-ink"
      style={
        isFlip
          ? {
              perspective: '1400px',
              // Bias the vanishing point toward the hinge so the sheet
              // arcs around a spine instead of pivoting in mid-air.
              perspectiveOrigin: hingeLeft ? '30% 50%' : '70% 50%',
            }
          : undefined
      }
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activePage.id}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className={cn(
            'absolute inset-0',
            isFlip && 'will-change-transform [transform-style:preserve-3d]'
          )}
        >
          <img
            src={activePage.image}
            alt={activePage.alt}
            width={width}
            height={height}
            sizes="(max-width: 1023px) 100vw, 50vw"
            loading={activeIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              isFlip && '[backface-visibility:hidden]'
            )}
          />

          {isFlip && (
            <>
              {/* Shadow the standing page throws onto the one below. */}
              <motion.div
                aria-hidden="true"
                variants={gutterShadeVariants}
                className={cn(
                  'absolute inset-0',
                  hingeLeft
                    ? 'bg-gradient-to-r from-black/85 via-black/25 to-transparent to-55%'
                    : 'bg-gradient-to-l from-black/85 via-black/25 to-transparent to-55%'
                )}
              />

              {/* Front face — travels with the photo, hidden past 90°. */}
              <motion.div
                aria-hidden="true"
                variants={frontShadeVariants}
                className={cn(
                  'absolute inset-0 [backface-visibility:hidden]',
                  hingeLeft
                    ? 'bg-gradient-to-l from-black via-black/70 to-black/30'
                    : 'bg-gradient-to-r from-black via-black/70 to-black/30'
                )}
              />

              {/* Reverse of the sheet — plain stock, so the turn never
                  shows a mirrored photo, with its own light on top. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-ink [backface-visibility:hidden] [transform:rotateY(180deg)]"
              >
                <motion.div
                  variants={backShadeVariants}
                  className={cn(
                    'absolute inset-0',
                    hingeLeft
                      ? 'bg-gradient-to-r from-black via-black/80 to-black/40'
                      : 'bg-gradient-to-l from-black via-black/80 to-black/40'
                  )}
                />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
