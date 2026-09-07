import { getTranslations } from 'next-intl/server';
import { Button } from '@/shared/components/ui/button';
import { humansCtaContent } from '../constants/humans.constant';
import { Reveal } from '@/shared/components/ui/reveal';
import { responsiveImage } from '@/shared/lib/image';

export async function HumansCtaSection() {
  const t = await getTranslations('humansPage.cta');

  return (
    <section
      id="nha-tim-nguoi"
      className="section-anchor relative overflow-hidden bg-ink"
    >
      {/* Mobile locks to one screen; desktop keeps the design's 1402:512
          banner ratio, which already lands at 467px — well inside the
          674px a 720p laptop has to give. Capping it to `--section-height`
          would only stretch a banner that is meant to be a band. */}
      {/* Not `.section-screen` here: that utility and Tailwind's `lg:h-*`
          land in the same cascade layer at the same specificity, so the one
          that wins is decided by source order rather than by breakpoint —
          `.section-screen` was beating `lg:h-auto` and stretching the
          banner to a full screen. Spelling the height out as a Tailwind
          arbitrary value keeps both sides inside Tailwind's own ordering,
          where `lg:` reliably wins. */}
      <div className="relative h-[var(--section-height)] min-h-fit w-full lg:h-auto lg:aspect-[1402/512]">
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet={responsiveImage(humansCtaContent.image.src).srcSet}
            sizes="100vw"
          />
          <img
            src={responsiveImage(humansCtaContent.image.mobileSrc).src}
            srcSet={responsiveImage(humansCtaContent.image.mobileSrc).srcSet}
            sizes="100vw"
            alt={t('imageAlt')}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/40" />

        <div className="container-base absolute inset-x-0 bottom-10 flex flex-col items-start lg:bottom-16 gap-4">
          <Reveal variant="slide-up">
            <h2 className="max-w-88 font-display text-5xl leading-[1.2] text-cream lg:max-w-98 lg:text-[64px]">
              {t('heading')}
            </h2>
          </Reveal>
          <Reveal variant="slide-up" delayMs={200}>
            <Button
              asChild
              className="btn-cta w-full max-w-55 border border-cream bg-cream text-ink hover:bg-linen"
            >
              <a href={humansCtaContent.ctaHref} target="_blank" rel="noopener noreferrer">
                {t('cta')}
              </a>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
