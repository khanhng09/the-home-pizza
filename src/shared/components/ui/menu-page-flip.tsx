'use client';

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import { useMediaQuery } from '@/shared/hooks/use-media-query.hook';
import { CREAM_PAPER_TILE, CREAM_PAPER_TILE_SIZE, DARK_PAPER_TILE, DARK_PAPER_TILE_SIZE } from '@/shared/constants/texture.constant';
import { responsiveImage } from '@/shared/lib/image';
import { cn } from '@/shared/lib/utils';

/** The home page's menu panel is half the viewport from `lg`. Exported so
 * the viewer's preloader can hand the browser the same `sizes` the real
 * `<img>` uses — pick a different candidate there and the warm-up fetches
 * a file the panel will never ask for. */
export const MENU_PANEL_SIZES = '(max-width: 1023px) 100vw, 50vw';

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
    // CSS 3D magnifies a translateZ'd layer by `perspective / (perspective
    // - z)` — at the root's `perspective: 1400px` (see below), the old
    // `z: 48` peak scaled this sheet (and the shade overlays riding the
    // same transform) up by ~3.5%. The *entering* page sits underneath at
    // z=0, untouched, so during the turn the two pages were visibly
    // different sizes — the lifted one reading as "taller" against the
    // static one beside it. 20 (paired with the perspective bump to
    // 2400px) cuts that to well under 1%, while still lifting the sheet
    // enough to visibly clear the page it's turning over.
    z: [0, 20, 20, 0],
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
 * lands.
 *
 * The keyframe timing here is deliberately keyed to `FLIP_TIMES`/the
 * rotation math, not picked by eye: with `rotateY` going -18°→-162°
 * linearly between t=0.22 and t=0.8, the sheet crosses ±90° (the point
 * `backface-visibility` actually culls it) at t≈0.51. The opacity ramp
 * peaks at t=0.55, just past that — so the darkest frame lands right as
 * the face is about to disappear, instead of (the previous timing) the
 * page still being square-on to the viewer at ~50%+ black. A cover photo
 * visibly going that dark while still fully facing the viewer read as a
 * rendering glitch, not a page catching the light edge-on. */
const frontShadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 0 },
  exit: {
    opacity: [0, 0.06, 0.4],
    transition: { duration: FLIP_DURATION, times: [0, 0.4, 0.55], ease: 'easeIn' },
  },
};

const backShadeVariants: Variants = {
  // Resting at 0 rather than the shade's own peak: this layer sits behind
  // `backface-visibility:hidden`, so it's only ever meant to be seen mid-flip.
  // Parking it dark at rest made an idle page's *visibility* the only thing
  // standing between the viewer and a near-black box — any environment where
  // that culling isn't airtight (a stacked `preserve-3d` ancestor plus an
  // independently-opacity-animated descendant is a known cross-browser soft
  // spot) showed as a dark smear sitting over the artwork with nothing
  // flipping at all. Resting at 0 means the worst case if culling ever slips
  // is invisible, not opaque.
  enter: { opacity: 0 },
  center: { opacity: 0 },
  exit: {
    opacity: [0, 0.9, 0],
    transition: { duration: FLIP_DURATION, times: [0, 0.5, 1], ease: 'easeOut' },
  },
};

/** Below `lg` the panel drops the whole 3D model. A 375px-wide sheet
 * turning in perspective is mostly illegible at that size, and it is the
 * expensive path: `preserve-3d` plus a promoted layer plus three
 * animating overlays, on the CPU/GPU budget Lighthouse mobile throttles
 * hardest. A compositor-only crossfade reads the same at that width.
 *
 * Same reveal order as `flipPageVariants` above, not a plain opacity
 * crossfade: the incoming page mounts at full opacity already, sitting
 * underneath (`zIndex: 0`); only the outgoing page animates, fading out on
 * top (`zIndex: 1`) to uncover it. A version where the incoming page faded
 * itself in used to mean a rapid re-tap (or the auto-advance timer firing
 * faster than a visitor expects) could restart that fade before it ever
 * reached full opacity — the same page-never-finishes-loading feel this
 * panel is the reference for elsewhere on the home page. */
const fadePageVariants: Variants = {
  enter: { opacity: 1, scale: 1.02, zIndex: 0 },
  center: {
    opacity: 1,
    scale: 1,
    zIndex: 0,
    transition: { scale: { duration: FADE_DURATION, ease: EASE_OUT_EXPO }, zIndex: { duration: 0 } },
  },
  exit: {
    opacity: 0,
    zIndex: 1,
    transition: { opacity: { duration: FADE_DURATION, ease: 'linear' }, zIndex: { duration: 0 } },
  },
};

/** `prefers-reduced-motion`: no scale drift, same outgoing-only fade so the
 * rapid re-tap guarantee still holds. Framer Motion animates via JS, so the
 * global CSS override in `globals.css` never reaches it. */
const reducedPageVariants: Variants = {
  enter: { opacity: 1, zIndex: 0 },
  center: { opacity: 1, zIndex: 0 },
  exit: { opacity: 0, zIndex: 1, transition: { opacity: { duration: 0.25 }, zIndex: { duration: 0 } } },
};

interface MenuPageFlipProps {
  /** Identity of the sheet on top. Changing it turns the page, so it has
   * to be unique per spread, not per category. */
  pageKey: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** ≥ 0 hinges on the left (turning forward), < 0 on the right. */
  direction: number;
  /** Must describe the box the panel actually paints into — see
   * `MENU_PANEL_SIZES`. */
  sizes?: string;
  /** The paper grain painted on the reverse of the turning sheet, so the
   * turn never shows a mirrored photo. `dark` is the dó-paper tile the
   * home showcase has always used; `cream` is /menu's own paper, on its
   * lighter half of the site. The panel's own background (behind the
   * photo's `object-contain` letterboxing) is the caller's job, not this
   * component's — see the note on the root element below. */
  theme?: 'dark' | 'cream';
}

export function MenuPageFlip({
  pageKey,
  src,
  alt,
  width,
  height,
  direction,
  sizes = MENU_PANEL_SIZES,
  theme = 'dark',
}: MenuPageFlipProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const isFlip = !prefersReducedMotion && isDesktop;
  const pageVariants = prefersReducedMotion
    ? reducedPageVariants
    : isFlip
      ? flipPageVariants
      : fadePageVariants;

  const hingeLeft = direction >= 0;
  const image = responsiveImage(src);

  const paperClassName = theme === 'dark' ? 'bg-ink' : 'bg-cream';
  const paperStyle =
    theme === 'dark'
      ? { backgroundImage: `url(${DARK_PAPER_TILE})`, backgroundSize: DARK_PAPER_TILE_SIZE }
      : {
        backgroundImage: `url(${CREAM_PAPER_TILE.desktop})`,
        backgroundSize: CREAM_PAPER_TILE_SIZE.desktop,
      };

  return (
    // `isolate`: the turning sheet lifts itself to `zIndex: 1` mid-flip, and
    // without a stacking context of its own that would also lift it above
    // the prev/next controls painted after this panel.
    //
    // No background of its own: the caller paints one static paper layer
    // behind the whole panel (see `MenuSpreadViewer`/`HomeMenuPanel`), and
    // this sheet's `object-contain` letterboxing shows it through. Painting
    // it here too used to double it up — each sheet restarting the tile at
    // its own box origin, which seamed visibly at the spine of a two-up
    // spread, and re-painted (so it looked like it moved) every time this
    // component re-mounted under a scroll reveal.
    <div
      className="absolute inset-0 isolate overflow-hidden"
      style={
        isFlip
          ? {
            // A shallower (bigger-number) perspective than the previous
            // 1400px — paired with the smaller `z` lift in
            // `flipPageVariants`, this keeps the turning sheet from
            // visibly magnifying relative to the static page underneath
            // it mid-flip (`scale = perspective / (perspective - z)`;
            // this value gets that well under 1% at the sheet's peak lift
            // instead of the previous ~3.5%).
            perspective: '2400px',
            // Bias the vanishing point toward the hinge so the sheet
            // arcs around a spine instead of pivoting in mid-air.
            perspectiveOrigin: hingeLeft ? '30% 50%' : '70% 50%',
          }
          : undefined
      }
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={pageKey}
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
            src={image.src}
            srcSet={image.srcSet}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            className={cn(
              // `object-contain`, not cover: these are typeset menu pages,
              // and cropping one to fill the panel cut the outer margin —
              // and with it the first and last column of dishes. This sheet
              // paints no background of its own, so the page letterboxes
              // onto the caller's static paper layer instead of a gap.
              'absolute inset-0 h-full w-full object-contain',
              isFlip && '[backface-visibility:hidden]'
            )}
          />

          {isFlip && (
            <>
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
                className={cn(
                  'absolute inset-0 bg-repeat [backface-visibility:hidden] [transform:rotateY(180deg)]',
                  paperClassName
                )}
                style={paperStyle}
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
