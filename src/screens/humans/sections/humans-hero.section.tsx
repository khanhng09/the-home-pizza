import { getTranslations } from 'next-intl/server';
import { IcArrowRight } from '@/shared/components/icons';
import { BackgroundVideo } from '@/shared/components/ui/background-video';
import { humansHeroContent, humansHeroLinkList } from '../constants/humans.constant';

export async function HumansHeroSection() {
  const t = await getTranslations('humansPage.hero');

  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Video background */}
      <div className="relative min-h-[600px] lg:min-h-[934px]">
        <BackgroundVideo
          sources={humansHeroContent.videoSources}
          poster={humansHeroContent.videoPoster}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/60" />

        {/* Content — same slow, staggered entrance as the home hero: the
            heading pops in first, then each link cascades in behind it. */}
        <div className="container-base relative pt-28 lg:pt-[338px]">
          <h1 className="max-w-91 font-display text-5xl leading-[1.2] text-cream lg:max-w-147 lg:text-[100px] animate-[hero-pop_1000ms_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:250ms]">
            {t('heading')}
          </h1>

          <ul className="mt-11 flex flex-col lg:mt-16">
            {humansHeroLinkList.map((link, index) => (
              <li
                key={link.id}
                className="max-w-73 border-b border-cream/90 lg:max-w-104 animate-[rise-in_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
                style={{ animationDelay: `${650 + index * 130}ms` }}
              >
                <a
                  href={link.href}
                  className="group flex min-h-11 cursor-pointer items-center justify-between gap-4 py-2 font-sans text-lg uppercase tracking-wide text-cream sm:min-h-12 lg:py-4 lg:text-[27.51px]"
                >
                  {t(`linkList.${link.id}`)}
                  <IcArrowRight className="h-4 w-4 shrink-0 text-cream transition-transform duration-300 group-hover:translate-x-1 lg:h-8 lg:w-8" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
