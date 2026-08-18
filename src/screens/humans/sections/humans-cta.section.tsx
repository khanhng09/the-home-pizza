import { getTranslations } from 'next-intl/server';
import { Button } from '@/shared/components/ui/button';
import { humansCtaContent } from '../constants/humans.constant';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage } from '@/shared/lib/image';

export async function HumansCtaSection() {
  const t = await getTranslations('humansPage.cta');

  return (
    <section
      id="nha-tim-nguoi"
      className="relative scroll-mt-[var(--header-height)] overflow-hidden bg-ink"
    >
      <div className="relative min-h-svh w-full lg:min-h-0 lg:aspect-[1402/512]">
        <picture>
          <source media="(min-width: 1024px)" srcSet={optimizedImage(humansCtaContent.image.src)} />
          <img
            src={optimizedImage(humansCtaContent.image.mobileSrc)}
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
              <a href={humansCtaContent.ctaHref}>{t('cta')}</a>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
