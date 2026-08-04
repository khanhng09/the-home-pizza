import variantManifest from '@/shared/constants/image-variants.generated.json';

const VARIANTS: Record<string, number[]> = variantManifest;

export interface ResponsiveImageSource {
  /** Largest generated variant — the fallback for anything that ignores
   * `srcSet`, and never the unoptimized original. */
  src: string;
  /** `undefined` when only one width exists, so we don't emit a
   * single-entry `srcset` that tells the browser nothing. */
  srcSet?: string;
}

/**
 * Resolves an original asset path to the responsive set that
 * `scripts/optimize-images.mjs` produced for it.
 *
 * The widths come from the generated manifest rather than being passed in
 * at the call site: a source narrower than a configured width yields
 * fewer variants than requested, and guessing here would point `srcset`
 * at files that were never written.
 *
 * Anything absent from the manifest falls through to its original path,
 * so adding an image without re-running the script degrades to the
 * unoptimized file instead of a 404.
 */
export function responsiveImage(source: string): ResponsiveImageSource {
  const widths = VARIANTS[source];
  if (!widths?.length) return { src: source };

  const base = source.replace(/\.[a-z0-9]+$/i, '');
  const variant = (width: number) => `${base}.w${width}.webp`;

  return {
    src: variant(widths[widths.length - 1]),
    srcSet:
      widths.length > 1
        ? widths.map((width) => `${variant(width)} ${width}w`).join(', ')
        : undefined,
  };
}

/** Path of the single largest variant — for CSS `background-image` and
 * anywhere else that can't take a `srcset`. */
export function optimizedImage(source: string): string {
  return responsiveImage(source).src;
}
