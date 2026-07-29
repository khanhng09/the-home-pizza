import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { IcArrowRight } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { menuContent, menuCategoryList } from '../constants/home.constant';
import { IlustDongHoTieu, IlustDongHoTre } from '@/shared/components';

export async function HomeMenuSection() {
  const t = await getTranslations('home.menu');

  return (
    <section className="bg-ink min-h-105 lg:min-h-175 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* Content panel */}
        <div className="relative overflow-hidden px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
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
          <div className='relative'>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream">{t('heading')}</h2>
            <p className="mt-6 max-w-md font-sans text-sm sm:text-base md:text-lg text-cream/80">
              {t('paragraph')}
            </p>
            <Button
              asChild
              className="btn-base btn-md mt-8 bg-cream font-bold uppercase tracking-wide text-ink hover:bg-linen"
            >
              <Link href="/menu">{t('cta')}</Link>
            </Button>
          </div>

          <ul className="relative mt-14 overflow-x-auto flex gap-4 lg:mt-24 lg:flex-col lg:gap-0 lg:overflow-x-visible">
            {menuCategoryList.map((category) => (
              <li key={category.id} className="shrink-0 lg:shrink border-b-2 border-transparent hover:border-cream/50 lg:border-b-0 lg:border-cream/15 lg:hover:border-cream/15">
                <Link
                  href={category.href}
                  className="group flex items-center justify-between font-display text-sm sm:text-base md:text-lg lg:text-2xl uppercase tracking-wide text-cream whitespace-nowrap lg:py-5 px-2 lg:px-0"
                >
                  {t(`categories.${category.id}`)}
                  <IcArrowRight className="hidden h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-cream transition-transform duration-300 group-hover:translate-x-1 lg:inline-block ml-2 lg:ml-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Image panel */}
        <div className="relative">
          <img
            src={menuContent.image}
            alt={t('heading')}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
