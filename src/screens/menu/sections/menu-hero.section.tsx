import { getTranslations } from 'next-intl/server';
import { menuHeroContent, menuRegionList } from '../constants/menu.constant';
import { MenuHeroExplorer } from '../components/menu-hero-explorer';

export async function MenuHeroSection() {
  const t = await getTranslations('menuPage.hero');
  const tRegions = await getTranslations('menuPage.regions');
  const tRegionContent = await getTranslations('menuPage.regionContent');
  const introParagraphs = t.raw('paragraphs') as string[];

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
    <section className="relative h-svh overflow-hidden bg-cream lg:min-h-0">
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
          is what the texture is meant to blend with. */}
      <img
        aria-hidden
        src={menuHeroContent.backgroundImage}
        alt=""
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
  );
}
