import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Reveal } from '@/shared/components/ui/reveal';
import { menuCategoryList } from '../constants/home.constant';
import { HomeMenuShowcase } from '../components/home-menu-showcase';
import { HomeIllustrationLayer } from '../components/home-illustration-layer';

export async function HomeMenuSection() {
  const t = await getTranslations('home.menu');

  const categories = menuCategoryList.map((category) => {
    const label = t(`categories.${category.id}`);

    return {
      ...category,
      label,
      alt: t('imageAlt', { category: label }),
    };
  });

  return (
    // One screen, minus the header. The height used to be content-driven,
    // which meant the menu page's own portrait aspect set it — 905px at
    // 1280 wide, 231 past a 720p laptop. Now the band comes first and the
    // panel derives its *width* from it instead (see `HomeMenuShowcase`),
    // so the whole menu page stays visible without the section outgrowing
    // the screen.
    <section className="section-anchor section-screen relative flex flex-col overflow-hidden bg-ink">
      <HomeMenuShowcase categories={categories}>
        <div className="relative z-2">
          <Reveal variant="slide-right" >
            <h2 className="font-display text-5xl md:text-6xl lg:text-[80px] text-cream">
              {t('heading')}
            </h2>
          </Reveal>
          <Reveal variant="slide-right" delayMs={200}>
            <p className="mt-4 max-w-[294px] md:max-w-[302px] text-justify font-sans text-sm sm:text-base md:text-lg text-cream">
              {t('paragraph')}
            </p>
          </Reveal>
          <Reveal variant="slide-right" delayMs={400}>
            <Button
              asChild
              className="btn-cta mt-6 w-full max-w-59.5 bg-cream text-ink hover:bg-linen"
            >
              <Link href="/menu">{t('cta')}</Link>
            </Button>
          </Reveal>
        </div>
      </HomeMenuShowcase>

      {/* Outside the showcase so the section — not its left content panel —
          is what these offsets are measured against, which is how the
          design draws them. */}
      <HomeIllustrationLayer section="menu" />
    </section>
  );
}
