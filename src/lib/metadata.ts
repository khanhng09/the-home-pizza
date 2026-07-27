import type { Metadata } from 'next';
import { businessInfo, seoDefaults, SITE_URL } from './constants';

/**
 * Generate root metadata for the site
 */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: seoDefaults.title,
    template: `%s | ${businessInfo.name}`,
  },
  description: seoDefaults.description,
  keywords: seoDefaults.keywords,
  creator: businessInfo.name,
  publisher: businessInfo.name,
  applicationName: businessInfo.name,
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: businessInfo.name,
    title: seoDefaults.title,
    description: seoDefaults.description,
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
    title: seoDefaults.title,
    description: seoDefaults.description,
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

/**
 * Generate metadata for a specific page
 */
export function generatePageMetadata(
  title: string,
  description: string,
  options?: {
    image?: string;
    canonical?: string;
    noindex?: boolean;
    ogType?: 'website' | 'article' | 'product';
  }
): Metadata {
  const pageImage = options?.image || seoDefaults.image;
  const pageUrl = options?.canonical ? new URL(options.canonical, SITE_URL).toString() : undefined;

  return {
    title,
    description,
    canonical: pageUrl,
    robots: options?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: options?.ogType || 'website',
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
export function generateJsonLd(data: Record<string, any>): string {
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
      streetAddress: businessInfo.address.split(',')[0],
      addressLocality: businessInfo.address.split(',')[1]?.trim(),
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
      streetAddress: businessInfo.address.split(',')[0],
      addressLocality: businessInfo.address.split(',')[1]?.trim(),
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '247',
    },
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
