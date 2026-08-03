import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Reveal } from '@/shared/components/ui/reveal';
import { menuContent, menuCategoryList } from '../constants/home.constant';
import { IlustDongHoTieu } from '@/shared/components/illustrations/illus-dong-ho-tieu';
import { IlustDongHoTre } from '@/shared/components/illustrations/illus-dong-ho-tre';
import { HomeMenuShowcase } from '../components/home-menu-showcase';

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
    <section className="bg-ink min-h-105 lg:min-h-175 h-full">
      <HomeMenuShowcase
        categories={categories}
        imageWidth={menuContent.imageWidth}
        imageHeight={menuContent.imageHeight}
      >
        {/* Background texture — swaps per breakpoint */}
        <div
          className="absolute inset-0 aspect-[430/500] lg:aspect-auto bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${menuContent.backgroundImageMobile})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${menuContent.backgroundImage})` }}
          aria-hidden="true"
        />

        <IlustDongHoTre className="pointer-events-none absolute right-8 top-8 h-20 w-20 text-accent/70 lg:right-16 lg:top-16 lg:h-32 lg:w-32" />
        <IlustDongHoTieu className="pointer-events-none absolute left-8 top-[42%] hidden h-16 w-20 text-accent/60 lg:left-16 lg:block lg:h-20 lg:w-28" />

        <Reveal variant="slide-right" className="relative">
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
    </section>
  );
}
