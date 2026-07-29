import { getTranslations } from 'next-intl/server';
import {
  IlustDongHoCaTrich,
  IlustDongHoGhe,
  IlustDongHoHungQue,
} from '@/shared/components/illustrations';
import { humansPeopleStoryContent } from '../constants/humans.constant';

export async function HumansPeopleStorySection() {
  const t = await getTranslations('humansPage.peopleStory');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    <section className="relative overflow-hidden bg-linen">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Text column — first on mobile (stacked above the photo), right on desktop */}
        <div className="relative order-1 flex flex-col gap-8 bg-linen px-4 py-16 md:px-6 lg:order-2 lg:px-8 lg:py-32">
          <IlustDongHoGhe className="pointer-events-none absolute right-6 top-6 h-16 w-16 text-umber/50 sm:right-10 sm:top-10 sm:h-20 sm:w-20 lg:h-28 lg:w-28" />

          <h2 className="max-w-70 font-display text-4xl leading-[1.2] text-foreground sm:max-w-none lg:max-w-124 lg:text-[80px]">
            {t('heading')}
          </h2>

          <div className="scrollbar-story-umber flex max-h-125 max-w-147 flex-col gap-4 overflow-y-auto pl-6 font-sans text-sm leading-[1.4] text-foreground lg:pl-8 lg:text-xl">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <IlustDongHoHungQue className="pointer-events-none absolute -left-4 bottom-0 h-24 w-24 text-umber/50 sm:h-28 sm:w-28 lg:h-36 lg:w-36" />
        </div>

        {/* Photo column — second on mobile, left on desktop */}
        <div className="relative order-2 lg:order-1">
          <IlustDongHoCaTrich className="pointer-events-none absolute -left-4 -bottom-4 hidden h-24 w-24 text-gold/60 lg:block" />
          <img
            src={humansPeopleStoryContent.image.src}
            srcSet={`${humansPeopleStoryContent.image.mobileSrc} 580w, ${humansPeopleStoryContent.image.src} 942w`}
            sizes="(max-width: 1024px) 100vw, 50vw"
            alt={t('imageAlt')}
            loading="lazy"
            decoding="async"
            className="aspect-[430/561] w-full object-cover lg:aspect-[700/914] lg:h-full"
          />
        </div>
      </div>
    </section>
  );
}
