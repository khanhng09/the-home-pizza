import { getTranslations } from 'next-intl/server';
import { humansChefStoryContent } from '../constants/humans.constant';
import { Illustration } from '@/shared/components/illustrations/illustration';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage } from '@/shared/lib/image';

export async function HumansChefStorySection() {
  const t = await getTranslations('humansPage.chefStory');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    <section className="relative overflow-hidden bg-deep">
      {/* Background texture — swaps per breakpoint */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:hidden"
        style={{ backgroundImage: `url(${optimizedImage(humansChefStoryContent.backgroundImageMobile)})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${optimizedImage(humansChefStoryContent.backgroundImage)})` }}
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-2">
        {/* Text column */}
        <div className="relative flex flex-col gap-8 px-4 py-16 md:px-6 lg:px-8 lg:py-32">
          <Illustration name="dong-ho-banh-da" className="pointer-events-none absolute right-6 top-6 h-16 w-16 text-gold/70 sm:right-10 sm:top-10 sm:h-20 sm:w-20 lg:h-28 lg:w-28" />

          <Reveal variant="slide-right">
            <h2 className="max-w-70 font-display text-4xl leading-[1.2] text-cream sm:max-w-none lg:max-w-124 lg:text-[80px]">
              {t('heading')}
            </h2>
          </Reveal>

          <Reveal variant="slide-right" delayMs={200}>
            <div className="scrollbar-story-gold flex max-h-125 max-w-147 flex-col gap-4 overflow-y-auto pl-6 font-sans text-sm leading-[1.4] text-cream lg:pl-8 lg:text-xl">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Illustration name="dong-ho-sau-rieng" className="pointer-events-none absolute -left-4 bottom-0 h-24 w-24 text-gold/70 sm:h-28 sm:w-28 lg:h-36 lg:w-36" />
        </div>

        {/* Photo column */}
        <div className="relative flex items-center justify-center bg-gold px-8 py-12 lg:py-16">
          <Illustration name="dong-ho-pizza-dough" className="pointer-events-none absolute -right-4 -top-4 hidden h-24 w-24 text-cream/40 lg:block" />
          <Reveal variant="zoom-in" delayMs={350} durationMs={950}>
            <img
              src={optimizedImage(humansChefStoryContent.image.src)}
              srcSet={`${optimizedImage(humansChefStoryContent.image.mobileSrc)} 860w, ${optimizedImage(humansChefStoryContent.image.src)} 1400w`}
              sizes="(max-width: 1024px) 288px, 472px"
              alt={t('imageAlt')}
              loading="lazy"
              decoding="async"
              className="aspect-[430/561] w-full max-w-72 object-cover lg:max-w-118"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
