import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { IlustBuffalo } from '@/shared/components/illustrations/illus-buffalo';
import { IlustCrab } from '@/shared/components/illustrations/illus-crab';
import { IlustDongHoHungQue } from '@/shared/components/illustrations/illus-dong-ho-hung-que';
import { IlustDongHoTieu } from '@/shared/components/illustrations/illus-dong-ho-tieu';
import { IcArrowRight } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { Reveal } from '@/shared/components/ui/reveal';
import { humansContent, humansLinkList } from '../constants/home.constant';

export async function HomeHumansSection() {
  const t = await getTranslations('home.humans');

  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Background texture — swaps per breakpoint */}
      <div
        className="absolute inset-0 aspect-[430/600] lg:aspect-auto bg-cover bg-center lg:hidden"
        style={{ backgroundImage: `url(${humansContent.backgroundImageMobile})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${humansContent.backgroundImage})` }}
        aria-hidden="true"
      />

      <div className="container-base relative py-16 lg:py-24">
        {/* One grid drives both breakpoints.
            Mobile stacks into 2 equal columns: heading | CTA, then the two
            photos, then the link list across the full width.
            Desktop adds a narrow left gutter that the heading and its
            illustrations live in, so the photos begin *beside* the
            heading rather than under it — the heading's second line sits
            level with the top of the portrait. */}
        <div className="relative grid grid-cols-2 items-start gap-x-4 gap-y-6 lg:grid-cols-[180px_1fr_1fr] lg:gap-x-5 lg:gap-y-8 xl:grid-cols-[200px_1fr_1fr]">
          {/* Sits above the seam between the two photos, riding up into
              the section's top padding. Anchored to the grid rather than
              the section so it tracks the container, not the viewport. */}
          <IlustDongHoHungQue
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-[52%] hidden h-32 w-32 text-gold lg:block"
          />

          {/* Left gutter — heading, plus the two illustrations that flank
              it down the left edge of the section. Spans both rows so a
              long heading can never push the photo row down, and stretches
              against the grid's `items-start` so the buffalo has the full
              column height to sit at the bottom of.
              `row-end-3` rather than `row-span-2`: the `grid-row` shorthand
              Tailwind emits for the span resets the start back to auto. */}
          <div className="relative lg:col-start-1 lg:row-start-1 lg:row-end-3 lg:self-stretch">
            <Reveal variant="slide-right">
              <h2 className="font-display text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-[1.05] text-foreground">
                {t('heading')}
              </h2>
            </Reveal>

            <IlustCrab
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-[30%] hidden h-32 w-32 text-gold lg:block xl:h-36 xl:w-36"
            />
            <IlustBuffalo
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-[8%] hidden h-24 w-24 text-gold lg:block xl:h-28 xl:w-28"
            />
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
              which is what the link list bottom-aligns against. */}
          <Reveal
            variant="zoom-in"
            delayMs={300}
            durationMs={950}
            className="lg:col-start-2 lg:row-start-2"
          >
            <div className="overflow-hidden">
              <img
                src={humansContent.images[0].src}
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
                  src={humansContent.images[1].src}
                  alt={t(`images.${humansContent.images[1].id}`)}
                  width={1056}
                  height={703}
                  sizes="(max-width: 1023px) 50vw, 40vw"
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                />
              </div>

              <IlustDongHoTieu
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-full mt-4 h-24 w-28 text-gold lg:mt-6 lg:h-32 lg:w-36"
              />
            </Reveal>

            <Reveal
              variant="slide-left"
              delayMs={550}
              // The left inset is the crab's slot — it shrinks as the
              // viewport grows so the gutter stays roughly the crab's own
              // width instead of opening into dead space.
              className="relative col-span-2 pl-[28%] sm:pl-[20%] lg:col-span-1 lg:pl-0"
            >
              {/* Second instance of the crab: on mobile the left gutter
                  doesn't exist, and the Figma moves it down here beside
                  the list. Cheaper than trying to reposition one node
                  across two different grid columns. */}
              <IlustCrab
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1/2 h-24 w-24 -translate-y-1/2 text-gold lg:hidden"
              />

              <ul>
                {humansLinkList.map((link) => (
                  <li key={link.id} className="border-b border-foreground">
                    <Link
                      href={link.href}
                      className="group flex min-h-11 cursor-pointer items-center justify-between gap-2 py-3 font-sans text-lg uppercase tracking-wide text-foreground lg:py-5 lg:text-[28px]"
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
    </section>
  );
}
