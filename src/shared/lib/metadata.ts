import type { Metadata } from 'next';
import { businessInfo, seoDefaults, SITE_URL } from '@/shared/constants/site.constant';
import { routing } from '@/i18n/routing';
import ogImageManifest from '@/shared/constants/og-images.generated.json';

const OG_LOCALE: Record<string, string> = {
  vi: 'vi_VN',
  en: 'en_US',
};

const OG_IMAGES: Record<string, string> = ogImageManifest;

/**
 * The 1200x630 link-preview card cut from a content image.
 *
 * Pages and articles name the *content* photo they want to be previewed by
 * — `/images/space/hero.png`, an article's cover — and this resolves it to
 * the JPEG card `yarn images:og` wrote for it. Passing the content image
 * itself to `openGraph.images` does not work: those files are WebP (patchy
 * unfurler support) at their own aspect ratios (cropped unpredictably per
 * platform), and the masters run to several MB, which some unfurlers
 * refuse outright.
 *
 * Anything without a card falls back to the site default, matching how
 * `responsiveImage()` degrades — a page still gets a valid preview rather
 * than a 404 when a source is renamed without re-running the script.
 */
export function ogImage(source?: string): string {
  return (source && OG_IMAGES[source]) || seoDefaults.image;
}

/** Prefixes a path with the locale segment, except for the default locale ("as-needed" mode). */
export function localizedPath(locale: string, path: string): string {
  if (locale === routing.defaultLocale) return path;
  const suffix = path === '/' ? '' : path;
  return `/${locale}${suffix}`;
}

/**
 * Generate root metadata for the site, per locale
 */
export function generateRootMetadata(locale: string, title: string, description: string): Metadata {
  const canonical = new URL(localizedPath(locale, '/'), SITE_URL).toString();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${businessInfo.name}`,
    },
    description,
    keywords: seoDefaults.keywords,
    creator: businessInfo.name,
    publisher: businessInfo.name,
    applicationName: businessInfo.name,
    formatDetection: {
      email: false,
      telephone: false,
      address: false,
    },
    alternates: { canonical },
    // `prefers-color-scheme` on <link rel="icon"> only tracks the OS scheme,
    // not a browser's own manually-set UI theme (e.g. Brave's dark mode with
    // the OS in light mode) — that mismatch renders the wrong-contrast SVG
    // invisible on the tab strip. `favicon.ico` carries its own cream
    // background swatch instead, so it stays legible regardless of the
    // surrounding chrome color; no need for a scheme-matched pair.
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
    },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale] ?? OG_LOCALE[routing.defaultLocale],
      url: canonical,
      siteName: businessInfo.name,
      title,
      description,
      images: [
        {
          url: seoDefaults.image,
          width: 1200,
          height: 630,
          alt: businessInfo.name,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [seoDefaults.image],
      creator: seoDefaults.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    },
  };
}

/**
 * Generate metadata for a specific page, per locale
 */
export function generatePageMetadata(
  locale: string,
  title: string,
  description: string,
  options?: {
    /**
     * The *content* image this page should be previewed by — a real photo
     * path, which `ogImage()` resolves to the page's 1200x630 card. Not the
     * card path itself: taking the source here is what stops a caller from
     * putting a multi-megabyte WebP master in `og:image`, which is what the
     * /space page was doing.
     */
    imageSource?: string;
    canonical?: string;
    noindex?: boolean;
    ogType?: 'website' | 'article';
  }
): Metadata {
  const pageImage = ogImage(options?.imageSource);
  const pageUrl = options?.canonical
    ? new URL(localizedPath(locale, options.canonical), SITE_URL).toString()
    : undefined;

  return {
    title,
    description,
    alternates: pageUrl ? { canonical: pageUrl } : undefined,
    robots: options?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: options?.ogType || 'website',
      locale: OG_LOCALE[locale] ?? OG_LOCALE[routing.defaultLocale],
      title,
      description,
      url: pageUrl,
      siteName: businessInfo.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [pageImage],
      creator: seoDefaults.twitterHandle,
    },
  };
}

/**
 * Generate JSON-LD structured data
 */
export function generateJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return generateJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: businessInfo.name,
    description: businessInfo.description,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [
      'https://facebook.com/thehomepizza',
      'https://instagram.com/thehomepizza',
    ],
    contact: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: businessInfo.phone,
      email: businessInfo.email,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.locations[0]?.address.split(',')[0],
      addressLocality: businessInfo.locations[0]?.address.split(',')[1]?.trim(),
    },
  });
}

/**
 * Generate LocalBusiness schema (Restaurant)
 */
export function generateRestaurantSchema() {
  return generateJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: businessInfo.name,
    description: businessInfo.description,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}${seoDefaults.image}`,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.locations[0]?.address.split(',')[0],
      addressLocality: businessInfo.locations[0]?.address.split(',')[1]?.trim(),
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '17:00',
        closes: '23:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '12:00',
        closes: '23:00',
      },
    ],
    servesCuisine: ['Italian', 'Pizza'],
    priceRange: '$$',
    // No `aggregateRating` here: Google's structured-data guidelines treat a
    // rating with no real review source as fabricated content, which risks a
    // manual action. Add it back only once there's an actual ratings feed
    // (Google Business Profile, a reviews platform, ...) to source it from.
  });
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return generateJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.url}`,
    })),
  });
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return generateJsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}
