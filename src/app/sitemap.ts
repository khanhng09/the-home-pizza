import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/constants/site.constant';
import { localizedPath } from '@/shared/lib/metadata';
import { getPublishedStorySlugs } from '@/shared/lib/story-content';
import { routing } from '@/i18n/routing';

type RouteEntry = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
};

/** Every static route this site has, mirroring the `canonical` paths each
 * page already passes to `generatePageMetadata`. */
const STATIC_ROUTES: RouteEntry[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/menu', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/story', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/humans', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/space', changeFrequency: 'monthly', priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedStorySlugs();
  const storyRoutes: RouteEntry[] = slugs.map((slug) => ({
    path: `/story/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const routes = [...STATIC_ROUTES, ...storyRoutes];

  return routing.locales.flatMap((locale) =>
    routes.map(({ path, changeFrequency, priority }) => ({
      url: new URL(localizedPath(locale, path), SITE_URL).toString(),
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  );
}
