/**
 * Content for the /story screen only.
 * Not imported by any other screen — page-scoped content lives here.
 * Display text is translated — see the `storyPage` namespace in
 * messages/*.json; this file only holds non-text data (image paths, ids, dates).
 */

/** Full-bleed wavy roofline band under the fixed header, at the very top
 * of the page — the same motif used at the top of the home hero. */
export const storyHeroBand = { src: "/images/story/hero.webp", width: 4200, height: 717 };

/** The collage's design canvas. `collageWidth` below is measured on it, and
 * the desktop half of `storyPhotoSizes()` is a share of it. */
export const STORY_COLLAGE_CANVAS = { width: 1400, height: 870 };

/** The mobile filmstrip's height: `52.8vw`, capped at `227px`. Both numbers
 * are the design's; the cap is reached at a 430px viewport, which is the
 * width the mobile frame was drawn at. */
const FILMSTRIP_HEIGHT_VW = 52.8;
const FILMSTRIP_HEIGHT_PX = 227;
const FILMSTRIP_CAP_VIEWPORT_PX = Math.round(FILMSTRIP_HEIGHT_PX / (FILMSTRIP_HEIGHT_VW / 100));

/** The `lg` breakpoint, where the filmstrip gives way to the collage. */
const COLLAGE_BREAKPOINT_PX = 1024;

// The six real photos behind the intro collage. Desktop lays them out as a
// fixed collage (see StoryIntroSection); mobile cycles through the same
// set as a single-image slider (see StoryImageSlider) — both read from
// this one list so there's only one place that knows the photo order.
//
// `collageWidth` is the photo's width in the desktop collage, in design px
// on STORY_COLLAGE_CANVAS. It lives here rather than beside the rest of the
// collage geometry in the section because `storyPhotoSizes()` needs it, and
// both layouts have to agree on the answer — see that function.
export const storyPhotos = [
  { id: "chef-oven", src: "/images/story/story-1.webp", width: 795, height: 1062, collageWidth: 266 },
  { id: "exterior", src: "/images/story/story-2.webp", width: 780, height: 588, collageWidth: 260 },
  { id: "kitchen-staff", src: "/images/story/story-3.webp", width: 786, height: 591, collageWidth: 262 },
  { id: "plate-detail", src: "/images/story/story-4.webp", width: 378, height: 378, collageWidth: 126 },
  { id: "dish-detail", src: "/images/story/story-5.webp", width: 378, height: 378, collageWidth: 126 },
  { id: "dining-room", src: "/images/story/story-6.webp", width: 780, height: 1038, collageWidth: 260 },
] as const;

/**
 * The `sizes` attribute for one photo — deliberately shared by the desktop
 * collage and the mobile filmstrip, which is what keeps this screen from
 * downloading every photo twice.
 *
 * Both layouts are always in the DOM; only one is `display: none` at any
 * width. A `display: none` image still gets fetched (it has no layout box,
 * so `loading="lazy"` has nothing to defer against), so whatever the hidden
 * layout asks for is downloaded too. Give the two layouts different `sizes`
 * and they resolve to different `srcset` candidates — two URLs, two
 * requests, for the same photo. Give them the *same* `sizes` and both
 * resolve to the same URL, which the browser fetches once. Measured on
 * mobile: 484 KB of photos before, 252 KB after.
 *
 * The strip is height-driven — each photo is `h-full w-auto`, so its slot
 * is the strip height times its own aspect ratio, not a fixed share of the
 * viewport. `sizes="70vw"` (one value for all six) was overstating the
 * portrait photos by ~1.8x and made the browser pick the 780w variant of a
 * photo it was painting 164px wide.
 */
export function storyPhotoSizes(photo: (typeof storyPhotos)[number]): string {
  const ratio = photo.width / photo.height;
  const collage = ((photo.collageWidth / STORY_COLLAGE_CANVAS.width) * 100).toFixed(2);
  const stripCapped = Math.round(FILMSTRIP_HEIGHT_PX * ratio);
  const stripFluid = (FILMSTRIP_HEIGHT_VW * ratio).toFixed(2);

  return [
    `(min-width: ${COLLAGE_BREAKPOINT_PX}px) ${collage}vw`,
    `(min-width: ${FILMSTRIP_CAP_VIEWPORT_PX}px) ${stripCapped}px`,
    `${stripFluid}vw`,
  ].join(', ');
}

/** Lookup by id — the desktop collage places each photo in a specific
 * slot (portrait/landscape/square), unlike the mobile slider which just
 * cycles through `storyPhotos` in order. */
export const storyPhotoById = Object.fromEntries(storyPhotos.map((photo) => [photo.id, photo])) as Record<
  (typeof storyPhotos)[number]['id'],
  (typeof storyPhotos)[number]
>;

/** How long the mobile photo slider holds before auto-advancing. */
export const STORY_SLIDER_INTERVAL_MS = 2000;

// The "Chuyện Nhà kể" feed used to be hardcoded here with its titles in
// messages/*.json. It now comes from `shared/lib/story-content.ts`, which
// both this screen and /story/[slug] read — see that module for why
// editorial copy moved out of `messages`.
