/**
 * Content for the /menu screen only.
 * Not imported by any other screen — page-scoped content lives here.
 * Display text is translated — see the `menuPage` namespace in messages/*.json;
 * this file only holds non-text data (image paths, ids, dimensions).
 */

import { menuSpreads } from '@/shared/constants/menu-spreads.constant';

// Hero section
export const menuHeroContent = {
  backgroundImage: '/images/menu/background.webp',
  mapImage: '/images/menu/map-1.webp',
};

// Region list (right column of the hero). Each region will eventually swap
// the map illustration when selected — only one map asset exists today, so
// every entry points at the same image until region-specific art ships.
export const menuRegionList = [
  { id: 'bac-bo', mapImage: '/images/menu/map-1.webp' },
  { id: 'trung-bo', mapImage: '/images/menu/map-1.webp' },
  { id: 'nam-bo', mapImage: '/images/menu/map-1.webp' },
  { id: 'phu-quoc', mapImage: '/images/menu/map-1.webp' },
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
