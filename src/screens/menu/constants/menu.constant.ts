/**
 * Content for the /menu screen only.
 * Not imported by any other screen — page-scoped content lives here.
 * Display text is translated — see the `menuPage` namespace in messages/*.json;
 * this file only holds non-text data (image paths, ids, dimensions).
 */

import { menuSpreads } from '@/shared/constants/menu-spreads.constant';

// Hero section. `map-1-2k.png` is the higher-quality `map-1.png` original
// (2800px native, Figma export) resized to 2200px wide and re-encoded —
// same `-2k` treatment as the region maps below, for the same reason (see
// that comment): this is the desktop hero's full-bleed `object-fit: cover`
// image, and WebP at this width renders blank there.
export const menuHeroContent = {
  backgroundImage: '/images/menu/background.webp',
  mapImage: '/images/menu/map-1-2k.png',
};

// Region list (right column of the hero). Each region swaps in its own map
// illustration when selected. `-2k` is the *-bo/-quoc.png originals resized
// to 2200px wide (they're ~2900px native — far more than an ~1400px-wide
// box needs) and re-encoded as PNG rather than WebP: at this width, WebP
// specifically renders blank wherever `object-fit: cover` crops it (see the
// desktop full-bleed map in MenuHeroExplorer) — confirmed by swapping only
// the format at identical dimensions. PNG has no such issue, and for this
// flat-color illustration content it also comes out smaller than the WebP
// encode did.
export const menuRegionList = [
  { id: 'bac-bo', mapImage: '/images/menu/map-bac-bo-2k.png' },
  { id: 'trung-bo', mapImage: '/images/menu/map-trung-bo-2k.png' },
  { id: 'nam-bo', mapImage: '/images/menu/map-nam-bo-2k.png' },
  { id: 'phu-quoc', mapImage: '/images/menu/map-phu-quoc-2k.png' },
] as const;

// Accordion catalog — one section per menu category. The artwork lives in
// `shared/constants/menu-spreads.constant.ts`; the home page's menu section
// pages through the same sets, so neither screen owns them. Categories
// without artwork yet render an empty state instead. The spread artwork
// itself is Vietnamese-only (baked into the image) — only the alt text is
// translated.
export const menuCatalog = [
  { id: 'dac-san-viet', spreads: menuSpreads['dac-san-viet'] },
  { id: 'pizza-classic', spreads: menuSpreads['pizza-classic'] },
  { id: 'salad', spreads: menuSpreads.salad },
  { id: 'mon-chinh', spreads: menuSpreads['mon-chinh'] },
  { id: 'pasta', spreads: menuSpreads.pasta },
  { id: 'trang-mieng', spreads: menuSpreads['trang-mieng'] },
] as const;
