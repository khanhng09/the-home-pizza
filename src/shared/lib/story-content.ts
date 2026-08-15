/**
 * The single boundary between the /story screens and wherever their
 * content comes from. Everything below reads Sanity's `storyPost`
 * document type (`sanity/schemaTypes/documents/story-post.ts`) through
 * `sanityClient` — the screens themselves (`screens/story`,
 * `screens/story-detail`) never talk to Sanity directly, only to the
 * `StoryTeaser`/`StoryArticle` types this file returns.
 *
 * `defined(body)` is the publish gate throughout, same as before the CMS
 * landed: 5 of the site's 6 posts are teaser-only today (a title/image
 * announced with no article written yet), and the schema's cross-field
 * validation guarantees a document only ever has a body alongside a full
 * set of article fields (excerpt/readingMinutes/author) — see the
 * `Rule.custom` on `storyPost`'s `body` field.
 */
import { groq } from 'next-sanity';
import { sanityClient } from '@/shared/lib/sanity/client';
import { toStoryBlocks, type RawPortableTextBlock } from '@/shared/lib/sanity/portable-text';
import type { StoryArticle, StoryTeaser } from '@/shared/types/story-content.type';

export type StoryLocale = 'vi' | 'en';

/** Narrows an arbitrary route locale to one the content set has copy for.
 * A CMS query would do the same server-side; doing it here keeps every
 * caller from having to cast. */
function toStoryLocale(locale: string): StoryLocale {
  return locale === 'en' ? 'en' : 'vi';
}

const teaserFields = groq`
  _id,
  "slug": slug.current,
  "title": title[$locale],
  publishedAt,
  "image": {
    "src": mainImage.asset->url,
    "width": mainImage.asset->metadata.dimensions.width,
    "height": mainImage.asset->metadata.dimensions.height,
    "alt": mainImage.alt[$locale]
  },
  "published": defined(body)
`;

const storyFeedQuery = groq`
  *[_type == "storyPost" && defined(publishedAt)] | order(publishedAt desc) {
    ${teaserFields}
  }
`;

const storyArticleQuery = groq`
  *[_type == "storyPost" && slug.current == $slug && defined(body)][0]{
    ${teaserFields},
    "excerpt": excerpt[$locale],
    readingMinutes,
    "author": {
      "name": author.name,
      "avatar": select(defined(author.avatar) => {
        "src": author.avatar.asset->url,
        "width": author.avatar.asset->metadata.dimensions.width,
        "height": author.avatar.asset->metadata.dimensions.height,
        "alt": author.name
      })
    },
    "body": body[$locale][]{
      ...,
      _type == "image" => {
        "src": asset->url,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      }
    }
  }
`;

const publishedSlugsQuery = groq`
  *[_type == "storyPost" && defined(publishedAt) && defined(body)].slug.current
`;

/** Newest first — the order the /story list and the recent-posts rail both
 * render in, so neither screen re-sorts. */
export async function getStoryFeed(locale: string): Promise<StoryTeaser[]> {
  return sanityClient.fetch<StoryTeaser[]>(
    storyFeedQuery,
    { locale: toStoryLocale(locale) },
    { next: { tags: ['story'] } }
  );
}

/** `null` for an unknown slug, and for a teaser whose body has not been
 * written yet — the route turns both into a 404 rather than rendering an
 * article with an empty body. */
export async function getStoryArticle(slug: string, locale: string): Promise<StoryArticle | null> {
  type RawArticle = Omit<StoryArticle, 'body'> & { body: RawPortableTextBlock[] | null };

  const article = await sanityClient.fetch<RawArticle | null>(
    storyArticleQuery,
    { slug, locale: toStoryLocale(locale) },
    { next: { tags: ['story'] } }
  );
  if (!article) return null;

  return { ...article, body: toStoryBlocks(article.body) };
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
  return sanityClient.fetch<string[]>(publishedSlugsQuery, {}, { next: { tags: ['story'] } });
}
