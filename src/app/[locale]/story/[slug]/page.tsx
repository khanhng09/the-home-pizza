import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { StoryDetailArticleSection, StoryDetailRelatedSection } from '@/screens/story-detail';
import { generateJsonLd, generatePageMetadata } from '@/shared/lib/metadata';
import {
  getPublishedStorySlugs,
  getRelatedStories,
  getStoryArticle,
} from '@/shared/lib/story-content';
import { businessInfo, SITE_URL } from '@/shared/constants/site.constant';
import { routing } from '@/i18n/routing';

type StoryDetailParams = { locale: string; slug: string };

/** Prerenders every published article per locale. Teasers without a body
 * are excluded, so the build never emits a page that immediately 404s. */
export async function generateStaticParams() {
  const slugs = await getPublishedStorySlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<StoryDetailParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getStoryArticle(slug, locale);

  if (!article) return { title: 'Not found', robots: { index: false, follow: false } };

  return generatePageMetadata(locale, article.title, article.excerpt, {
    canonical: `/story/${slug}`,
    image: article.image.src,
    ogType: 'article',
  });
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<StoryDetailParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await getStoryArticle(slug, locale);
  if (!article) notFound();

  const related = await getRelatedStories(slug, locale);

  // Article schema, so the post is eligible for a rich result rather than a
  // plain blue link. Emitted as a native script tag — JSON-LD is data, not
  // executable code, so `next/script` would be the wrong tool — and with
  // `<` escaped by `generateJsonLd`.
  const jsonLd = generateJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    inLanguage: locale,
    image: `${SITE_URL}${article.image.src}`,
    author: { '@type': 'Organization', name: article.author.name },
    publisher: {
      '@type': 'Organization',
      name: businessInfo.name,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${locale === routing.defaultLocale ? '' : `/${locale}`}/story/${slug}`,
    },
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <StoryDetailArticleSection article={article} locale={locale} />
      <StoryDetailRelatedSection stories={related} />
    </>
  );
}
