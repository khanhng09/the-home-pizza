import { getTranslations } from 'next-intl/server';
import { StoryDetailActions } from '../components/story-detail-actions';
import { StoryDetailBody } from '../components/story-detail-body';
import { STORY_DETAIL_COMMENTS_ENABLED } from '../constants/story-detail.constant';
import { IcChevronLeft } from '@/shared/components/icons';
import { Link } from '@/i18n/navigation';
import { Reveal } from '@/shared/components/ui/reveal';
import { DARK_PAPER_TILE, DARK_PAPER_TILE_SIZE } from '@/shared/constants/texture.constant';
import { formatStoryByline, getInitials } from '@/shared/lib/utils';
import type { StoryArticle } from '@/shared/types/story-content.type';

/**
 * The article itself, on the dark half of the page.
 *
 * The design draws an 856px column centred in a 1400px canvas, so the
 * column is a fixed measure rather than a share of the viewport — a 61%
 * width would keep growing on a wide screen and push the line length past
 * what is comfortable to read. Below 888px it collapses to the design's
 * 16px mobile gutters.
 */
export async function StoryDetailArticleSection({
  article,
  locale,
}: {
  article: StoryArticle;
  locale: string;
}) {
  const t = await getTranslations('storyDetail');

  return (
    <section
      // `bg-deep` under the tile, not just behind it: the tile is dark
      // teal, and a cream flash before it loads on a slow connection would
      // put cream text on cream.
      className="relative bg-deep bg-repeat"
      style={{
        backgroundImage: `url(${DARK_PAPER_TILE})`,
        backgroundSize: DARK_PAPER_TILE_SIZE,
      }}
    >
      {/* 150px is measured from the top of the design canvas, and the
          header is `fixed`, so it is not offset here — the padding has to
          clear the 46px bar on its own. */}
      {/* 888 = the design's 856px measure plus its own 16px gutters, so the
          text column is exactly 856 wide once the padding is subtracted,
          and collapses to those same 16px gutters below 888. */}
      <div className="mx-auto flex w-full max-w-[888px] flex-col gap-[18px] px-4 pt-[150px] pb-11 lg:gap-[31px] lg:pb-30">
        <Reveal variant="fade">
          <div className="flex items-center gap-3 py-3">
            {/* No author portrait in the content set yet, so a monogram
                stands in — a CMS author with an `avatar` renders that
                instead, at the same 50px. */}
            <span
              aria-hidden="true"
              className="flex size-[50px] shrink-0 items-center justify-center rounded-full border border-gold bg-gold/20 font-display text-lg text-cream"
            >
              {getInitials(article.author.name)}
            </span>
            <p className="font-sans text-xl leading-[1.4] text-white lg:text-2xl">
              <span className="lg:after:content-['__•__']">{article.author.name}</span>
              <span className="block lg:inline">
                {formatStoryByline(article.publishedAt, locale)}
                {'  •  '}
                {t('readingTime', { minutes: article.readingMinutes })}
              </span>
            </p>
          </div>
        </Reveal>

        <Reveal variant="slide-up">
          <h1 className="font-display leading-[1.2] text-cream text-[clamp(2.25rem,11.2vw,3rem)] lg:text-[4rem]">
            {article.title}
          </h1>
        </Reveal>

        {/* Linen rather than cream, as drawn — the standfirst reads a shade
            back from the body copy that follows it. */}
        <Reveal variant="slide-up" delayMs={80}>
          <p className="font-sans text-base leading-[1.4] text-linen lg:text-xl">
            {article.excerpt}
          </p>
        </Reveal>

        <StoryDetailBody blocks={article.body} />

        <div className="flex h-14 items-center justify-between">
          <Link
            href="/story"
            className="-ml-2 flex min-h-11 items-center gap-1.5 px-2 font-sans text-lg uppercase text-linen transition-colors hover:text-gold"
          >
            <IcChevronLeft className="size-3.5 shrink-0" aria-hidden="true" />
            {t('back')}
          </Link>

          <StoryDetailActions slug={article.slug} title={article.title} />
        </div>

        {STORY_DETAIL_COMMENTS_ENABLED && (
          <section aria-labelledby="story-comments-heading" className="flex flex-col gap-10">
            <div className="flex h-[87px] items-center border-b border-gold">
              <h2
                id="story-comments-heading"
                className="font-display leading-[1.2] text-linen text-[1.5rem] lg:text-[3rem]"
              >
                {t('comments.heading')}
              </h2>
            </div>

            {/* Markup only — it has no action yet. See the flag's note in
                ../constants/story-detail.constant.ts for why. */}
            <form className="w-full">
              <label htmlFor="story-comment" className="sr-only">
                {t('comments.label')}
              </label>
              <input
                id="story-comment"
                name="comment"
                type="text"
                autoComplete="off"
                placeholder={t('comments.placeholder')}
                className="h-15 w-full rounded-lg bg-[#426E8A]/50 px-4 font-sans text-base font-semibold text-cream outline-none placeholder:text-cream/70 focus-visible:ring-2 focus-visible:ring-gold"
              />
            </form>
          </section>
        )}
      </div>
    </section>
  );
}
