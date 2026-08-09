import type { CSSProperties } from 'react';
import { cn } from '@/shared/lib/utils';

/** Masks produced by `yarn illustrations:extract`. Adding a name here
 * without adding it to that script's list renders nothing. */
export type IllustrationName =
  | 'dong-ho-tieu'
  | 'dong-ho-tre'
  | 'dong-ho-banh-da'
  | 'dong-ho-hung-que'
  | 'dong-ho-hen'
  | 'dong-ho-ngheu'
  | 'dong-ho-tom'
  | 'dong-ho-cua'
  | 'dong-ho-bo'
  | 'dong-ho-nhum'
  | 'dong-ho-ca-trich'
  | 'dong-ho-ghe'
  | 'dong-ho-cha-gio-phan-thiet'
  | 'dong-ho-lap-xuong'
  | 'dong-ho-nom-thinh-tai-heo'
  | 'dong-ho-doi'
  | 'dong-ho-pizza-base'
  | 'dong-ho-sau-rieng'
  | 'dong-ho-pizza-dough'
  | 'dong-ho-hoi-que';

interface IllustrationProps {
  name: IllustrationName;
  /** Must carry its own width and height — there is no intrinsic size to
   * fall back on, unlike the inline SVG components this replaces. */
  className?: string;
  /** For call sites whose geometry is computed rather than a static class
   * — e.g. the story collage, which derives every offset from the design
   * canvas at render time, so Tailwind has no literal class to compile.
   * Merged ahead of the mask properties, which stay non-overridable. */
  style?: CSSProperties;
}

/**
 * A decorative illustration drawn as a CSS mask over
 * `background-color: currentColor`.
 *
 * The inline `illus-*.tsx` components these replace were up to 276KB of
 * traced path data each, and App Router emitted every one of them twice —
 * once as markup, once inside the RSC flight payload. Moving them to
 * external files takes that weight out of the document entirely and lets
 * them be cached across pages.
 *
 * A mask rather than an `<img>` so `currentColor` still applies: every
 * call site colours these with `text-gold` or `text-accent/60`, and a
 * raster `<img>` would have needed one baked file per colour.
 */
export function Illustration({ name, className, style }: IllustrationProps) {
  const mask = `url(/illustrations/${name}.webp)`;

  return (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none block bg-current', className)}
      style={{
        ...style,
        maskImage: mask,
        WebkitMaskImage: mask,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}
