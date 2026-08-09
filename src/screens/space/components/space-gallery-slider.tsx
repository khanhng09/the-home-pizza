'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { IcChevronLeft, IcChevronRight } from '@/shared/components/icons';
import type { LocationPhoto } from '@/shared/constants/location-photos.constant';
import { responsiveImage } from '@/shared/lib/image';
import { cn } from '@/shared/lib/utils';
import { SPACE_SLIDER_INTERVAL_MS } from '../constants/space.constant';

interface SpaceGallerySliderProps {
  photos: readonly LocationPhoto[];
  /** One alt per photo, built on the server so this stays a leaf client
   * component with no translation lookup of its own beyond the two button
   * labels. */
  alts: string[];
  /** Height of the strip, plus which edge it bleeds off — the light band
   * runs its photos to the right edge of the viewport, the dark one to the
   * left. */
  className?: string;
}

/**
 * The photo filmstrip in each location band — the same construction as
 * /story's mobile strip (see `story-image-slider.tsx`), promoted to both
 * breakpoints because this design draws the arrows on desktop too.
 *
 * The design runs the photos at a common height, each keeping its own
 * aspect ratio, so the row overflows its box and the next photo always
 * peeks in past the edge: a filmstrip being panned, not one slide swapped
 * for another. That rules out a transform-based carousel — the widths
 * differ per photo, so it would have to measure each one to know how far
 * to move. Native scroll + `scroll-snap` needs no measurement (scroll to a
 * child's `offsetLeft`) and gets touch swiping and keyboard scrolling for
 * free.
 */
export function SpaceGallerySlider({ photos, alts, className }: SpaceGallerySliderProps) {
  const t = useTranslations('spacePage.slider');
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);
  // Auto-advance only runs while the strip is actually on screen — same
  // guard the home page galleries and /story's strip use.
  const isOnScreen = useInView(trackRef, { amount: 0.4 });

  /**
   * The highest index worth stopping on.
   *
   * The trailing photos share the end of the scroll range — scrolling to
   * any of them lands on the same clamped position — so treating
   * `photos.length - 1` as the end would leave the strip sitting still for
   * a tick each lap, and would let "previous" from the first photo jump to
   * an index that looks identical to the one before it.
   *
   * The floor is index 1, not 0: when only the last photo overflows, every
   * index past 0 clamps to the same end position, and excluding all of
   * them would pin the strip at 0 and make both the timer and the buttons
   * do nothing at all. Landing on the clamped end is still a real, visible
   * pan. Index 0 is only the answer when the strip does not overflow, in
   * which case there is genuinely nowhere to go.
   */
  const lastReachableIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return photos.length - 1;

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) return 0;

    const slides = Array.from(track.children) as HTMLElement[];
    let last = slides.length - 1;
    while (last > 1 && slides[last].offsetLeft - track.offsetLeft > maxScroll) last -= 1;
    return last;
  }, [photos.length]);

  const goTo = useCallback(
    (next: number) => {
      const last = lastReachableIndex();
      setIndex(next < 0 ? last : next > last ? 0 : next);
    },
    [lastReachableIndex]
  );

  // Scrolling is a side effect of `index` rather than something the
  // buttons do directly, so the auto-advance tick and a button press go
  // through exactly the same path.
  useEffect(() => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;

    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [index, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !isOnScreen) return;

    // Re-running on every `index` change means a manual tap on either
    // button restarts the window instead of the timer firing on top of it.
    const timer = window.setTimeout(() => goTo(index + 1), SPACE_SLIDER_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion, isOnScreen, index, goTo]);

  return (
    <div className={cn('relative', className)}>
      <ul
        ref={trackRef}
        className="flex h-full snap-x snap-mandatory list-none gap-2 overflow-x-auto overscroll-x-contain lg:gap-[18px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, position) => {
          const image = responsiveImage(photo.src);
          // Every photo runs at the strip's height and keeps its own
          // aspect ratio, so its rendered width is that ratio times 227
          // (mobile) or 411 (desktop) — a portrait lands near 274px where
          // a landscape lands near 616. One flat `sizes` for the strip
          // would make the browser fetch every portrait at the widest
          // photo's size, so each one states its own share of the frame.
          const ratio = photo.width / photo.height;
          const vw = (height: number, frame: number) =>
            Math.ceil(((ratio * height) / frame) * 100);
          return (
            <li key={photo.src} className="h-full shrink-0 snap-start">
              <img
                src={image.src}
                srcSet={image.srcSet}
                alt={alts[position] ?? ''}
                width={photo.width}
                height={photo.height}
                sizes={`(max-width: 1023px) ${vw(227, 430)}vw, ${vw(411, 1400)}vw`}
                loading="lazy"
                decoding="async"
                className="h-full w-auto max-w-none object-cover"
              />
            </li>
          );
        })}
      </ul>

      {/* Flush to each edge with only the inner corners rounded, as drawn.
          44px rather than the design's 37 to clear the minimum tap target
          — the difference is a few pixels of gold either side. */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label={t('previous')}
        className="absolute left-0 top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-md bg-gold/40 text-cream backdrop-blur-[2px] transition-colors hover:bg-gold/60"
      >
        <IcChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label={t('next')}
        className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-l-md bg-gold/40 text-cream backdrop-blur-[2px] transition-colors hover:bg-gold/60"
      >
        <IcChevronRight className="size-5" />
      </button>
    </div>
  );
}
