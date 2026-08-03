import { getTranslations } from 'next-intl/server';
import { storyContent } from '../constants/home.constant';
import { HomeStoryTabs } from '../components/home-story-tabs';
import { IlustDongHoHen } from '@/shared/components/illustrations/illus-dong-ho-hen';
import { IlustDongHoTom } from '@/shared/components/illustrations/illus-dong-ho-tom';
import { Reveal } from '@/shared/components/ui/reveal';

export async function HomeStorySection() {
  const t = await getTranslations('home.story');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="relative">
        {/* Background texture — swaps per breakpoint */}
        <div
          className="absolute inset-0 bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${storyContent.backgroundImageMobile})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${storyContent.backgroundImage})` }}
          aria-hidden="true"
        />

        <IlustDongHoTom className="pointer-events-none absolute left-4 top-28 h-14 w-14 text-gold lg:bottom-8 lg:left-8 lg:top-auto lg:h-32 lg:w-32" />
        <IlustDongHoHen className="pointer-events-none absolute right-6 top-64 h-20 w-24 text-gold lg:-right-4 lg:top-4 lg:h-24 lg:w-28" />

        <div className="container-base relative grid grid-cols-1 gap-6 pt-20 pb-16 lg:grid-cols-2 lg:gap-16 lg:pt-32.5 lg:pb-25">
          {/* The two columns answer each other — heading drifts in from the
              left edge, copy from the right — so the pair reads as one
              gesture opening the section. */}
          <Reveal variant="slide-right">
            <h2 className="max-w-60 font-display sm:max-w-none text-5xl md:text-6xl lg:text-7xl xl:text-[80px] leading-[120%] md:leading-none text-foreground">
              {t('heading')}
            </h2>
          </Reveal>

          <Reveal variant="slide-left" delayMs={280}>
            <div className="flex flex-col gap-5 pl-24 font-sans text-sm sm:pl-28 lg:pl-0 sm:text-base md:text-lg lg:text-xl text-foreground">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
      {/* Arrives last, once the heading and paragraph have landed, so the
          tabs + photo read as the payoff of the story rather than a
          simultaneous element. Pushes forward rather than sliding, to
          settle the converging columns above it. */}
      <Reveal variant="zoom-in" delayMs={550} durationMs={950}>
        <HomeStoryTabs />
      </Reveal>
    </section>
  );
}
