/**
 * Content for the /space screen only.
 * Not imported by any other screen — page-scoped content lives here.
 * Display text is translated — see the `spacePage` namespace in
 * messages/*.json; this file only holds non-text data (image paths, sizes).
 *
 * Every path points at an original; `responsiveImage()` resolves it to the
 * variants `scripts/optimize-images.mjs` wrote next to it.
 */
import { locationPhotos } from "@/shared/constants/location-photos.constant";

/**
 * The two Signature houses, in the order the page tells them. `theme`
 * drives the whole band: the light one runs cream paper with the copy on
 * the left, the dark one mirrors it against `deep` with the copy on the
 * right.
 *
 * `slug` is the kebab-case city id, matching the one the home page's
 * location panel uses. It is this house's DOM anchor, so `/space#phu-quoc`
 * is a shareable link straight to it; `id` stays camelCase because it keys
 * into the `spacePage.locations` message namespace.
 *
 * `heroMobile` is a separate crop of the same room, not a smaller
 * encoding — Nha Trang has no such crop drawn yet, so it reuses the wide
 * hero at every width.
 *
 * The filmstrip shows each house's full ambiance folder rather than the
 * two placeholder stills the comp mocks up with: the comp draws a slider,
 * and two photos that happen to fill the strip exactly have nothing to
 * slide.
 */
export const spaceLocations = [
  {
    id: "phuQuoc",
    slug: "phu-quoc",
    theme: "light",
    hero: { src: "/images/space/hero.png", width: 2800, height: 1868 },
    heroMobile: { src: "/images/space/hero-mb.png", width: 860, height: 574 },
    gallery: locationPhotos["phu-quoc"],
  },
  {
    id: "nhaTrang",
    slug: "nha-trang",
    theme: "dark",
    hero: { src: "/images/space/hero-nt.png", width: 2800, height: 1868 },
    heroMobile: null,
    gallery: locationPhotos["nha-trang"],
  },
] as const;

export type SpaceLocation = (typeof spaceLocations)[number];

/** How long the gallery filmstrip holds before auto-advancing. Slower
 * than /story's 2s: these photos are wide interiors that need a beat to
 * read, and there are only two of them per band. */
export const SPACE_SLIDER_INTERVAL_MS = 2000;
