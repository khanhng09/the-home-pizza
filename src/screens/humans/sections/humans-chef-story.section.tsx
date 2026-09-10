import { getTranslations } from 'next-intl/server';
import { humansChefStoryContent } from '../constants/humans.constant';
import { Illustration } from '@/shared/components/illustrations/illustration';
import { Reveal } from '@/shared/components/ui/reveal';
import { DARK_PAPER_TILE, DARK_PAPER_TILE_SIZE } from '@/shared/constants/texture.constant';
import { optimizedImage } from '@/shared/lib/image';

export async function HumansChefStorySection() {
  const t = await getTranslations('humansPage.chefStory');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    // The hero's "Humans of The Home" row lands here. `scroll-mt` is the
    // fixed header's height, so the jump stops with the heading below the
    // bar rather than under it.
    <section
      className="section-anchor section-screen relative flex flex-col overflow-hidden bg-deep"
    >
      {/* Background texture — the same tile at every breakpoint, see
          `DARK_PAPER_TILE`. */}
      <div
        className="absolute inset-0 bg-repeat"
        style={{ backgroundImage: `url(${DARK_PAPER_TILE})`, backgroundSize: DARK_PAPER_TILE_SIZE }}
        aria-hidden="true"
      />

      {/* Mobile splits the screen in the comp's own 371 : 561 proportion —
       * copy above, the gold photo band below — as growth factors, so the
       * pair fits one screen *when the copy is short enough to*. Neither
       * this row nor the text column below gets `min-h-0` any more: that
       * used to force the copy into its own internal scroll window so the
       * row could never exceed the section's fixed height. A long paragraph
       * list now keeps its automatic minimum size (its content's min-content
       * height) instead, so it pushes the row — and with it `.section-screen`'s
       * `min-height: fit-content` on the section — taller than one screen
       * rather than hiding text behind a scrollbar. The photo band gets a
       * `min-h` floor instead so it never gets squeezed to nothing when that
       * happens. */}
      <div className="relative flex flex-1 flex-col lg:grid lg:grid-cols-2">
        {/* Text column — vertical padding is the comp's, which together with
         * the fixed-height scroll window below puts the section at Figma's
         * 371px (mobile) / 914px (desktop). */}
        {/* `container-edge-left` rather than a flat `px`: this column
         * starts at the viewport edge, so a fixed inset left its copy
         * inboard of every `container-base` section on the page. */}
        <div className="container-edge-left relative flex flex-[371_1_0%] flex-col gap-4.5 py-[var(--section-py)] pr-4 md:pr-6 lg:pr-8">
          {/* Figma geometry, 1:1 — mobile from the 430-wide frame, desktop
           * from the 1400-wide one. On desktop this straddles the column
           * divider, so it is anchored to the text column's right edge. */}
          <Illustration name="dong-ho-pizza-dough" className="pointer-events-none absolute -right-12 top-8 h-[106px] w-[167px] text-gold lg:-right-[43px] lg:top-[126px] lg:h-[132px] lg:w-[208px]" />

          <Reveal variant="slide-right">
            <h2 className="max-w-70 font-display text-5xl leading-[1.2] text-cream sm:max-w-none lg:max-w-124 lg:text-[80px]">
              {t('heading')}
            </h2>
          </Reveal>

          {/* No more fixed-height scroll window: the paragraph list now
           * takes whatever height its text actually needs, growing the
           * section past one screen (and the page scrolls) rather than
           * hiding copy behind an internal scrollbar. */}
          <Reveal variant="slide-right" delayMs={200}>
            <div style={{ direction: 'ltr' }} className="flex max-w-[300px] md:max-w-147 flex-col gap-4 pr-6 text-justify font-sans text-sm leading-[1.4] text-cream lg:pr-8 lg:text-xl">
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
        <div className="relative flex min-h-[280px] flex-[561_1_0%] items-center justify-center overflow-hidden bg-gold px-8 py-[var(--section-py)] lg:min-h-0">
          {/* Mobile-only: the comp repeats the sầu riêng tone-on-tone at the
           * top of the gold band. Desktop has no counterpart. */}
          <Illustration name="dong-ho-sau-rieng" className="pointer-events-none absolute left-[35px] top-[7px] h-[58px] w-[75px] text-gold lg:hidden" />

          {/* The comp's 290/471 box lives on the wrapper, not the image. As
           * a shrink-to-fit flex item the wrapper would otherwise size to
           * the image's intrinsic width — which is the chosen `srcset`
           * candidate divided by `sizes`, so the layout would shift with
           * whichever variant the browser happened to pick. */}
          <Reveal variant="fade" delayMs={350} durationMs={950} className="h-full w-full max-w-[290px] lg:max-w-[471px]">
            <img
              src={optimizedImage(humansChefStoryContent.image.src)}
              srcSet={`${optimizedImage(humansChefStoryContent.image.mobileSrc)} 580w, ${optimizedImage(humansChefStoryContent.image.src)} 942w`}
              sizes="(max-width: 1024px) 290px, 471px"
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
