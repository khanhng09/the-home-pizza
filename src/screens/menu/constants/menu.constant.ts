/**
 * Content for the /menu screen only.
 * Not imported by any other screen — page-scoped content lives here.
 * Display text is translated — see the `menuPage` namespace in messages/*.json;
 * this file only holds non-text data (image paths, ids, dimensions).
 */

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

// Accordion catalog — one section per menu category. `spreads` holds the
// (already-typeset) menu-page images for that category; categories without
// artwork yet render an empty state instead. The spread artwork itself is
// Vietnamese-only (baked into the image) — only the alt text is translated.
export const menuCatalog = [
  {
    id: 'dac-san-viet',
    spreads: [
      { src: '/images/menu/dsv-1.webp', width: 777, height: 1100 },
      { src: '/images/menu/dsv-2.webp', width: 777, height: 1100 },
    ],
  },
  {
    id: 'pizza-classic',
    spreads: [
      { src: '/images/menu/pizza-1.webp', width: 777, height: 1100 },
      { src: '/images/menu/pizza-2.webp', width: 777, height: 1100 },
    ],
  },
  {
    id: 'salad',
    spreads: [],
  },
  {
    id: 'mon-chinh',
    spreads: [
      { src: '/images/menu/mc-1.webp', width: 777, height: 1100 },
      { src: '/images/menu/mc-2.webp', width: 777, height: 1100 },
    ],
  },
  {
    id: 'pasta',
    spreads: [
      { src: '/images/menu/pasta-1.webp', width: 777, height: 1100 },
      { src: '/images/menu/pasta-2.webp', width: 777, height: 1100 },
    ],
  },
  {
    id: 'trang-mieng',
    spreads: [
      { src: '/images/menu/tm-1.webp', width: 777, height: 1100 },
      { src: '/images/menu/tm-2.webp', width: 777, height: 1100 },
    ],
  },
] as const;
