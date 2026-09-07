import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage, responsiveImage } from '@/shared/lib/image';
import { humansContent, humansLinkList } from '../constants/home.constant';
import { HomeIllustrationLayer } from '../components/home-illustration-layer';
import { HomeHumansLinkList } from '../components/home-humans-link-list';

export async function HomeHumansSection() {
  const t = await getTranslations('home.humans');
  const labels = Object.fromEntries(
    humansLinkList.map((link) => [link.id, t(`linkList.${link.id}`)]),
  );

  return (
    // One screen, minus the header. The old `lg:min-h-[1010px]` was the
    // comp's own frame height and the single worst overflow on the site —
    // 336px past a 720p laptop. The comp's empty band below the link list
    // is now whatever the screen has spare rather than a fixed 110px.
    <section className="section-anchor section-screen relative flex flex-col justify-center overflow-hidden bg-cream">
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
      <div className="container-base relative flex min-h-0 flex-1 flex-col py-[var(--section-py)] z-2">
        {/* One grid drives both breakpoints.
            Mobile stacks into 2 equal columns: heading | CTA, then the two
            photos, then the link list across the full width.
            Desktop adds a narrow left gutter that the heading and its
            illustrations live in, so the photos begin *beside* the
            heading rather than under it — the heading's second line sits
            level with the top of the portrait. */}
        <div className="relative grid min-h-0 flex-1 grid-cols-2 grid-rows-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-6 lg:grid-cols-[180px_1fr_1fr] lg:gap-x-5 lg:gap-y-8 xl:grid-cols-[200px_1fr_1fr]">
          {/* Left gutter — the heading. Spans both rows so a long heading
              can never push the photo row down.
              `row-end-3` rather than `row-span-2`: the `grid-row` shorthand
              Tailwind emits for the span resets the start back to auto. */}
          <div className="relative lg:col-start-1 lg:row-start-1 lg:row-end-3 lg:self-stretch">
            <Reveal variant="slide-right">
              <h2 className="font-display text-5xl md:text-6xl lg:text-[80px] leading-[1.05] text-foreground">
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
              className="btn-cta w-full border border-umber bg-transparent text-umber hover:bg-umber hover:text-cream lg:w-auto"
            >
              <Link href="/humans">{t('cta')}</Link>
            </Button>
          </Reveal>

          {/* Portrait — the tall one; it sets the height of the photo row,
              which is what the link list bottom-aligns against. Also the
              anchor for the crab/buffalo on mobile, where there's no
              stretched heading gutter for them to sit in. */}
          <Reveal
            variant="fade"
            delayMs={300}
            durationMs={950}
            // `self-stretch` is load-bearing: the grid sets `items-start`,
            // so without it this cell sizes to the image's own intrinsic
            // height (646px at 1280) and overflows the `1fr` photo row
            // instead of filling it.
            className="relative min-h-0 self-stretch lg:col-start-2 lg:row-start-2"
          >
            {/* `h-full` + `object-cover` rather than the image's own
                intrinsic height: at 1280 that height was 646px and it,
                not the design, was what set the section's size. The
                `width`/`height` attributes stay on the tag so the browser
                still reserves the box and CLS stays at 0. */}
            <div className="h-full overflow-hidden">
              <img
                {...responsiveImage(humansContent.images[0].src)}
                alt={t(`images.${humansContent.images[0].id}`)}
                width={1057}
                height={1400}
                sizes="(max-width: 1023px) 50vw, 40vw"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
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
              variant="fade"
              delayMs={400}
              durationMs={950}
              // `lg:max-h-[46%]` leaves the column's `justify-between` some
              // slack to distribute — that slack is the empty band the
              // design puts the peppercorns in. Without a cap the photo
              // takes every spare pixel as `flex-1` and the band closes up,
              // dropping the tiêu straight onto the link rows.
              className="relative min-h-0 self-stretch lg:min-h-0 lg:max-h-[46%] lg:flex-1 lg:self-auto"
            >
              <div className="h-full overflow-hidden">
                <img
                  {...responsiveImage(humansContent.images[1].src)}
                  alt={t(`images.${humansContent.images[1].id}`)}
                  width={1056}
                  height={703}
                  sizes="(max-width: 1023px) 50vw, 40vw"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                />
              </div>
            </Reveal>

            {/* `z-10` so the peppercorns behind this column can't cover the
                rows' trailing arrows — the illustration layer is painted
                after this subtree, and the design has the tiêu node sitting
                below these rows. */}
            <div
              // variant="slide-left"
              // delayMs={550}
              className="relative z-10 col-span-2 shrink-0 lg:col-span-1"
            >
              <HomeHumansLinkList labels={labels} />
            </div>
          </div>
        </div>
      </div>

      {/* Section-level, not grid-level: the design measures these from the
          section edge, and the grid sits inside `container-base` padding. */}
      <HomeIllustrationLayer section="human" />
    </section >
  );
}
