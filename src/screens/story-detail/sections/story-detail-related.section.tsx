import { getTranslations } from 'next-intl/server';
import {
  STORY_DETAIL_RELATED_TEXTURE,
  storyDetailRelatedIllustrations,
} from '../constants/story-detail.constant';
import { IcClock } from '@/shared/components/icons';
import { Illustration } from '@/shared/components/illustrations/illustration';
import { Link } from '@/i18n/navigation';
import { Reveal } from '@/shared/components/ui/reveal';
import { optimizedImage, responsiveImage } from '@/shared/lib/image';
import { formatStoryTimestamp } from '@/shared/lib/utils';
import type { StoryTeaser } from '@/shared/types/story-content.type';

/**
 * "Bài đăng gần đây" — the cream band under the article.
 *
 * Two different card shapes, as drawn: a three-up grid with the photo above
 * its caption on desktop, and a stacked list with the photo beside its
 * caption on mobile. That is the same pair the /story landing uses, so the
 * two feeds read as one component family.
 *
 * A teaser with no body yet renders as a plain `<figure>` rather than a
 * link — see `published` in `shared/types/story-content.type.ts`.
 */
export async function StoryDetailRelatedSection({ stories }: { stories: StoryTeaser[] }) {
  const t = await getTranslations('storyDetail.related');

  if (!stories.length) return null;

  return (
    <section
      aria-labelledby="story-related-heading"
      className="relative overflow-hidden bg-cream pt-11 pb-14 lg:pt-29 lg:pb-34"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-top bg-[length:100%_auto] bg-repeat-y lg:hidden"
        style={{ backgroundImage: `url(${optimizedImage(STORY_DETAIL_RELATED_TEXTURE.mobile)})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-top bg-[length:100%_auto] bg-repeat-y lg:block"
        style={{ backgroundImage: `url(${optimizedImage(STORY_DETAIL_RELATED_TEXTURE.desktop)})` }}
      />

      {/* Desktop only — the design's mobile frame draws none of these, and
          at 430px they would land on top of the cards rather than beside
          them. */}
      {storyDetailRelatedIllustrations.map((item) => (
        <Illustration
          key={item.name}
          name={item.name}
          className="absolute z-0 hidden text-gold/70 lg:block"
          style={{ left: item.left, top: item.top, width: item.width, aspectRatio: item.ratio }}
        />
      ))}

      {/* Same 888 = 856 + 2x16 measure as the article above, so the cards
          line up with the body copy they sit under. */}
      <div className="relative z-1 mx-auto w-full max-w-[888px] px-4">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="story-related-heading"
            className="font-display leading-[1.2] text-foreground text-[1.5rem] lg:text-[3rem]"
          >
            {t('heading')}
          </h2>

          {/* The design draws this 30px tall; 44 is the project's tap-target
              floor, so the height goes up and the rest of the treatment —
              3px radius, umber hairline, bold uppercase — stays as drawn. */}
          <Link
            href="/story"
            className="flex h-[30px] shrink-0 items-center justify-center rounded-[3px] border border-umber px-5 font-sans text-sm font-bold uppercase tracking-[0.02em] text-umber transition-colors hover:bg-umber hover:text-cream lg:text-lg"
          >
            {t('viewAll')}
          </Link>
        </div>

        <ul className="mt-6 grid list-none grid-cols-1 gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-6">
          {stories.map((story, index) => {
            const image = responsiveImage(story.image.src);

            const card = (
              <figure className="flex items-start gap-2.5 lg:flex-col lg:gap-3.5">
                <img
                  src={image.src}
                  srcSet={image.srcSet}
                  alt={story.image.alt}
                  width={story.image.width}
                  height={story.image.height}
                  sizes="(min-width: 1024px) 272px, 190px"
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-[190px] shrink-0 object-cover lg:w-full"
                />
                <figcaption className="flex min-w-0 flex-1 flex-col gap-1 md:gap-1.5 lg:w-full">
                  <p className="font-sans text-sm font-semibold leading-[1.4] text-foreground">
                    {story.title}
                  </p>
                  <div className="flex items-center gap-px md:gap-1">
                    <IcClock className="size-3 md:size-4 shrink-0 text-gold" aria-hidden="true" />
                    <time dateTime={story.publishedAt} className="font-sans text-xs md:text-sm text-gold">
                      {formatStoryTimestamp(story.publishedAt)}
                    </time>
                  </div>
                </figcaption>
              </figure>
            );

            return (
              <li key={story._id}>
                <Reveal variant="fade" delayMs={Math.min(index * 80, 240)}>
                  {story.published ? (
                    <Link
                      href={`/story/${story.slug}`}
                      className="group block transition-opacity hover:opacity-85"
                    >
                      {card}
                    </Link>
                  ) : (
                    card
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
