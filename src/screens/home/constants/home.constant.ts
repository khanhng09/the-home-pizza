/**
 * Constants for the Home page only.
 * Not imported by any other page — page-scoped content lives here,
 * cross-page content belongs in `@/shared/constants`.
 * Display text is translated — see the `home` namespace in messages/*.json;
 * this file only holds non-text data (image paths, ids, hrefs).
 */

// Hero section
export const heroContent = {
  videoSrc: "/videos/home/hero-banner.mp4",
  mapImage: "/images/home/vn-map.png",
};

// Trust badges (Hero section)
export const trustBadges = [
  { id: "tripadvisor-2023", image: "/images/home/trip-advisor.png" },
  { id: "tripadvisor-2024", image: "/images/home/trip-advisor.png" },
  { id: "tripadvisor-2025", image: "/images/home/trip-advisor.png" },
  { id: "restaurant-guru-2025", image: "/images/home/guru-recommend.png" },
] as const;

// Story section ("Chuyện Nhà kể")
export const storyContent = {
  backgroundImage: "/images/home/story/background.webp",
  backgroundImageMobile: "/images/home/story/background-mb.webp",
};

export const storyStates = [
  { id: "dsv", image: "/images/home/story/story-dsv.webp" },
  { id: "ht", image: "/images/home/story/story-ht.webp" },
  { id: "tt", image: "/images/home/story/story-tt.webp" },
] as const;

// Menu section
export const menuContent = {
  image: "/images/home/menu/menu.webp",
  imageWidth: 2100,
  imageHeight: 2742,
  backgroundImage: "/images/home/menu/background.webp",
  backgroundImageMobile: "/images/home/menu/background-mb.webp",
};

// Selecting a category turns the right-hand panel like a page in a book.
// Only one photo has shipped for this section so far, so every entry points
// at the same asset until category-specific art lands — same holding pattern
// as `menuRegionList` on the /menu screen.
export const menuCategoryList = [
  { id: "dac-san-viet", href: "/menu#dac-san-viet", image: menuContent.image },
  { id: "pizza-classic", href: "/menu#pizza-classic", image: menuContent.image },
  { id: "salad-appertiza", href: "/menu#salad", image: menuContent.image },
  { id: "pasta", href: "/menu#pasta", image: menuContent.image },
] as const;

// Humans section ("Người Nhà")
export const humansContent = {
  backgroundImage: "/images/home/humans/background.webp",
  backgroundImageMobile: "/images/home/humans/background-mb.webp",
  images: [
    { id: "human-1", src: "/images/home/humans/human-1.webp" },
    { id: "human-2", src: "/images/home/humans/human-2.webp" },
  ],
} as const;

export const humansLinkList = [
  { id: "humans-of-the-home", href: "/humans" },
  { id: "career-path", href: "/humans#career-path" },
  { id: "nha-tim-nguoi", href: "/humans#nha-tim-nguoi" },
] as const;

// Location section
export const locationContent = {
  backgroundImage: "/images/home/location/background.webp",
  backgroundImageMobile: "/images/home/location/background-mb.webp",
};

export const locationStates = [
  { id: "phu-quoc", image: "/images/home/location/space.webp" },
  { id: "nha-trang", image: "/images/home/location/space.webp" },
] as const;
