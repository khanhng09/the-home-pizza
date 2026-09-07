'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether the page has scrolled up or down since the last read,
 * for a header that hides the instant scrolling goes down and reappears
 * the instant it goes up — no distance threshold, so it reacts to the very
 * first pixel of a direction change rather than waiting for a flick.
 *
 * Stays `false` (visible) below `hideAfter` px so the header never hides
 * while the visitor is still near the top of the page.
 */
export function useScrollDirection({ hideAfter = 96 } = {}) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= hideAfter) {
        setHidden(false);
      } else if (delta !== 0) {
        setHidden(delta > 0);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hideAfter]);

  return hidden;
}
