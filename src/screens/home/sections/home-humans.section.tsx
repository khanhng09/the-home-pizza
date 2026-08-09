import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { IcArrowRight } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage, responsiveImage } from '@/shared/lib/image';
import { humansContent, humansLinkList } from '../constants/home.constant';
import { HomeIllustrationLayer } from '../components/home-illustration-layer';

export async function HomeHumansSection() {
  const t = await getTranslations('home.humans');

  return (
    // `min-h` at `lg` is the design's own section height (2761 -> 3771 on
    // the 1400 frame); content alone gave 901px. The design leaves the same
    // ~110px band empty below the link list, so the extra height lands where
    // it is drawn rather than stretching anything.
    <section className="relative overflow-hidden bg-cream lg:min-h-[1010px]">
      {/* Background texture — swaps per breakpoint */}
      <div
        className="absolute inset-0 aspect-[430/600] lg:aspect-auto bg-cover bg-center lg:hidden"
        style={{ backgroundImage: `url(${optimizedImage(humansContent.backgroundImageMobile)})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${optimizedImage(humansContent.backgroundImage)})` }}
        aria-hidden="true"
      />

      {/* The design's own padding on the 430 frame: 27px above the heading,
          40px below the last link row. `py-16` was costing 61px more than
          that, which is most of why the mobile section ran 87px past the
          design's 602. */}
      <div className="container-base relative pt-7 pb-10 lg:py-24 z-2">
        {/* One grid drives both breakpoints.
            Mobile stacks into 2 equal columns: heading | CTA, then the two
            photos, then the link list across the full width.
            Desktop adds a narrow left gutter that the heading and its
            illustrations live in, so the photos begin *beside* the
            heading rather than under it — the heading's second line sits
            level with the top of the portrait. */}
        <div className="relative grid grid-cols-2 items-start gap-x-4 gap-y-6 lg:grid-cols-[180px_1fr_1fr] lg:gap-x-5 lg:gap-y-8 xl:grid-cols-[200px_1fr_1fr]">
          {/* Left gutter — the heading. Spans both rows so a long heading
              can never push the photo row down.
              `row-end-3` rather than `row-span-2`: the `grid-row` shorthand
              Tailwind emits for the span resets the start back to auto. */}
          <div className="relative lg:col-start-1 lg:row-start-1 lg:row-end-3 lg:self-stretch">
            <Reveal variant="slide-right">
              <h2 className="font-display text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-[1.05] text-foreground">
                {t('heading')}
              </h2>
            </Reveal>
          </div>

          {/* CTA — bottom of the heading block on mobile, top-right corner
              of the section on desktop. */}
          <Reveal
            variant="slide-left"
            delayMs={200}
            className="w-full max-w-[190px] self-end justify-self-end lg:col-start-3 lg:row-start-1 lg:w-auto lg:self-start"
          >
            <Button
              asChild
              variant="outline"
              className="w-full rounded-[3px] border border-umber bg-transparent px-6 font-sans text-lg font-bold uppercase tracking-widest text-umber transition-colors hover:bg-umber hover:text-cream h-7.5 lg:w-auto lg:px-8"
            >
              <Link href="/humans">{t('cta')}</Link>
            </Button>
          </Reveal>

          {/* Portrait — the tall one; it sets the height of the photo row,
              which is what the link list bottom-aligns against. Also the
              anchor for the crab/buffalo on mobile, where there's no
              stretched heading gutter for them to sit in. */}
          <Reveal
            variant="zoom-in"
            delayMs={300}
            durationMs={950}
            className="relative lg:col-start-2 lg:row-start-2"
          >
            <div className="overflow-hidden">
              <img
                {...responsiveImage(humansContent.images[0].src)}
                alt={t(`images.${humansContent.images[0].id}`)}
                width={1057}
                height={1400}
                sizes="(max-width: 1023px) 50vw, 40vw"
                loading="lazy"
                decoding="async"
                className="w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
              />
            </div>
          </Reveal>

          {/* Right column. `contents` on mobile dissolves this wrapper so
              the landscape photo and the link list place themselves as
              ordinary grid items; from `lg` it becomes a real column that
              stretches to the portrait's height, and `justify-between`
              drops the list onto the portrait's bottom edge — the empty
              band left in the middle is where the peppercorns sit. */}
          <div className="contents lg:col-start-3 lg:row-start-2 lg:flex lg:flex-col lg:justify-between lg:self-stretch">
            {/* `self-start` keeps the photo at its natural height in the
                mobile grid row; from `lg` the wrapper is a flex *column*,
                where align-self is the horizontal axis instead — leaving
                it on would shrink-wrap a `w-full` image to nothing. */}
            <Reveal
              variant="zoom-in"
              delayMs={400}
              durationMs={950}
              className="relative self-start lg:self-auto"
            >
              <div className="overflow-hidden">
                <img
                  {...responsiveImage(humansContent.images[1].src)}
                  alt={t(`images.${humansContent.images[1].id}`)}
                  width={1056}
                  height={703}
                  sizes="(max-width: 1023px) 50vw, 40vw"
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                />
              </div>
            </Reveal>

            {/* `z-10` so the peppercorns behind this column can't cover the
                rows' trailing arrows — the illustration layer is painted
                after this subtree, and the design has the tiêu node sitting
                below these rows. */}
            <Reveal
              variant="slide-left"
              delayMs={550}
              className="relative z-10 col-span-2 lg:col-span-1"
            >
              <ul>
                {humansLinkList.map((link) => (
                  <li key={link.id} className="border-b border-foreground">
                    <Link
                      href={link.href}
                      // The design draws these rows 27px tall on mobile,
                      // which is well under the project's 44px tap-target
                      // floor. `min-h-11` holds the floor and the vertical
                      // padding comes off instead, so the row is exactly 44
                      // rather than 52 — as close to the design as the
                      // accessibility rule allows.
                      className="group flex min-h-11 cursor-pointer items-center justify-between gap-2 font-sans text-lg uppercase tracking-wide text-foreground lg:py-5 lg:text-[28px]"
                    >
                      {t(`linkList.${link.id}`)}
                      <IcArrowRight className="h-6 w-6 shrink-0 text-foreground transition-transform duration-300 group-hover:translate-x-1 lg:h-8 lg:w-8" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Section-level, not grid-level: the design measures these from the
          section edge, and the grid sits inside `container-base` padding. */}
      <HomeIllustrationLayer section="human" />
    </section>
  );
}
