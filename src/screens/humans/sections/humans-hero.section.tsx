import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { IcArrowRight } from '@/shared/components/icons';
import { BackgroundVideo } from '@/shared/components/ui/background-video';
import { humansHeroContent, humansHeroLinkList } from '../constants/humans.constant';

/** Shared by both row shapes below, so an in-page jump and a link to
 * another screen are indistinguishable to look at. */
const HERO_LINK_CLASS =
  'group flex min-h-11 cursor-pointer items-center justify-between gap-4 py-1 font-sans text-[20px] whitespace-nowrap uppercase tracking-wide text-cream sm:min-h-12 lg:py-2.5 lg:text-[30px]';

export async function HumansHeroSection() {
  const t = await getTranslations('humansPage.hero');

  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Video background */}
      {/* `lg:min-h-[934px]` was the comp's own frame height and ran 260px
          past a 720p laptop. A video hero has no content that needs the
          extra room — it just wants the screen — so it goes to `svh` at
          every breakpoint like the home hero. */}
      <div className="relative flex h-svh min-h-fit items-end md:items-center">
        <BackgroundVideo
          sources={humansHeroContent.videoSources}
          poster={humansHeroContent.videoPoster}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/60" />

        {/* Content — same slow, staggered entrance as the home hero: the
            heading pops in first, then each link cascades in behind it. */}
        <div className="container-base relative pb-6 lg:pb-10">
          <h1 className="max-w-91 font-display text-5xl leading-[1.2] text-cream lg:max-w-147 lg:text-[100px] animate-[hero-pop_1000ms_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:250ms]">
            {t('heading')}
          </h1>

          <ul className="mt-5 flex flex-col lg:mt-7">
            {humansHeroLinkList.map((link, index) => {
              const label = (
                <>
                  {t(`linkList.${link.id}`)}
                  <IcArrowRight className="h-4 w-4 shrink-0 text-cream transition-transform duration-300 group-hover:translate-x-1 lg:h-8 lg:w-8" />
                </>
              );

              return (
                <li
                  key={link.id}
                  className="max-w-80 border-b border-cream/90 lg:max-w-120 animate-[rise-in_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: `${650 + index * 130}ms` }}
                >
                  {/* A same-page jump stays a plain `<a>`: routing it
                      through `next/link` would prefetch this very page and
                      push a history entry for a scroll. */}
                  {link.kind === 'anchor' ? (
                    <a href={link.href} className={HERO_LINK_CLASS}>
                      {label}
                    </a>
                  ) : (
                    <Link href={link.href} className={HERO_LINK_CLASS}>
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
