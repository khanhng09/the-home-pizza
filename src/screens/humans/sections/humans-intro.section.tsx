import {
  IlustDongHoChaGioPhanThiet,
  IlustDongHoLapXuong,
  IlustDongHoNomThinhTaiHeo,
} from '@/shared/components/illustrations';
import { humansIntroContent } from '../constants/humans.constant';

export function HumansIntroSection() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Background texture — swaps per breakpoint */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:hidden"
        style={{ backgroundImage: `url(${humansIntroContent.backgroundImageMobile})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${humansIntroContent.backgroundImage})` }}
        aria-hidden="true"
      />

      <IlustDongHoNomThinhTaiHeo className="pointer-events-none absolute right-4 top-4 h-16 w-16 text-gold/70 sm:right-8 sm:top-8 sm:h-20 sm:w-20 lg:h-28 lg:w-28" />
      <IlustDongHoChaGioPhanThiet className="pointer-events-none absolute -left-4 bottom-8 h-16 w-20 text-gold/70 sm:bottom-12 sm:h-20 sm:w-24 lg:h-28 lg:w-32" />
      <IlustDongHoLapXuong className="pointer-events-none absolute -right-2 bottom-4 h-16 w-16 text-gold/70 sm:bottom-8 sm:h-20 sm:w-20 lg:h-28 lg:w-28" />

      <div className="container-base relative flex flex-col items-center gap-10 py-16 text-center lg:gap-16 lg:py-24">
        <p className="max-w-71 font-sans text-sm leading-[1.4] text-foreground sm:max-w-2xl sm:text-base lg:max-w-214 lg:text-xl">
          {humansIntroContent.paragraph}
        </p>

        <h2 className="max-w-63 font-display text-2xl leading-[1.2] text-foreground sm:max-w-none lg:max-w-214 lg:text-4xl">
          {humansIntroContent.quoteLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
