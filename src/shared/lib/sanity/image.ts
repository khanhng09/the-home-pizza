import type { StoryImageAsset } from '@/shared/types/story-content.type';
import type { ResponsiveImageSource } from '@/shared/lib/image';

/**
 * Responsive `src`/`srcSet` for an editor-uploaded image, the CMS
 * counterpart to `responsiveImage()` in `shared/lib/image.ts`.
 *
 * That function looks widths up in a manifest `scripts/optimize-images.mjs`
 * wrote at build time — impossible here, since the file doesn't exist in
 * the repo. Sanity's image CDN resizes on request instead: any asset URL
 * it returns accepts `w`/`auto=format` query params and serves a cached,
 * re-encoded variant on the fly, so no local build step is needed.
 *
 * Widths are capped at the asset's real intrinsic width — `image.width`
 * comes from `asset->metadata.dimensions` in the GROQ query — so a small
 * upload never gets upscaled into a step it doesn't have pixels for.
 */
const WIDTH_STEPS = [480, 768, 1024, 1600, 1920];

function sanityVariantUrl(src: string, width: number): string {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  return url.toString();
}

export function sanityResponsiveImage(image: StoryImageAsset): ResponsiveImageSource {
  const widths = WIDTH_STEPS.filter((width) => width < image.width);
  widths.push(image.width);

  return {
    src: sanityVariantUrl(image.src, image.width),
    srcSet:
      widths.length > 1
        ? widths.map((width) => `${sanityVariantUrl(image.src, width)} ${width}w`).join(', ')
        : undefined,
  };
}
