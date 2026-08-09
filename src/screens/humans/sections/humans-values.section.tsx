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
    <section className="relative overflow-hidden bg-cream">
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

      <div className="container-base relative grid grid-cols-1 gap-10 py-16 lg:grid-cols-3 lg:gap-30 lg:py-24">
        {humansValuesList.map((value, index) => {
          return (
            <Reveal key={value.id} variant="slide-up" delayMs={index * 150}>
              <div className="flex flex-col items-center">
                <Illustration
                  name={valueIllustrations[index]}
                  className="self-center text-ink h-30 aspect-square"
                />
                <div className="flex flex-col md:items-center lg:items-start border-t border-ink max-w-[400px]">
                  <h3 className="font-sans uppercase tracking-wide text-ink text-[32px] py-6.5">
                    {t(`${value.id}.label`)}
                  </h3>
                  <p className="font-sans text-xl leading-[1.4] text-ink">
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
