import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { heroContent, trustBadges } from '../constants/home.constant';

export async function HomeHeroSection() {
  const t = await getTranslations('home.hero');
  const tBadges = await getTranslations('home.trustBadges');

  return (
    <section className="relative">
      {/* Video background */}
      <div className="relative flex items-center min-h-262.5 lg:min-h-screen overflow-hidden bg-ink">
        <video
          className="absolute inset-0 h-full w-full object-cover object-center md:object-[50%_75%]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={heroContent.videoSrc} type="video/mp4" />
        </video>

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/50" />

        {/* Vietnam map decoration */}
        <div className="pointer-events-none absolute left-0 top-0 h-full max-h-[90vh] aspect-square hidden lg:block">
          <img
            src={heroContent.mapImage}
            alt=""
            className="h-full w-full"
          />
        </div>

        {/* Content — a slow, deliberate reveal sequence (~1.9s end to end)
            rather than a snap-in, so the hero reads as a guided entrance
            into the story instead of everything just appearing at once. */}
        <div className="container-base relative z-10 flex h-full flex-col items-end justify-center gap-3.5 text-right pb-24 md:pb-6">
          <p className="font-sans text-lg sm:text-2xl md:text-3xl lg:text-4xl text-cream mb-4.5 animate-[hero-drift-left_900ms_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:0ms]">{t('eyebrow')}</p>
          <h1 className="font-display text-5xl sm:text-[54px] md:text-6xl lg:text-[100px] leading-[1.05] text-cream max-w-75 md:max-w-100 lg:max-w-150 uppercase animate-[hero-pop_1000ms_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:250ms]">
            {t('heading')}
          </h1>
          <p className="font-sans text-lg sm:text-2xl md:text-3xl lg:text-4xl text-cream animate-[hero-drift-left_900ms_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:600ms]">{t('subheading')}</p>
          <div className="hidden lg:block animate-[rise-in_800ms_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:900ms] max-w-47 w-full">
            <Button
              asChild
              className="btn-base h-8 px-6 py-3 max-w-47 w-full font-bold text-[15px] mt-3.5 bg-cream text-ink hover:bg-linen uppercase"
            >
              <Link href="#reservation">{t('cta')}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Trust badges bar — badges cascade in one by one after the copy has
          landed, like accolades lighting up in sequence. */}
      <div className="absolute bottom-0 overflow-hidden w-full border-t border-black">
        <div
          className="absolute z-0 inset-0 animate-[fade-in_700ms_ease-out_both] [animation-delay:1050ms]"
          style={{
            background: "radial-gradient(151.92% 127.02% at 15.32% 21.04%, rgba(210, 171, 126, 0.20) 0%, rgba(121, 82, 49, 0.04) 77.08%, rgba(20, 48, 63, 0.00) 100%)",
            backdropFilter: "blur(32px)",
          }}

        ></div>
        <div className="relative container-base grid grid-cols-2 gap-y-6 gap-x-2 sm:gap-8 py-10 lg:grid-cols-4 z-1">
          {trustBadges.map((badge, index) => (
            <div
              key={badge.id}
              className="flex flex-col items-center text-center animate-[rise-in_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
              style={{ animationDelay: `${1100 + index * 130}ms` }}
            >
              <img
                src={badge.image}
                alt={`${tBadges(`${badge.id}.label`)} ${tBadges(`${badge.id}.year`)}`}
                width={172}
                height={82}
                className="h-auto w-full sm:h-20.5 sm:w-auto aspect-172/82 shrink-0"
              />
              <p className="text-sm text-cream">{tBadges(`${badge.id}.label`)}</p>
              <p className="text-sm text-cream">{tBadges(`${badge.id}.year`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
