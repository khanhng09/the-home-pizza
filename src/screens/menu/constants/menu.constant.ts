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
//
// `mobileMapImage` is a separate asset, not just a smaller crop of the same
// one: the `-2k` source has real illustration content in only its left ~45%
// (the rest is transparent margin desktop's `object-cover object-left`
// relies on — see the region list comment below), so on mobile, which uses
// `object-contain` to show the whole map at once, that margin would render
// as dead space and shrink the artwork inside it. `map-1-mobile.png` is the
// same source cropped down to just the artwork so `contain` has nothing but
// map to fit — cropped to a *fixed rectangle shared with the region maps*
// below (the union of all their content bounds), not each image auto-
// trimmed to its own tightest bounding box independently. Independent
// per-image trims (`sharp().trim()`) gave visually-identical mainland
// silhouettes different canvas sizes depending on where that region's food
// icons happened to extend the content bounds, which made `object-contain`
// scale/position the *same* coastline differently per region — the map
// visibly "jumped" switching to whichever region's trim came out narrower/
// wider. A shared crop rect makes all four mainland assets byte-identical
// in size, so the coastline sits at the exact same spot in every one and
// only the food icons visibly change. Cropping away the blank margin also
// removes the huge flat region PNG compresses best, so the cropped file
// alone came out *larger* than `map-1-2k.png` despite smaller pixel
// dimensions — `sharp .png({ palette: true, colors: 256 })` on top of the
// crop recovers that (no visible banding on the embedded pizza photos,
// confirmed by eye). WebP got it smaller still, but reproduced the same
// "renders blank" bug noted above for `object-fit: cover` — this time on
// `object-contain`, no cropping involved — so it's not just a crop-specific
// issue; PNG is what's proven not to hit it, mobile included.
export const menuHeroContent = {
  backgroundImage: '/images/menu/background.webp',
  mapImage: '/images/menu/map-1-2k.png',
  mobileMapImage: '/images/menu/map-1-mobile.png',
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
//
// `mobileMapImage` — see the comment on `menuHeroContent` above; same
// shared-crop treatment, one per region (except `phu-quoc`, a genuinely
// different island composition that isn't part of that shared rectangle).
export const menuRegionList = [
  {
    id: 'bac-bo',
    mapImage: '/images/menu/map-bac-bo-2k.png',
    mobileMapImage: '/images/menu/map-bac-bo-mobile.png',
  },
  {
    id: 'trung-bo',
    mapImage: '/images/menu/map-trung-bo-2k.png',
    mobileMapImage: '/images/menu/map-trung-bo-mobile.png',
  },
  {
    id: 'nam-bo',
    mapImage: '/images/menu/map-nam-bo-2k.png',
    mobileMapImage: '/images/menu/map-nam-bo-mobile.png',
  },
  {
    id: 'phu-quoc',
    mapImage: '/images/menu/map-phu-quoc-2k.png',
    mobileMapImage: '/images/menu/map-phu-quoc-mobile.png',
  },
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
