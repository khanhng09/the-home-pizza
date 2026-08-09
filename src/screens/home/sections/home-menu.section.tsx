import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage } from '@/shared/lib/image';
import { menuContent, menuCategoryList } from '../constants/home.constant';
import { HomeMenuShowcase } from '../components/home-menu-showcase';
import { HomeIllustrationLayer } from '../components/home-illustration-layer';

export async function HomeMenuSection() {
  const t = await getTranslations('home.menu');

  const categories = menuCategoryList.map((category) => {
    const label = t(`categories.${category.id}`);

    return {
      ...category,
      label,
      linkLabel: t('viewCategory', { category: label }),
      alt: t('imageAlt', { category: label }),
    };
  });

  return (
    // `min-h` at `lg` is the design's own section height (1847 -> 2761 on
    // the 1400 frame). Left to content the section came out 856px, which
    // both fell short of the design and threw off every illustration offset
    // below, since those are a share of this box.
    //
    // `flex flex-col` (paired with `flex-1` on the showcase grid) is what
    // hands that extra height *down*. A percentage `h-full` can't: the
    // section's own computed height is `auto` — `min-height` doesn't feed
    // percentage resolution — so the grid fell back to its content height
    // and left the last 86px of the section as a bare ink band under the
    // image panel and the background texture.
    <section className="relative flex flex-col bg-ink min-h-105 lg:min-h-[914px]">
      <HomeMenuShowcase categories={categories}>
        {/* Background texture — swaps per breakpoint. The clipping lives on
            this wrapper rather than on the panel: the mobile layer carries
            its own aspect ratio and so runs taller than the panel, but
            `overflow-hidden` on the panel itself would stop the panel from
            growing with its copy on narrow viewports. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 aspect-[430/500] lg:aspect-auto bg-cover bg-center lg:hidden"
            style={{ backgroundImage: `url(${optimizedImage(menuContent.backgroundImageMobile)})` }}
          />
          <div
            className="absolute inset-0 hidden bg-cover bg-center lg:block"
            style={{ backgroundImage: `url(${optimizedImage(menuContent.backgroundImage)})` }}
          />
        </div>

        <Reveal variant="slide-right" className="relative z-2">
          <h2 className="font-display text-5xl md:text-6xl lg:text-[80px] text-cream">
            {t('heading')}
          </h2>
          <p className="mt-6 max-w-[294px] md:max-w-[302px] font-sans text-sm sm:text-base md:text-lg text-cream">
            {t('paragraph')}
          </p>
          <Button
            asChild
            className="btn-base h-8 max-w-59.5 w-full mt-8 bg-cream font-bold uppercase tracking-wide text-ink hover:bg-linen"
          >
            <Link href="/menu">{t('cta')}</Link>
          </Button>
        </Reveal>
      </HomeMenuShowcase>

      {/* Outside the showcase so the section — not its left content panel —
          is what these offsets are measured against, which is how the
          design draws them. */}
      <HomeIllustrationLayer section="menu" />
    </section>
  );
}
