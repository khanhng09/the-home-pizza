/**
 * The ambiance photography for each house, shared by every screen that
 * shows a place rather than a dish.
 *
 * It lived under `screens/home` while the home page's location panel was
 * the only consumer. /space's filmstrip now shows the same folders, so it
 * moved here rather than being duplicated or cross-imported between
 * screens.
 *
 * Order follows each folder's own file numbering. Dimensions are the
 * originals' — `responsiveImage()` resolves each path to the variants
 * `scripts/optimize-images.mjs` wrote next to it.
 */
export const locationPhotos = {
  "phu-quoc": [
    { src: "/images/home/location/phu-quoc/SHIN8696.webp", width: 1977, height: 1318 },
    { src: "/images/home/location/phu-quoc/SHIN8715.webp", width: 2032, height: 1355 },
    { src: "/images/home/location/phu-quoc/SHIN8752.webp", width: 2059, height: 1373 },
    { src: "/images/home/location/phu-quoc/SHIN8756.webp", width: 1981, height: 1321 },
    { src: "/images/home/location/phu-quoc/SHIN8770.webp", width: 2186, height: 3280 },
    { src: "/images/home/location/phu-quoc/SHIN8774.webp", width: 6000, height: 4000 },
    { src: "/images/home/location/phu-quoc/SHIN8777.webp", width: 4000, height: 6000 },
    { src: "/images/home/location/phu-quoc/SHIN8785.webp", width: 6000, height: 4000 },
    { src: "/images/home/location/phu-quoc/SHIN8797.webp", width: 6000, height: 4000 },
    { src: "/images/home/location/phu-quoc/SHIN8801.webp", width: 6000, height: 4000 },
  ],
  "nha-trang": [
    { src: "/images/home/location/nha-trang/DSC03188.webp", width: 2000, height: 1334 },
    { src: "/images/home/location/nha-trang/DSC03364.webp", width: 2545, height: 1697 },
    { src: "/images/home/location/nha-trang/HUG02484.webp", width: 1319, height: 1978 },
    { src: "/images/home/location/nha-trang/HUG02507.webp", width: 1885, height: 1222 },
    { src: "/images/home/location/nha-trang/HUG02944.webp", width: 1271, height: 1861 },
    { src: "/images/home/location/nha-trang/TRG08978.webp", width: 1495, height: 2243 },
  ],
} as const;

/** Kebab-case city id — also the `/space#<slug>` anchor each house's hero
 * carries, so the home page can deep-link straight to it. */
export type LocationSlug = keyof typeof locationPhotos;

export type LocationPhoto = (typeof locationPhotos)[LocationSlug][number];
