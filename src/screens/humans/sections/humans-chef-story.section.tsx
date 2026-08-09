import { getTranslations } from 'next-intl/server';
import { humansChefStoryContent } from '../constants/humans.constant';
import { Illustration } from '@/shared/components/illustrations/illustration';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage } from '@/shared/lib/image';

export async function HumansChefStorySection() {
  const t = await getTranslations('humansPage.chefStory');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    <section className="relative overflow-hidden bg-deep">
      {/* Background texture — swaps per breakpoint */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:hidden"
        style={{ backgroundImage: `url(${optimizedImage(humansChefStoryContent.backgroundImageMobile)})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${optimizedImage(humansChefStoryContent.backgroundImage)})` }}
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-2">
        {/* Text column — vertical padding is the comp's, which together with
         * the fixed-height scroll window below puts the section at Figma's
         * 371px (mobile) / 914px (desktop). */}
        <div className="relative flex flex-col gap-4.5 px-4 pt-[41px] pb-[31px] md:px-6 lg:px-8 lg:pt-[122px] lg:pb-[100px]">
          {/* Figma geometry, 1:1 — mobile from the 430-wide frame, desktop
           * from the 1400-wide one. On desktop this straddles the column
           * divider, so it is anchored to the text column's right edge. */}
          <Illustration name="dong-ho-pizza-dough" className="pointer-events-none absolute -right-12 top-8 h-[106px] w-[167px] text-gold lg:-right-[43px] lg:top-[126px] lg:h-[132px] lg:w-[208px]" />

          <Reveal variant="slide-right">
            <h2 className="max-w-70 font-display text-5xl leading-[1.2] text-cream sm:max-w-none lg:max-w-124 lg:text-[80px]">
              {t('heading')}
            </h2>
          </Reveal>

          <Reveal variant="slide-right" delayMs={200}>
            {/* Fixed-height scroll window, not a max — the comp sizes it at
             * 165/482px and styles a permanent scrollbar track beside it. */}
            <div style={{ direction: 'ltr' }} className="scrollbar-story-gold flex h-[165px] max-w-147 flex-col gap-4 overflow-y-scroll pr-6 font-sans text-sm leading-[1.4] text-cream lg:h-[482px] lg:pr-8 lg:text-xl">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          {/* Bottom-right of the stacked mobile block, bottom-left of the
           * desktop text column — and hanging 31px past the section edge
           * there, as in the comp. */}
          <Illustration name="dong-ho-sau-rieng" className="pointer-events-none absolute right-[22px] bottom-[41px] h-[62px] w-[81px] text-gold lg:right-auto lg:left-[92px] lg:-bottom-[31px] lg:h-[121px] lg:w-[156px]" />
        </div>

        {/* Photo column */}
        <div className="relative flex items-center justify-center bg-gold px-8 py-[75px] lg:py-16">
          {/* Mobile-only: the comp repeats the sầu riêng tone-on-tone at the
           * top of the gold band. Desktop has no counterpart. */}
          <Illustration name="dong-ho-sau-rieng" className="pointer-events-none absolute left-[35px] top-[7px] h-[58px] w-[75px] text-gold lg:hidden" />

          {/* The comp's 290/471 box lives on the wrapper, not the image. As
           * a shrink-to-fit flex item the wrapper would otherwise size to
           * the image's intrinsic width — which is the chosen `srcset`
           * candidate divided by `sizes`, so the layout would shift with
           * whichever variant the browser happened to pick. */}
          <Reveal variant="zoom-in" delayMs={350} durationMs={950} className="w-full max-w-[290px] lg:max-w-[471px]">
            <img
              src={optimizedImage(humansChefStoryContent.image.src)}
              srcSet={`${optimizedImage(humansChefStoryContent.image.mobileSrc)} 580w, ${optimizedImage(humansChefStoryContent.image.src)} 942w`}
              sizes="(max-width: 1024px) 290px, 471px"
              alt={t('imageAlt')}
              loading="lazy"
              decoding="async"
              className="aspect-[290/411] w-full object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
