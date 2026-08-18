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
      // Per-region copy has not been written yet, so those keys ship as
      // empty arrays. Falling back to the intro keeps the panel from going
      // blank on a region; drop the real text into
      // `menuPage.regionContent.<id>.paragraphs` and it takes over with no
      // code change.
      paragraphs: paragraphs.length > 0 ? paragraphs : introParagraphs,
    };
  });

  return (
    <section className="relative min-h-svh overflow-hidden bg-cream lg:min-h-0">
      {/* Background texture */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-cream" />
        <img
          src={menuHeroContent.backgroundImage}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-50"
        />
      </div>

      <MenuHeroExplorer
        greeting={t('greeting')}
        introParagraphs={introParagraphs}
        introMapImage={menuHeroContent.mapImage}
        mapAlt={t('mapAlt')}
        regions={regions}
      />
    </section>
  );
}
