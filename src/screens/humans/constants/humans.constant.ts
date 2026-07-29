/**
 * Content for the /humans screen only.
 * Not imported by any other screen — page-scoped content lives here.
 * Display text is translated — see the `humansPage` namespace in
 * messages/*.json; this file only holds non-text data (image paths, ids, hrefs).
 */

import { businessInfo } from '@/shared/constants/site.constant';

// Hero section
export const humansHeroContent = {
  videoSrc: "/videos/humans/hero.mp4",
};

// Hero link list — anchors within this page except the first, which is the
// page itself. "Career Path" has no dedicated section yet, so it stays a
// placeholder anchor until that content ships.
export const humansHeroLinkList = [
  { id: "humans-of-the-home", href: "#humans-of-the-home" },
  { id: "career-path", href: "#career-path" },
  { id: "nha-tim-nguoi", href: "#nha-tim-nguoi" },
] as const;

// Intro section — quote over a monstera texture panel
export const humansIntroContent = {
  backgroundImage: "/images/humans/bg-1.webp",
  backgroundImageMobile: "/images/humans/bg-1-mb.webp",
};

// Chef Nhà story — dark navy / gold split background
export const humansChefStoryContent = {
  backgroundImage: "/images/humans/bg-2.webp",
  backgroundImageMobile: "/images/humans/bg-2-mb.webp",
  image: {
    src: "/images/humans/chef.webp",
    mobileSrc: "/images/humans/chef-mb.webp",
  },
};

// Người Nhà story — mirrored linen / gold split background
export const humansPeopleStoryContent = {
  image: {
    src: "/images/humans/homer.webp",
    mobileSrc: "/images/humans/homer-mb.webp",
  },
};

// Values section — monstera texture panel, distinct from the intro's
export const humansValuesContent = {
  backgroundImage: "/images/humans/bg-3.webp",
  backgroundImageMobile: "/images/humans/bg-3-mb.webp",
};

// Values section — column order/pairing follows the Figma source exactly
export const humansValuesList = [
  { id: "ket-noi" },
  { id: "sang-tao" },
  { id: "tan-tam" },
] as const;

// CTA section — full-bleed photo, closes the page with the recruiting pitch.
// The button applies via email since no dedicated careers page exists yet.
export const humansCtaContent = {
  image: {
    src: "/images/humans/be-homer.webp",
    mobileSrc: "/images/humans/be-homer-mb.webp",
  },
  ctaHref: `mailto:${businessInfo.email}`,
};
