/**
 * Layout constants for the /story/[slug] screen. Article copy is not here —
 * it comes from `shared/lib/story-content.ts`.
 */

/**
 * The dark paper the article sits on, tiled with `background-repeat` across
 * the whole section.
 *
 * This is `pattern-bg.webp` run through `yarn images:tile`: the source is a
 * photograph of dó paper whose left edge does not continue into its right,
 * so repeating it directly draws a faint grid across the page. It is also
 * cropped down to a 360px tile rather than kept at the source's 1400px —
 * repeating the source at full size barely repeats at all inside a normal
 * viewport (less than a third of one tile is visible on a 375px phone), so
 * it reads as one image stretched behind the page rather than a fine paper
 * grain. See `scripts/make-seamless-tile.mjs` for both fixes.
 */
export const STORY_DETAIL_PATTERN = '/images/pattern-bg.webp';

/** The paper texture behind the recent-posts band, on the cream half of the
 * page. Shared with the /story landing and the home teaser so the grain
 * matches across screens. */
export const STORY_DETAIL_RELATED_TEXTURE = {
  desktop: '/images/home/story/background.webp',
  mobile: '/images/home/story/background-mb.webp',
};

/**
 * Comments are off.
 *
 * Sanity has no public write path — its API is editor-authenticated, so
 * accepting a comment means either proxying it through a Server Action with
 * a write token (and then owning spam filtering, rate limiting and
 * moderation) or handing the job to a third party. Neither is worth
 * blocking this page on, so the section is built and switched off; flipping
 * this flag renders it.
 *
 * The `<form>` in `../sections/story-detail-article.section.tsx` is markup
 * only and posts nowhere — whichever route is chosen has to wire it up
 * before this becomes `true`.
 */
export const STORY_DETAIL_COMMENTS_ENABLED = false;

/**
 * Decorative đông hồ line-art scattered behind the recent-posts band,
 * placed as a share of the band rather than in pixels so the arrangement
 * holds at any width.
 *
 * Every number is the design's own, over the band's 1400x687 box: `left`
 * and `width` divided by 1400, `top` by 687. `pizza-dough` intentionally
 * runs past the right edge, as drawn. The design's mobile frame has no
 * illustrations at all, so the section hides these below `lg`.
 */
export const storyDetailRelatedIllustrations = [
  { name: 'dong-ho-ghe', left: '80.571%', top: '4.221%', width: '17%', ratio: '238 / 135' },
  { name: 'dong-ho-hoi-que', left: '3.286%', top: '54.294%', width: '11.429%', ratio: '160 / 105' },
  { name: 'dong-ho-pizza-dough', left: '89.857%', top: '70.160%', width: '15.357%', ratio: '215 / 138' },
] as const;
