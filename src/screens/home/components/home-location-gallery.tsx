'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import { responsiveImage } from '@/shared/lib/image';
import { LOCATION_SPREAD_INTERVAL_MS } from '../constants/home.constant';

export const LOCATION_PANEL_SIZES = '(max-width: 1023px) 100vw, 50vw';

interface LocationSpread {
  src: string;
  width: number;
  height: number;
}

interface HomeLocationGalleryProps {
  /** Switching this always restarts the panel at that location's first
   * photo, rather than continuing wherever the previous one's timer
   * happened to leave off. */
  locationId: string;
  spreads: readonly LocationSpread[];
  alt: string;
  /** Auto-advance only runs while the panel is actually on screen — see
   * the same guard on the menu showcase for why. */
  isOnScreen: boolean;
}

/** Warms the browser cache so the next photo is decoded before it is
 * crossfaded to. Without it every tick uncovers a photo that only starts
 * downloading once it mounts, and the panel shows a blank frame. */
function preload(source: string | undefined) {
  if (!source) return;
  const { src, srcSet } = responsiveImage(source);
  const image = new window.Image();
  image.sizes = LOCATION_PANEL_SIZES;
  if (srcSet) image.srcset = srcSet;
  image.src = src;
}

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

/**
 * The location panel's image, mirroring the menu panel's showcase: an
 * auto-advancing set of photos gated on visibility, with the next one
 * preloaded ahead of the tick. The transition itself is a slow crossfade
 * rather than the menu's page-flip — these are ambiance shots, not pages
 * of a book, so a dissolve reads truer than a turn.
 */
export function HomeLocationGallery({ locationId, spreads, alt, isOnScreen }: HomeLocationGalleryProps) {
  const prefersReducedMotion = useReducedMotion();
  const [spreadIndex, setSpreadIndex] = useState(0);
  // Adjusting state during render (React's documented pattern for this,
  // rather than an effect) — resets the panel to this location's first
  // photo the moment `locationId` changes, in the same render/commit
  // instead of one tick later.
  const [renderedLocationId, setRenderedLocationId] = useState(locationId);
  if (locationId !== renderedLocationId) {
    setRenderedLocationId(locationId);
    setSpreadIndex(0);
  }

  useEffect(() => {
    if (prefersReducedMotion || !isOnScreen || spreads.length < 2) return;

    const timer = window.setTimeout(() => {
      setSpreadIndex((previous) => (previous + 1) % spreads.length);
    }, LOCATION_SPREAD_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion, isOnScreen, spreads, spreadIndex]);

  useEffect(() => {
    preload(spreads[(spreadIndex + 1) % spreads.length]?.src);
  }, [spreads, spreadIndex]);

  const activeSpread = spreads[spreadIndex] ?? spreads[0];
  const image = responsiveImage(activeSpread.src);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <AnimatePresence initial={false}>
        <motion.img
          key={`${locationId}-${spreadIndex}`}
          src={image.src}
          srcSet={image.srcSet}
          alt={alt}
          width={activeSpread.width}
          height={activeSpread.height}
          sizes={LOCATION_PANEL_SIZES}
          loading="lazy"
          decoding="async"
          variants={prefersReducedMotion ? reducedPhotoVariants : photoVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </AnimatePresence>
    </div>
  );
}
