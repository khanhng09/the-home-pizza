import { getTranslations } from 'next-intl/server';
import { humansIntroContent } from '../constants/humans.constant';
import { Illustration } from '@/shared/components/illustrations/illustration';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage } from '@/shared/lib/image';

export async function HumansIntroSection() {
  const t = await getTranslations('humansPage.intro');
  const quoteLines = t.raw('quoteLines') as string[];

  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Background texture — swaps per breakpoint */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:hidden"
        style={{ backgroundImage: `url(${optimizedImage(humansIntroContent.backgroundImageMobile)})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${optimizedImage(humansIntroContent.backgroundImage)})` }}
        aria-hidden="true"
      />

      <Illustration name="dong-ho-nom-thinh-tai-heo" className="pointer-events-none absolute right-4 top-4 h-16 w-16 text-gold/70 sm:right-8 sm:top-8 sm:h-20 sm:w-20 lg:h-28 lg:w-28" />
      <Illustration name="dong-ho-cha-gio-phan-thiet" className="pointer-events-none absolute -left-4 bottom-8 h-16 w-20 text-gold/70 sm:bottom-12 sm:h-20 sm:w-24 lg:h-28 lg:w-32" />
      <Illustration name="dong-ho-lap-xuong" className="pointer-events-none absolute -right-2 bottom-4 h-16 w-16 text-gold/70 sm:bottom-8 sm:h-20 sm:w-20 lg:h-28 lg:w-28" />

      <div className="container-base relative flex flex-col items-center gap-10 py-16 text-center lg:gap-16 lg:py-24">
        <Reveal variant="slide-up">
          <p className="max-w-71 font-sans text-sm leading-[1.4] text-foreground sm:max-w-2xl sm:text-base lg:max-w-214 lg:text-xl">
            {t('paragraph')}
          </p>
        </Reveal>

        <Reveal variant="slide-up" delayMs={200}>
          <h2 className="max-w-63 font-display text-2xl leading-[1.2] text-foreground sm:max-w-none lg:max-w-214 lg:text-4xl">
            {quoteLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
