export const spaceImages = {
  phuQuocHero: "/images/space/hero.png",
  phuQuocHeroMobile: "/images/space/hero-mb.png",
  phuQuocGalleryPrimary: "/images/space/pq-1.png",
  phuQuocGallerySecondary: "/images/space/pq-2.png",
  nhaTrangHero: "/images/space/hero-nt.png",
  nhaTrangGalleryPrimary: "/images/space/nt-1.png",
  nhaTrangGallerySecondary: "/images/space/nt-2.png",
};

export const spaceLocations = [
  {
    id: "phuQuoc",
    theme: "light",
    heroImage: spaceImages.phuQuocHero,
    mobileHeroImage: spaceImages.phuQuocHeroMobile,
    heroWidth: 2800,
    heroHeight: 1868,
    mobileHeroWidth: 860,
    mobileHeroHeight: 574,
    gallery: [
      {
        image: spaceImages.phuQuocGalleryPrimary,
        width: 1234,
        height: 822,
      },
      {
        image: spaceImages.phuQuocGallerySecondary,
        width: 546,
        height: 822,
      },
    ],
  },
  {
    id: "nhaTrang",
    theme: "dark",
    heroImage: spaceImages.nhaTrangHero,
    mobileHeroImage: undefined,
    heroWidth: 2800,
    heroHeight: 1868,
    mobileHeroWidth: undefined,
    mobileHeroHeight: undefined,
    gallery: [
      {
        image: spaceImages.nhaTrangGalleryPrimary,
        width: 1234,
        height: 822,
      },
      {
        image: spaceImages.nhaTrangGallerySecondary,
        width: 1477,
        height: 822,
      },
    ],
  },
] as const;
