import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/constants/site.constant';

/** `/illustrations` is left off `disallow` on purpose — it already carries
 * its own `noindex` meta tag (see its `generateMetadata`), and blocking the
 * crawl here would stop Google from ever seeing that tag. `/studio` and
 * `/api` have no such tag and no reason to be crawled at all. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
