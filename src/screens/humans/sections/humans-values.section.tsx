import { getTranslations } from 'next-intl/server';
import {
  Illustration,
  type IllustrationName,
} from '@/shared/components/illustrations/illustration';
import { humansValuesContent, humansValuesList } from '../constants/humans.constant';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage } from '@/shared/lib/image';

// One illustration per column, in the same order as humansValuesList
// (Kết nối / Sáng tạo / Tận tâm) — matches the Figma source exactly.
const valueIllustrations: IllustrationName[] = [
  'dong-ho-doi',
  'dong-ho-ca-trich',
  'dong-ho-pizza-base',
];

export async function HumansValuesSection() {
  const t = await getTranslations('humansPage.values');

  return (
    <section className="relative flex flex-col justify-center overflow-hidden bg-cream lg:block">
      {/* Background texture — swaps per breakpoint */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:hidden"
        style={{ backgroundImage: `url(${optimizedImage(humansValuesContent.backgroundImageMobile)})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${optimizedImage(humansValuesContent.backgroundImage)})` }}
        aria-hidden="true"
      />

      {/* Mobile runs three stacked blocks of real copy, so this is the one
          section that cannot be squeezed into a single screen without
          cutting text. Everything around the words is tightened instead —
          smaller mark, tighter rhythm, 16px body rather than 20 — which
          brings it close to one screen; desktop keeps the comp exactly. */}
      <div className="container-base relative grid grid-cols-1 gap-6 py-10 lg:grid-cols-3 lg:gap-30 lg:py-24">
        {humansValuesList.map((value, index) => {
          return (
            <Reveal key={value.id} variant="slide-up" delayMs={index * 150}>
              <div className="flex flex-col items-center">
                <Illustration
                  name={valueIllustrations[index]}
                  className="aspect-square h-20 self-center text-ink lg:h-30"
                />
                <div className="flex flex-col md:items-center lg:items-start border-t border-ink max-w-[400px]">
                  <h3 className="font-sans uppercase tracking-wide text-ink text-2xl py-4 lg:text-[32px] lg:py-6.5">
                    {t(`${value.id}.label`)}
                  </h3>
                  <p className="text-justify font-sans text-base leading-[1.4] text-ink lg:text-xl">
                    {t(`${value.id}.paragraph`)}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
