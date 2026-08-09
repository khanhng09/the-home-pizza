/**
 * Content for the /story screen only.
 * Not imported by any other screen — page-scoped content lives here.
 * Display text is translated — see the `storyPage` namespace in
 * messages/*.json; this file only holds non-text data (image paths, ids, dates).
 */

// Paper texture behind the whole screen — see StoryBackdrop, which paints
// it once for every section rather than per section. No equivalent exists
// yet under /images/story (only the photos below and the hero band do), so
// this still points at the shared paper/plant texture the home page teaser
// and menu hero already reuse from their own screen folders.
export const storyBackdropContent = {
  backgroundImage: "/images/home/story/background.webp",
  backgroundImageMobile: "/images/home/story/background-mb.webp",
};

/** Full-bleed wavy roofline band under the fixed header, at the very top
 * of the page — the same motif used at the top of the home hero. */
export const storyHeroBand = { src: "/images/story/hero.webp", width: 4200, height: 717 };

// The six real photos behind the intro collage. Desktop lays them out as a
// fixed collage (see StoryIntroSection); mobile cycles through the same
// set as a single-image slider (see StoryImageSlider) — both read from
// this one list so there's only one place that knows the photo order.
export const storyPhotos = [
  { id: "chef-oven", src: "/images/story/story-1.webp", width: 795, height: 1062 },
  { id: "exterior", src: "/images/story/story-2.webp", width: 780, height: 588 },
  { id: "kitchen-staff", src: "/images/story/story-3.webp", width: 786, height: 591 },
  { id: "plate-detail", src: "/images/story/story-4.webp", width: 378, height: 378 },
  { id: "dish-detail", src: "/images/story/story-5.webp", width: 378, height: 378 },
  { id: "dining-room", src: "/images/story/story-6.webp", width: 780, height: 1038 },
] as const;

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
