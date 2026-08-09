/**
 * The shape the /story feed and its article pages read from.
 *
 * Deliberately modelled on what a headless CMS returns rather than on what
 * is convenient to hardcode, so that swapping the local source in
 * `shared/lib/story-content.ts` for a real query is a change to that one
 * file. It is written against Sanity in particular: `_type`/`_key` on every
 * block, and a body that is an ordered array of typed blocks, is Portable
 * Text — Sanity's native rich-text format.
 *
 * The important consequence is that body content is **structured JSON, not
 * HTML**. Blocks are turned into React elements by
 * `screens/story-detail/components/story-detail-body.tsx`, so no CMS value
 * is ever fed to `dangerouslySetInnerHTML`, and there is no HTML for an
 * editor (or anyone who reaches the dataset) to smuggle a `<script>`
 * through. Sanitising is not a step that was skipped here; the format
 * removes the thing that would need sanitising. An unrecognised `_type`
 * renders as nothing rather than as markup.
 *
 * Text still needs care in one place: `href` on a link mark is the only
 * field that becomes a URL, so the renderer allow-lists its scheme.
 */

/** Inline emphasis inside a paragraph. Matches Portable Text's decorators;
 * anything not listed is dropped by the renderer rather than passed
 * through. */
export type StoryMark = 'strong' | 'em';

export interface StorySpan {
  text: string;
  marks?: StoryMark[];
  /** Turns the span into a link. Sanitised at render — see `safeHref`. */
  href?: string;
}

/** Authoring shorthand: a bare string is a span with no marks. Normalised
 * by the renderer, so the content source stays readable. */
export type StorySpanInput = string | StorySpan;

export interface StoryImageAsset {
  src: string;
  /** Intrinsic pixel size of the asset, so every `<img>` can carry real
   * integer `width`/`height` and reserve its box before it loads. Sanity
   * returns these under `asset->metadata.dimensions`. */
  width: number;
  height: number;
  alt: string;
}

export type StoryBlock =
  | { _type: 'paragraph'; _key: string; spans: StorySpanInput[] }
  | { _type: 'heading'; _key: string; level: 2 | 3; text: string }
  | { _type: 'image'; _key: string; image: StoryImageAsset; caption?: string };

export interface StoryAuthor {
  name: string;
  /** Optional — the article header falls back to a monogram when a CMS
   * author has no portrait yet. */
  avatar?: StoryImageAsset;
}

/** The card shape the /story feed and the "recent posts" rail both render.
 * A published article is a superset of this, so one query can serve both. */
export interface StoryTeaser {
  _id: string;
  slug: string;
  title: string;
  publishedAt: string;
  image: StoryImageAsset;
  /** False while an entry exists as a teaser but has no body yet — the
   * card then renders unlinked instead of pointing at a 404. */
  published: boolean;
}

export interface StoryArticle extends StoryTeaser {
  /** The standfirst under the headline. Its own field rather than the
   * first body block, because the design colours it differently and
   * because it doubles as the meta/OG description. */
  excerpt: string;
  readingMinutes: number;
  author: StoryAuthor;
  body: StoryBlock[];
}
