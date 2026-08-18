import { getTranslations } from 'next-intl/server';
import { humansIntroContent } from '../constants/humans.constant';
import { Illustration } from '@/shared/components/illustrations/illustration';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage } from '@/shared/lib/image';

export async function HumansIntroSection() {
  const t = await getTranslations('humansPage.intro');
  const quoteLines = t.raw('quoteLines') as string[];

  return (
    <section className="relative h-svh lg:h-auto flex flex-col justify-center overflow-hidden bg-cream lg:block">
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

      {/* Illustration geometry is the Figma canvas measured 1:1 — mobile from
       * the 430-wide frame, desktop from the 1400-wide one. The desktop
       * comp carries only the lạp xưởng; the other two are mobile-only,
       * where the taller stacked layout leaves margin space for them. */}
      <Illustration name="dong-ho-nom-thinh-tai-heo" className="pointer-events-none absolute -right-[41px] top-8 h-[80px] w-[107px] text-gold lg:hidden" />
      <Illustration name="dong-ho-cha-gio-phan-thiet" className="pointer-events-none absolute -left-7 bottom-[79px] h-[79px] w-[118px] text-gold lg:hidden" />
      <Illustration name="dong-ho-lap-xuong" className="pointer-events-none absolute right-[7px] bottom-[9px] h-[76px] w-[112px] text-gold lg:right-auto lg:left-[72.71%] lg:bottom-7 lg:h-[121px] lg:w-[178px]" />

      <div className="container-base relative flex flex-col items-center gap-4 py-10 text-center lg:gap-6 lg:py-30.5">
        <Reveal variant="slide-up">
          <p className="max-w-71 font-sans text-sm leading-[1.4] text-foreground sm:max-w-2xl sm:text-base lg:max-w-214 lg:text-xl">
            {t('paragraph')}
          </p>
        </Reveal>

        <Reveal variant="slide-up" delayMs={200}>
          <h2 className="max-w-63 font-display text-2xl leading-[1.2] text-foreground sm:max-w-none lg:max-w-214 lg:text-[40px]">
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
