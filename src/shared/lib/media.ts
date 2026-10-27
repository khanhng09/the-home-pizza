/**
 * Origin the `/images/*`, `/videos/*` and `/illustrations/*` files are
 * served from — the Cloudflare R2 bucket's custom domain (e.g.
 * `https://media.thehomepizza.com`), uploaded by `yarn media:upload`.
 *
 * Netlify bills bandwidth per GB, and images + videos alone were ~90% of it;
 * R2 doesn't bill egress at all. The files stay in `public/` too, so with
 * this unset (local dev, or a deploy before the bucket is filled) every
 * path falls back to the copy Netlify serves.
 *
 * Read at build time: change it in Netlify's environment variables and
 * redeploy.
 */
export const MEDIA_BASE_URL = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? '').replace(/\/+$/, '');

/** The folders `yarn media:upload` sends. `/illustrations/*` is painted
 * through CSS `mask-image`, which fetches in CORS mode — see
 * `Illustration` for the header that makes that work. OG images stay on
 * Netlify: crawlers resolve them against `SITE_URL` (see
 * `shared/lib/metadata.ts`). */
const MEDIA_PREFIXES = ['/images/', '/videos/', '/illustrations/'];

/**
 * Rewrites a `public/` media path to the media origin. Anything else —
 * absolute URLs (Sanity's CDN), other folders, or an already-rewritten
 * path — is returned unchanged, so it's safe to apply twice.
 *
 * Apply it where a path becomes a URL the browser fetches (`src`,
 * `srcSet`, `poster`, `url()`), never to the constants themselves: those
 * paths double as keys into `image-variants.generated.json`.
 */
export function mediaUrl(path: string): string {
  if (!MEDIA_BASE_URL || !MEDIA_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return path;
  }
  return `${MEDIA_BASE_URL}${path}`;
}
