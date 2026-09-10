import { getTranslations } from 'next-intl/server';
import { humansPeopleStoryContent } from '../constants/humans.constant';
import { Illustration } from '@/shared/components/illustrations/illustration';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage } from '@/shared/lib/image';

export async function HumansPeopleStorySection() {
  const t = await getTranslations('humansPage.peopleStory');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    <section id="humans-of-the-home" className="section-anchor section-screen relative flex flex-col overflow-hidden bg-linen">
      {/* Same 371 : 561 mobile split as the chef section it mirrors — but no
       * `min-h-0` on this row or the text column below any more. See the
       * chef section for the full explanation: a long paragraph list now
       * keeps its automatic minimum size and grows the section (and the
       * page scrolls) instead of shrinking into an internal scrollbar. */}
      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-2">
        {/* Text column — first on mobile (stacked above the photo), right on
         * desktop. Vertical padding is the comp's, which together with the
         * fixed-height scroll window below puts the section at Figma's
         * 371px (mobile) / 914px (desktop). */}
        {/* Mirror of the chef column: this one sits on the *right* half from
         * `lg`, so it is its right edge that has to meet the container's. */}
        <div className="container-edge-right relative order-1 flex flex-[371_1_0%] flex-col gap-4.5 bg-linen py-[var(--section-py)] pl-4 md:pl-6 lg:order-2 lg:pl-8">
          {/* Figma geometry, 1:1 — mobile from the 430-wide frame, desktop
           * from the 1400-wide one. Gold, like every other illustration on
           * this page: the comp reads them as tone-on-tone watermarks. */}
          <Illustration name="dong-ho-ghe" className="pointer-events-none absolute z-1 -right-[35px] top-[29px] h-[93px] w-[163px] text-gold lg:right-[30px] lg:top-[76px] lg:h-[112px] lg:w-[196px]" />

          <Reveal variant="slide-left">
            <h2 className="relative z-2 max-w-70 font-display text-5xl leading-[1.2] text-foreground sm:max-w-none lg:max-w-124 lg:text-[80px]">
              {t('heading')}
            </h2>
          </Reveal>

          {/* Takes the column's leftover height at every breakpoint, but no
           * longer scrolls its own overflow — see the chef section for why. */}
          <Reveal variant="slide-left" delayMs={200} className="flex-1">
            <div style={{ direction: 'ltr' }} className="flex max-w-[300px] md:max-w-147 flex-col gap-4 pr-6 text-justify font-sans text-sm leading-[1.4] text-foreground lg:pr-8 lg:text-xl">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          {/* Bottom-right of the stacked mobile block, bottom-left of the
           * desktop text column. */}
          <Illustration name="dong-ho-hung-que" className="pointer-events-none absolute right-4 bottom-[19px] h-[77px] w-[91px] text-gold lg:right-auto lg:left-[46px] lg:bottom-[21px] lg:h-[114px] lg:w-[136px]" />
        </div>

        {/* Photo column — second on mobile, left on desktop. No illustration
         * here in either comp; the cá trích belongs to the values section. */}
        <div className="relative order-2 min-h-[280px] flex-[561_1_0%] overflow-hidden lg:order-1 lg:min-h-0">
          <Reveal variant="fade" delayMs={350} durationMs={950} className="h-full">
            <img
              src={optimizedImage(humansPeopleStoryContent.image.src)}
              srcSet={`${optimizedImage(humansPeopleStoryContent.image.mobileSrc)} 860w, ${optimizedImage(humansPeopleStoryContent.image.src)} 1400w`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              alt={t('imageAlt')}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
