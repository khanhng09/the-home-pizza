import { getTranslations } from 'next-intl/server';
import { Button } from '@/shared/components/ui/button';
import { optimizedImage, responsiveImage } from '@/shared/lib/image';
import { heroContent, trustBadges } from '../constants/home.constant';
import { BackgroundVideo } from '@/shared/components/ui/background-video';
import { bookingLink } from '@/shared/constants/site.constant';

export async function HomeHeroSection() {
  const t = await getTranslations('home.hero');
  const tBadges = await getTranslations('home.trustBadges');

  return (
    <section className="relative">
      {/* Video background.
          A flex *column*, and the trust-badge bar below is the last item in
          it rather than an `absolute bottom-0` overlay. That is what stops
          the bar cropping the Vietnam map: as an overlay the bar covered
          the bottom ~200px of a map box that was measured against the full
          hero, so the country's southern tip was always cut off. As a flow
          item the bar reserves its own height and the map region above it
          ends exactly where the bar starts, at whatever height its content
          happens to be. The video still runs behind the bar — it is
          `absolute inset-0` on this container — so the bar's backdrop blur
          is unchanged. */}
      {/* `min-h-svh` on mobile rather than the design frame's flat 1050px:
          the frame is 932 tall and the bar-and-all height of a real phone
          is not, so a fixed height either overflowed the screen or left the
          next section peeking in. `svh` is the *small* viewport height —
          the one that holds still while the browser's address bar
          collapses, so the section can't grow mid-scroll. */}
      {/* `min-h-fit` alongside `h-svh`: one screen exactly on a normal
          phone, but allowed to grow rather than crop the headline or the
          award strip on a very short one (360x640 and below). */}
      <div className="relative flex h-svh min-h-fit flex-col overflow-hidden bg-ink lg:h-auto lg:min-h-screen">
        <BackgroundVideo
          sources={heroContent.videoSources}
          poster={heroContent.videoPoster}
          className="absolute inset-0 h-full w-full object-cover object-center md:object-[50%_75%]"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/50" />

        <div className="relative flex flex-1 items-center">
          {/* Vietnam map decoration — a CSS background rather than an
              `<img>` on purpose. It carries no meaning (it was already
              `alt=""`) and it is desktop-only, and a background on a
              `display: none` element is never fetched, whereas an `<img>`
              inside one still is. As an `<img>` every phone downloaded it
              to draw nothing.
              `bg-contain` in a box that is exactly as tall as this region
              means the whole country always fits, whatever the viewport;
              `max-w-[45vw]` stops it crossing into the headline on a tall,
              narrow window. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 hidden aspect-square max-w-[45vw] bg-contain bg-left bg-no-repeat lg:block"
            style={{ backgroundImage: `url(${optimizedImage(heroContent.mapImage)})` }}
          />

          {/* Content — a slow, deliberate reveal sequence (~1.9s end to end)
              rather than a snap-in, so the hero reads as a guided entrance
              into the story instead of everything just appearing at once. */}
          <div className="container-base relative z-10 flex w-full flex-col items-end justify-center gap-3.5 text-right">
            <p className="font-sans text-lg sm:text-2xl md:text-3xl lg:text-4xl text-cream mb-4.5 animate-[hero-drift-left_900ms_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:0ms]">{t('eyebrow')}</p>
            <h1 className="font-display text-5xl sm:text-[54px] md:text-6xl lg:text-[100px] leading-[1.05] text-cream max-w-75 md:max-w-100 lg:max-w-150 uppercase animate-[hero-pop_1000ms_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:250ms]">
              {t('heading')}
            </h1>
            <p className="font-sans text-lg sm:text-2xl md:text-3xl lg:text-4xl text-cream animate-[hero-drift-left_900ms_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:600ms]">{t('subheading')}</p>
            <div className="hidden lg:block animate-[rise-in_800ms_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:900ms] max-w-47 w-full">
              <Button
                asChild
                className="btn-cta mt-3.5 w-full max-w-47 bg-cream text-ink hover:bg-linen"
              >
                <a href={bookingLink} target="_blank" rel="noopener noreferrer">{t('cta')}</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Trust badges bar — badges cascade in one by one after the copy has
            landed, like accolades lighting up in sequence.
            One short row of four on mobile rather than a 2x2 grid with two
            lines of caption under each: at that size the bar was taking
            close to half the screen and pushing the headline off it. The
            captions are dropped below `lg`, not hidden from assistive tech
            — each badge's `alt` still carries the award and the year. */}
        <div className="relative w-full shrink-0 overflow-hidden border-t border-black">
          <div
            className="absolute z-0 inset-0 animate-[fade-in_700ms_ease-out_both] [animation-delay:1050ms]"
            style={{
              background: "radial-gradient(151.92% 127.02% at 15.32% 21.04%, rgba(210, 171, 126, 0.20) 0%, rgba(121, 82, 49, 0.04) 77.08%, rgba(20, 48, 63, 0.00) 100%)",
              backdropFilter: "blur(32px)",
            }}

          ></div>
          <div className="relative container-base grid grid-cols-4 gap-x-2 gap-y-6 py-4 sm:gap-8 lg:py-10 z-1">
            {trustBadges.map((badge, index) => (
              <div
                key={badge.id}
                className="flex flex-col items-center text-center animate-[rise-in_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
                style={{ animationDelay: `${1100 + index * 130}ms` }}
              >
                <img
                  {...responsiveImage(badge.image)}
                  alt={`${tBadges(`${badge.id}.label`)} ${tBadges(`${badge.id}.year`)}`}
                  width={172}
                  height={82}
                  decoding="async"
                  className="aspect-172/82 h-10 w-auto max-w-full shrink-0 sm:h-20.5"
                />
                <p className="hidden text-sm text-cream lg:block">{tBadges(`${badge.id}.label`)}</p>
                <p className="hidden text-sm text-cream lg:block">{tBadges(`${badge.id}.year`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
