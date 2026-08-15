import { getLocale, getTranslations } from 'next-intl/server';
import { IcClock } from '@/shared/components/icons';
import { Link } from '@/i18n/navigation';
import { Reveal } from '@/shared/components/ui/reveal';
import { sanityResponsiveImage } from '@/shared/lib/sanity/image';
import { getStoryFeed } from '@/shared/lib/story-content';
import { formatStoryTimestamp } from '@/shared/lib/utils';

/**
 * A preview feed of Nhà's day-to-day moments, read from
 * `shared/lib/story-content.ts` — the same source `/story/[slug]` and its
 * recent-posts rail use, so a post added there shows up in all three.
 *
 * Entries whose body has not been written yet render as plain figures
 * rather than links, so no card points at a 404.
 */
export async function StoryListSection() {
  const t = await getTranslations('storyPage.list');
  const locale = await getLocale();
  const stories = await getStoryFeed(locale);

  return (
    // Transparent — the paper texture and cream base come from
    // StoryBackdrop, so the grain carries over from the intro section
    // above without restarting at the boundary.
    <section aria-labelledby="story-list-heading" className="relative py-10 lg:pt-20 lg:pb-25">
      <h2 id="story-list-heading" className="sr-only">
        {t('heading')}
      </h2>

      <ul className="container-base grid list-none grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        {stories.map((story, index) => {
          const image = sanityResponsiveImage(story.image);

          const card = (
            <figure className="flex items-start gap-2.5 md:gap-4">
              <img
                src={image.src}
                srcSet={image.srcSet}
                alt={story.image.alt}
                width={story.image.width}
                height={story.image.height}
                sizes="(min-width: 1024px) 230px, (min-width: 640px) 180px, 40vw"
                loading="lazy"
                // Card thumbnails, always below the fold — same reasoning as
                // the intro photos: nothing here should be competing with
                // the LCP paint for the connection.
                fetchPriority="low"
                decoding="async"
                className="aspect-square shrink-0 object-cover w-[190px] lg:w-76.25"
              />
              <figcaption className="flex min-w-0 flex-1 flex-col gap-1 md:gap-1.5">
                <p className="font-sans text-sm font-semibold text-foreground">{story.title}</p>
                <div className="flex items-center gap-px md:gap-0.5">
                  <IcClock className="size-3 md:size-4.5 shrink-0 text-gold" aria-hidden="true" />
                  <time dateTime={story.publishedAt} className="font-sans text-xs md:text-lg text-gold">
                    {formatStoryTimestamp(story.publishedAt)}
                  </time>
                </div>
              </figcaption>
            </figure>
          );

          return (
            <li key={story._id}>
              <Reveal variant="fade" delayMs={Math.min(index * 80, 320)}>
                {story.published ? (
                  <Link
                    href={`/story/${story.slug}`}
                    className="block transition-opacity hover:opacity-85"
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
    </section>
  );
}
