'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query from JS. Needed because Framer Motion
 * animates via inline styles, so a plain CSS media query cannot reach
 * motion values the way it can a CSS transition.
 *
 * Built on `useSyncExternalStore` (the React-recommended primitive for
 * subscribing to a browser API like this) rather than a `useState` +
 * `useEffect` pair, so there's no synchronous `setState`-in-effect and no
 * extra re-render on mount. Reports `false` for the server-rendered pass
 * and first hydration — every caller in this project treats `false` as
 * "mobile," which is the correct default while the real value resolves.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onChange);
      // `getServerSnapshot` below always reports `false` (there's no real
      // value during SSR), so on mount the client's *actual* snapshot may
      // already differ from what was just rendered — but matchMedia only
      // fires `change` on a future crossing, not for that existing gap.
      // Calling `onChange` once right after subscribing forces React to
      // re-read `getSnapshot()` immediately, closing that gap on mount
      // instead of waiting for a live resize across the breakpoint.
      onChange();
      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
