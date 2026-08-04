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

      // Rejects when the browser blocks autoplay despite `muted`; there
      // is nothing to recover — the poster stays on screen.
      video.play().catch(() => {});
    };

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
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
