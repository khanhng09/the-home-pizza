import { getTranslations } from 'next-intl/server';
import { responsiveImage } from '@/shared/lib/image';
import { menuHeroContent, menuRegionList } from '../constants/menu.constant';
import { MenuHeroExplorer } from '../components/menu-hero-explorer';

export async function MenuHeroSection() {
  const t = await getTranslations('menuPage.hero');
  const tRegions = await getTranslations('menuPage.regions');
  const tRegionContent = await getTranslations('menuPage.regionContent');
  const introParagraphs = t.raw('paragraphs') as string[];
  const backgroundTexture = responsiveImage(menuHeroContent.backgroundImage);

  const regions = menuRegionList.map((region) => {
    const paragraphs = tRegionContent.raw(`${region.id}.paragraphs`) as string[];

    return {
      id: region.id,
      label: tRegions(region.id),
      mapImage: region.mapImage,
      mobileMapImage: region.mobileMapImage,
      // Per-region copy has not been written yet, so those keys ship as
      // empty arrays. Falling back to the intro keeps the panel from going
      // blank on a region; drop the real text into
      // `menuPage.regionContent.<id>.paragraphs` and it takes over with no
      // code change.
      paragraphs: paragraphs.length > 0 ? paragraphs : introParagraphs,
    };
  });

  return (
    <>
      {/* Responsive preload for the two LCP-candidate map images (see
          `MenuHeroExplorer`'s desktop/mobile map sets). Both `<img>`s mount
          at every viewport — one hidden under `hidden lg:block` / `lg:hidden`
          for the crossfade stack — and a `display:none` ancestor does NOT
          stop the browser from fetching a `loading="eager"` image, only
          from painting it. Marking both eager, as a plain single-image LCP
          hero normally would, downloaded both the desktop 2k PNG and the
          mobile-cropped PNG on every load regardless of which one the
          visitor could actually see — roughly 230–240KB thrown away on
          every device, competing for bandwidth/priority with the one image
          that matters for LCP. A `media`-gated `<link rel="preload">` per
          breakpoint is what a `<picture>` `<source media>` does natively for
          a single `<img>`, applied here to two independent ones: only the
          request whose `media` actually matches the viewport fires, at
          `fetchPriority="high"` so it still wins the LCP race. The `<img>`
          tags themselves are plain `loading="lazy"` (see
          `MenuHeroExplorer`) — by the time either mounts, the matching one
          is already in the preload cache and paints immediately, while the
          non-matching one is never requested by anything at all. */}
      <link
        rel="preload"
        as="image"
        href={menuHeroContent.mapImage}
        media="(min-width: 1024px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={menuHeroContent.mobileMapImage}
        media="(max-width: 1023.98px)"
        fetchPriority="high"
      />

      {/* `h-svh overflow-hidden` (a fixed one-viewport-tall hero that clips
          anything past its bottom edge) only kicks in from `lg` up. Below
          that it used to apply unconditionally too — the intent being a
          static, non-scrolling hero screen on mobile as much as desktop —
          but real mobile viewport heights vary far more than any amount of
          padding/font trimming can chase: address bars, home-indicator
          insets, and just plain shorter phones (measured cut off on an
          actual iPhone at heights this shrank to fit on a desk-resized
          browser window never reproduced). `svh` already reports the
          *smallest* the viewport ever gets on a given device, but "smallest
          on this device" still isn't "small enough for every device" — the
          map alone can run past 1000px tall once the row above it (greeting
          + copy + region tabs) is accounted for. Letting the section grow
          to its natural content height below `lg` and scroll with the page
          is what actually guarantees nothing gets clipped, on any device,
          without an upper bound on how tall content is allowed to get. */}
      <section className="section-anchor relative overflow-hidden bg-cream lg:h-screen lg:min-h-fit">
        {/* Background texture — full-bleed across the whole section at every
            breakpoint, no separate flat-color layer of its own. It used to be
            narrowed to just the map's own width from `xl` (to stop it running
            out from behind the map into the text column), which produced a
            visible seam at the map's right edge: textured on one side, flat
            solid color on the other, two different treatments butting up
            against each other instead of one continuous surface. One
            full-bleed texture layer removes that seam outright — same
            treatment everywhere, no boundary to see.

            The section keeps its own `bg-cream` as the true base underneath
            (rather than the section being transparent down to nothing): `body`
            has no background color set (see the commented-out line in
            `globals.css`), so with nothing behind it this fully-opaque texture
            at `opacity-50` blends with plain white instead of cream, and the
            whole hero — map included, not just the text side — comes out a
            dull gray-brown instead of the site's warm cream tone. `bg-cream`
            is what the texture is meant to blend with.

            `srcSet`/`sizes`: this file had never been run through
            `scripts/optimize-images.mjs` (see the `menu hero background`
            group there) — every device was downloading the same 1400×857,
            400KB original, phones included. The `w768` variant alone is
            ~11KB. */}
        <img
          aria-hidden
          src={backgroundTexture.src}
          srcSet={backgroundTexture.srcSet}
          sizes="100vw"
          alt=""
          width={1400}
          height={857}
          loading="eager"
          decoding="async"
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-50"
        />

        <MenuHeroExplorer
          greeting={t('greeting')}
          introParagraphs={introParagraphs}
          introMapImage={menuHeroContent.mapImage}
          introMobileMapImage={menuHeroContent.mobileMapImage}
          mapAlt={t('mapAlt')}
          regions={regions}
        />
      </section>
    </>
  );
}
