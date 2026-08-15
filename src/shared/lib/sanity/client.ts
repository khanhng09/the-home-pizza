import { createClient } from '@sanity/client';
import { sanityApiVersion, sanityDataset, sanityProjectId } from './env';

/**
 * Read-only client for the site's Server Components. `useCdn: false`
 * deliberately — freshness here comes from Next's Data Cache (`next: {
 * tags: ['story'] }` on every `fetch` call below) plus the publish webhook
 * calling `revalidateTag('story', 'max')`. Sanity's CDN has its own
 * ~30-60s edge cache independent of that; leaving `useCdn: true` on would
 * mean a freshly revalidated page could still read stale CDN data right
 * after publish, undercutting the whole point of the webhook.
 *
 * No token: the dataset's public read access is what this client relies
 * on. A write token only exists in `scripts/seed-sanity-story.mjs`, never
 * here.
 */
export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: false,
});
