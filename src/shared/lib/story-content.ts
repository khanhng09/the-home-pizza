/**
 * The single boundary between the /story screens and wherever their content
 * comes from.
 *
 * Everything below reads `shared/constants/story-content.constant.ts`. When
 * the CMS lands, only the bodies of these four functions change — the
 * screens already `await` them and already consume the CMS-shaped types in
 * `shared/types/story-content.type.ts`.
 *
 * The Sanity equivalents, for reference:
 *
 *   getStoryFeed(locale)
 *     *[_type == "story" && language == $locale && defined(publishedAt)]
 *       | order(publishedAt desc){ _id, "slug": slug.current, title, publishedAt,
 *         image{ "src": asset->url, "width": asset->metadata.dimensions.width,
 *                "height": asset->metadata.dimensions.height, alt },
 *         "published": defined(body) }
 *
 *   getStoryArticle(slug, locale)
 *     adds `excerpt, readingMinutes, author->{name, avatar}, body[]`.
 *
 * Both are static-friendly: call them from a Server Component with
 * `next: { tags: ['story'] }` and let a Sanity webhook call
 * `revalidateTag('story', 'max')` on publish, so the pages stay prerendered
 * rather than falling back to request-time rendering.
 */
import { storyEntries, type StoryLocale } from '@/shared/constants/story-content.constant';
import type { StoryArticle, StoryTeaser } from '@/shared/types/story-content.type';

/** Narrows an arbitrary route locale to one the content set has copy for.
 * A CMS query would do the same server-side; doing it here keeps every
 * caller from having to cast. */
function toStoryLocale(locale: string): StoryLocale {
  return locale === 'en' ? 'en' : 'vi';
}

function toTeaser(entry: (typeof storyEntries)[number], locale: StoryLocale): StoryTeaser {
  return {
    _id: entry._id,
    slug: entry.slug,
    title: entry.title[locale],
    publishedAt: entry.publishedAt,
    image: { ...entry.image, alt: entry.image.alt[locale] },
    published: Boolean(entry.article),
  };
}

/** Newest first — the order the /story list and the recent-posts rail both
 * render in, so neither screen re-sorts. */
export async function getStoryFeed(locale: string): Promise<StoryTeaser[]> {
  const storyLocale = toStoryLocale(locale);

  return storyEntries
    .map((entry) => toTeaser(entry, storyLocale))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** `null` for an unknown slug, and for a teaser whose body has not been
 * written yet — the route turns both into a 404 rather than rendering an
 * article with an empty body. */
export async function getStoryArticle(slug: string, locale: string): Promise<StoryArticle | null> {
  const storyLocale = toStoryLocale(locale);
  const entry = storyEntries.find((candidate) => candidate.slug === slug);
  if (!entry?.article) return null;

  const { excerpt, body } = entry.article.content[storyLocale];

  return {
    ...toTeaser(entry, storyLocale),
    excerpt,
    body,
    readingMinutes: entry.article.readingMinutes,
    author: entry.article.author,
  };
}

/** The "Bài đăng gần đây" rail: the newest entries other than the one being
 * read. Kept at the data layer so the section stays presentational. */
export async function getRelatedStories(
  slug: string,
  locale: string,
  limit = 3
): Promise<StoryTeaser[]> {
  const feed = await getStoryFeed(locale);
  return feed.filter((teaser) => teaser.slug !== slug).slice(0, limit);
}

/** Every slug that has a body, for `generateStaticParams`. Unpublished
 * teasers are excluded so the build doesn't prerender pages that 404. */
export async function getPublishedStorySlugs(): Promise<string[]> {
  return storyEntries.filter((entry) => entry.article).map((entry) => entry.slug);
}
