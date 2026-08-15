import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { sanityApiVersion, sanityDataset, sanityProjectId } from '@/shared/lib/sanity/env';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'The Home Pizza — Story CMS',
  basePath: '/studio',
  projectId: sanityProjectId,
  dataset: sanityDataset,
  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool({ defaultApiVersion: sanityApiVersion })],
});
