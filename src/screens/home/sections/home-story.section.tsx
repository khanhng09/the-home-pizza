import { getTranslations } from 'next-intl/server';
import { storyContent } from '../constants/home.constant';
import { HomeStoryTabs } from '../components/home-story-tabs';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage } from '@/shared/lib/image';
import { HomeIllustrationLayer } from '../components/home-illustration-layer';

export async function HomeStorySection() {
  const t = await getTranslations('home.story');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    // Mobile: exactly one screen, split in the design's own 493 : 438
    // proportion between the copy block and the tabs photo — as growth
    // factors rather than pixels, so the section fits whatever the phone's
    // viewport actually is instead of the 932px frame it was drawn on.
    // Desktop is unchanged.
    <section className="relative flex h-svh flex-col overflow-hidden bg-cream lg:block lg:h-auto">
      {/* The design's copy block, measured to where the tabs photo starts:
          1050 -> 1543 on the 430 frame, 934 -> 1335 on the 1400 one. The
          photo below is a fixed aspect on desktop, so pinning this block is
          what makes the section land on the design's 913 there — and keeps
          it from breathing as the copy re-wraps, which was moving the
          illustrations with it. */}
      <div className="relative flex-[493_1_0%] lg:flex-none lg:min-h-[401px]">
        {/* Background texture — swaps per breakpoint */}
        <div
          className="absolute inset-0 bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${optimizedImage(storyContent.backgroundImageMobile)})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${optimizedImage(storyContent.backgroundImage)})` }}
          aria-hidden="true"
        />

        <div className="container-base relative grid grid-cols-1 gap-6 pt-20 pb-16 lg:grid-cols-2 lg:gap-16 lg:pt-32.5 lg:pb-25 z-2">
          {/* The two columns answer each other — heading drifts in from the
              left edge, copy from the right — so the pair reads as one
              gesture opening the section. */}
          <Reveal variant="slide-right">
            <h2 className="max-w-60 font-display sm:max-w-none text-5xl md:text-6xl lg:text-[80px] leading-[120%] md:leading-none text-foreground">
              {t('heading')}
            </h2>
          </Reveal>

          <Reveal variant="slide-left" delayMs={280}>
            <div className="flex flex-col gap-5 pl-24 text-justify font-sans text-sm sm:pl-28 lg:pl-0 sm:text-base md:text-lg lg:text-xl text-foreground">
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
      <Reveal
        variant="zoom-in"
        delayMs={550}
        durationMs={950}
        className="flex-[438_1_0%] lg:flex-none"
      >
        <HomeStoryTabs />
      </Reveal>

      {/* Last, so it sits over the section's own background texture rather
          than under it — the textures are opaque and are painted inside the
          block above. That also matches the design's own layer order, where
          the hến overlaps the right edge of the paragraph column. */}
      <HomeIllustrationLayer section="story" />
    </section>
  );
}
