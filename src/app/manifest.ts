import type { MetadataRoute } from 'next';
import { businessInfo, SITE_NAME } from '@/shared/constants/site.constant';

/** `theme_color`/`background_color` are the site's `--palette-cream` /
 * `--palette-ink` tokens (see `globals.css`) — keep both in sync if the
 * palette changes. There's no square brand mark in the repo yet (the SVG
 * logo is a wide wordmark, `171x14`), so `icons` only lists the existing
 * favicon; add real 192x192/512x512 PNGs here once one exists, for full
 * PWA-installability audits. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: businessInfo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#EFE9DE',
    theme_color: '#162F3E',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
