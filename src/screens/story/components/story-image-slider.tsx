'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { IcChevronLeft, IcChevronRight } from '@/shared/components/icons';
import { responsiveImage } from '@/shared/lib/image';
import { STORY_SLIDER_INTERVAL_MS, storyPhotoSizes, storyPhotos } from '../constants/story.constant';

/**
 * Mobile-only photo strip. The design runs the photos edge to edge at a
 * common height, each keeping its own aspect ratio, so the row spills off
 * the right of the viewport and the next photo always peeks in — it is a
 * filmstrip being panned, not one slide swapped for another.
 *
 * Built on native scroll + `scroll-snap` rather than a translated track:
 * the widths differ per photo, so a transform-based carousel would have
 * to measure each one to know how far to move. Scrolling to a child's
 * `offsetLeft` needs no measurement, and it gets touch swiping and
 * keyboard scrolling for free.
 *
 * Desktop shows the same six photos as a fixed collage instead (see
 * StoryIntroSection) — there is room for all of them at once there.
 */
export function StoryImageSlider() {
  const t = useTranslations('storyPage');
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);
  // Auto-advance only runs while the strip is actually on screen — same
  // guard used by the home page's location/menu galleries.
  const isOnScreen = useInView(trackRef, { amount: 0.4 });

  /**
   * The highest index the track can actually bring to its left edge.
   * The last few photos share the end of the scroll range — scrolling to
   * any of them lands on the same clamped position — so treating
   * `storyPhotos.length - 1` as the end would leave the strip sitting
   * still for a tick or two each lap, and would let "previous" from the
   * first photo jump to an index the track cannot reach.
   */
  const lastReachableIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return storyPhotos.length - 1;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const slides = Array.from(track.children) as HTMLElement[];
    let last = slides.length - 1;
    while (last > 0 && slides[last].offsetLeft - track.offsetLeft > maxScroll) last -= 1;
    return last;
  }, []);

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
    // button restarts the 2s window instead of the timer firing right on
    // top of it.
    const timer = window.setTimeout(() => goTo(index + 1), STORY_SLIDER_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion, isOnScreen, index, goTo]);

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="flex h-[min(52.8vw,227px)] snap-x snap-mandatory list-none gap-2 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {storyPhotos.map((photo) => {
          const image = responsiveImage(photo.src);
          return (
            <li key={photo.id} className="h-full shrink-0 snap-start">
              <img
                src={image.src}
                srcSet={image.srcSet}
                alt={t(`intro.photoAlts.${photo.id}`)}
                width={photo.width}
                height={photo.height}
                // Shared with the desktop collage on purpose — see
                // `storyPhotoSizes()`. Both layouts sit in the DOM at every
                // width, so agreeing on one `sizes` is what stops each photo
                // from being downloaded once per layout.
                sizes={storyPhotoSizes(photo)}
                loading="lazy"
                // Below the fold on every viewport this renders at, so it
                // never has a claim on the connection ahead of the roofline
                // band that is the LCP.
                fetchPriority="low"
                decoding="async"
                className="h-full w-auto max-w-none object-cover"
              />
            </li>
          );
        })}
      </ul>

      {/* Flush to each edge with only the inner corners rounded, as drawn.
          44px rather than the design's 37 to clear the 44px minimum tap
          target — the difference is a few pixels of gold either side. */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label={t('slider.previous')}
        className="absolute left-0 top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-md bg-gold/40 text-cream backdrop-blur-[2px] transition-colors hover:bg-gold/60"
      >
        <IcChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label={t('slider.next')}
        className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-l-md bg-gold/40 text-cream backdrop-blur-[2px] transition-colors hover:bg-gold/60"
      >
        <IcChevronRight className="size-5" />
      </button>
    </div>
  );
}
