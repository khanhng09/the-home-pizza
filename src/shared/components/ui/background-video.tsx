'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

export interface BackgroundVideoSource {
  src: string;
  type: string;
  /** Media query gating this rendition, in `<source media>` form. */
  media?: string;
}

interface BackgroundVideoProps {
  sources: readonly BackgroundVideoSource[];
  poster: string;
  className?: string;
}

/**
 * A muted, looping background video: paints its poster immediately and
 * holds the video itself back until the page has finished loading.
 *
 * `autoPlay` starts the media resource-selection algorithm immediately
 * and overrides `preload`, so the previous markup pulled 17.6MB down in
 * parallel with the fonts, CSS and JS that first paint actually depends
 * on. Attaching the sources only after the `load` event moves that
 * transfer out of the critical path entirely, and the poster — a 191KB
 * still of the video's own first frame — covers the gap, so the hero has
 * an image from the first paint rather than a dark box.
 *
 * Under `prefers-reduced-motion` no video is fetched at all: the poster
 * is already the still image such a visitor should be left with, so
 * several megabytes are simply never requested.
 */
export function BackgroundVideo({ sources, poster, className }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // The source is attached imperatively rather than through state: this
  // is exactly the "synchronise with an external system" case effects are
  // for, and setting state from an effect that may run synchronously on
  // an already-loaded document would cascade an extra render.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const start = () => {
      // `useReducedMotion` resolves from `null` on the first client
      // render, so this runs again — bail before touching the DOM if the
      // answer came back as "no motion".
      if (cancelled || prefersReducedMotion) return;

      // Set as *properties*, not just JSX attributes. iOS only treats a
      // video as autoplay-eligible if it is muted and inline at the moment
      // resource selection runs, and React's `muted` prop does not always
      // reach the attribute in time — which is why these heroes played on
      // desktop and sat on their poster on a phone.
      video.muted = true;
      video.playsInline = true;

      if (!video.querySelector('source')) {
        for (const rendition of sources) {
          const source = document.createElement('source');
          source.src = rendition.src;
          source.type = rendition.type;
          if (rendition.media) source.media = rendition.media;
          video.appendChild(source);
        }
        // Sources added after mount stay invisible to the element until
        // `load()` re-runs resource selection.
        video.load();
      }

      // Still rejects under iOS Low Power Mode and similar policies, where
      // nothing but a real gesture will do — hence the listeners below.
      video.play().catch(() => {});
    };

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start, { once: true });
    }

    // Second chance, on the visitor's first touch or scroll. A blocked
    // autoplay leaves the poster up forever otherwise; these are passive
    // and remove themselves as soon as the video is actually running.
    const retry = () => {
      if (cancelled || prefersReducedMotion || !video.paused) return;
      start();
    };

    const retryEvents = ['pointerdown', 'touchstart', 'scroll'] as const;
    for (const name of retryEvents) {
      window.addEventListener(name, retry, { passive: true });
    }

    // Third chance: heroes below the fold (the /humans one) may never have
    // been eligible while off-screen.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) retry();
      },
      { threshold: 0.1 }
    );
    observer.observe(video);

    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
      for (const name of retryEvents) window.removeEventListener(name, retry);
      observer.disconnect();
    };
  }, [sources, prefersReducedMotion]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
