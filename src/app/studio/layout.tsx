import type { Metadata } from 'next';

/**
 * `/studio` sits outside `[locale]`, which is the only other root layout
 * this app has — so per Next's "multiple root layouts" convention this
 * file has to define its own `<html>`/`<body>`. Deliberately minimal and
 * doesn't import `globals.css`: Sanity Studio ships its own styling
 * (styled-components + @sanity/ui), and pulling in the marketing site's
 * Tailwind reset would fight it.
 */
export const metadata: Metadata = {
  title: 'Studio — The Home Pizza',
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
