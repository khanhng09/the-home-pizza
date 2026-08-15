'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

/** Studio is a 100% client-rendered SPA against Sanity's API — nothing
 * here needs server rendering per request, so this ships as a static
 * shell rather than opting the route into dynamic rendering. */
export const dynamic = 'force-static';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
