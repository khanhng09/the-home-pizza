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
    // Height is content-driven, not forced to the design's own 914px frame
    // (1847 -> 2761 on the 1400 frame): `HomeMenuShowcase`'s image column
    // now sets its own height from the artwork's aspect ratio (see
    // `HomeMenuPanel`'s doc comment), and the copy column grows to match
    // instead of being clipped into an internal scrollbar by a fixed
    // budget. The illustration offsets below are percentages of this
    // section's box, so they stay in the same relative spot either way —
    // they just no longer land on the design's exact pixels when the
    // content's own height differs from the design frame's.
    <section className="relative flex flex-col bg-ink">
      <HomeMenuShowcase categories={categories}>
        <Reveal variant="slide-right" className="relative z-2">
          <h2 className="font-display text-5xl md:text-6xl lg:text-[80px] text-cream">
            {t('heading')}
          </h2>
          <p className="mt-6 max-w-[294px] md:max-w-[302px] text-justify font-sans text-sm sm:text-base md:text-lg text-cream">
            {t('paragraph')}
          </p>
          <Button
            asChild
            className="btn-cta mt-8 w-full max-w-59.5 bg-cream text-ink hover:bg-linen"
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
