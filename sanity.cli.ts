import { defineCliConfig } from 'sanity/cli';

/**
 * Read directly from `process.env` rather than `@/shared/lib/sanity/env`:
 * this file is loaded by the Sanity CLI itself (`sanity exec`, `sanity
 * dataset ...`), not by Next's bundler, so the `@/*` path alias and Next's
 * env-inlining aren't guaranteed to apply here.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
