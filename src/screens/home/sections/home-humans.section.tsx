import Link from 'next/link';
import { IlustBuffalo, IlustCrab, IlustDongHoHungQue, IlustDongHoTieu } from '@/shared/components/illustrations';
import { IcArrowRight } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { humansContent, humansLinkList } from '../constants/home.constant';

export function HomeHumansSection() {
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

      {/* Decorative illustration near the heading/CTA row */}
      <IlustDongHoHungQue className="pointer-events-none absolute right-[22%] top-6 hidden h-24 w-24 text-gold lg:top-8 lg:block lg:h-32 lg:w-32" />

      <div className="container-base relative py-16 lg:py-24">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 lg:mb-14">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-foreground">
            {humansContent.heading}
          </h2>
          <Button
            asChild
            variant="outline"
            className="rounded-[3px] border-2 border-umber bg-transparent px-6 sm:px-8 py-3 sm:py-2 min-h-11 sm:min-h-10 font-sans font-bold uppercase tracking-wide text-umber transition-colors hover:bg-umber hover:text-cream shrink-0"
          >
            <Link href="#humans">{humansContent.cta}</Link>
          </Button>
        </div>

        {/* Images row. Each image keeps its native aspect ratio (no cropping)
            — human-1 is a tall portrait, human-2 a short landscape, so
            `items-start` lets human-2 stay short and leaves a gap below it
            (where the clam illustration sits) instead of stretching to
            match human-1's height. Decorative illustrations are positioned
            relative to this row specifically, not the row+list combined,
            so they stay anchored to the images regardless of list length. */}
        <div className="relative">
          <IlustCrab className="pointer-events-none absolute -left-6 top-[40%] h-24 w-24 text-gold sm:h-32 sm:w-32 lg:-left-10 lg:h-36 lg:w-36" />
          <IlustBuffalo className="pointer-events-none absolute -left-8 bottom-0 hidden h-24 w-24 text-gold lg:block lg:h-28 lg:w-28" />
          <IlustDongHoTieu className="pointer-events-none absolute -right-4 bottom-0 hidden h-28 w-32 text-gold lg:block lg:h-32 lg:w-36" />

          <div className="grid grid-cols-2 items-start gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
            <img
              src={humansContent.images[0].src}
              alt={humansContent.images[0].alt}
              className="w-full object-cover"
            />

            <img
              src={humansContent.images[1].src}
              alt={humansContent.images[1].alt}
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Arrow list — a sibling grid sharing the same column template as
            the image row above, so it lines up under human-2 on desktop
            without depending on the image row's height. Full width on mobile. */}
        <div className="mt-6 grid grid-cols-1 lg:mt-10 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
          <div aria-hidden="true" className="hidden lg:block" />
          <ul>
            {humansLinkList.map((link) => (
              <li key={link.id} className="border-b border-foreground">
                <Link
                  href={link.href}
                  className="group flex items-center justify-between py-4 min-h-11 sm:min-h-12 font-sans text-sm sm:text-base md:text-lg lg:text-[28px] uppercase tracking-wide text-foreground lg:py-5"
                >
                  {link.label}
                  <IcArrowRight className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 shrink-0 text-foreground transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
