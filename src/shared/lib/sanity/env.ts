/**
 * The one place that reads Sanity's env vars. `NEXT_PUBLIC_` because the
 * embedded Studio route (`app/studio`) is a client component — Next only
 * inlines that prefix into the client bundle, so `projectId`/`dataset`
 * have to carry it even though the public read API doesn't strictly need
 * it kept secret.
 */
function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const sanityProjectId = required(
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
);
export const sanityDataset = required(
  'NEXT_PUBLIC_SANITY_DATASET',
  process.env.NEXT_PUBLIC_SANITY_DATASET
);
/** Pinned, dated API version — Sanity's own recommendation, so query
 * behavior never shifts under us on a rolling default. */
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-01';
