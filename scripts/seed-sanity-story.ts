/**
 * One-time migration: uploads the 6 entries hardcoded in
 * `shared/constants/story-content.constant.ts` into Sanity as `storyPost`
 * documents, so the site doesn't lose its current posts the day
 * `shared/lib/story-content.ts` switches from that constant to live
 * queries.
 *
 * Run via the Sanity CLI (needs `sanity.cli.ts`'s project/dataset, and
 * picks up `.env.local` automatically):
 *
 *   yarn sanity exec scripts/seed-sanity-story.ts --with-user-token
 *
 * `--with-user-token` reuses your `sanity login` session for write access
 * instead of a separately managed write-token env var. Safe to re-run —
 * every document is written with `createOrReplace` against the entry's
 * original `_id`.
 */
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { getCliClient } from 'sanity/cli';
import { storyEntries } from '../src/shared/constants/story-content.constant';
import type { StoryBlock, StorySpanInput } from '../src/shared/types/story-content.type';

type StoryEntry = (typeof storyEntries)[number];

const client = getCliClient({ apiVersion: '2025-02-01' });

const assetIdCache = new Map<string, string>();

/** `src` is a `public/`-relative path like `/images/story/story-1.webp`.
 * Cached by src so a photo reused across an entry's cover + body (or
 * across entries) is only uploaded once. */
async function uploadImage(src: string): Promise<string> {
  const cached = assetIdCache.get(src);
  if (cached) return cached;

  const filePath = path.join(process.cwd(), 'public', src);
  const buffer = await readFile(filePath);
  const asset = await client.assets.upload('image', buffer, { filename: path.basename(src) });

  assetIdCache.set(src, asset._id);
  return asset._id;
}

interface SanitySpan {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
}
interface SanityMarkDef {
  _key: string;
  _type: 'link';
  href: string;
}
interface SanityBodyBlock {
  _type: 'block';
  _key: string;
  style: 'normal' | 'h2' | 'h3';
  children: SanitySpan[];
  markDefs: SanityMarkDef[];
}
interface SanityBodyImage {
  _type: 'image';
  _key: string;
  asset: { _type: 'reference'; _ref: string };
  alt: string;
  caption?: string;
}

function toSanitySpans(spans: StorySpanInput[], blockKey: string): { children: SanitySpan[]; markDefs: SanityMarkDef[] } {
  const markDefs: SanityMarkDef[] = [];
  const children = spans.map((input, index) => {
    const span = typeof input === 'string' ? { text: input } : input;
    const marks: string[] = [...(span.marks ?? [])];

    if (span.href) {
      const defKey = `${blockKey}-link${index}`;
      markDefs.push({ _key: defKey, _type: 'link', href: span.href });
      marks.push(defKey);
    }

    return { _type: 'span' as const, _key: `${blockKey}-s${index}`, text: span.text, marks };
  });

  return { children, markDefs };
}

async function toSanityBody(blocks: StoryBlock[]): Promise<(SanityBodyBlock | SanityBodyImage)[]> {
  const result: (SanityBodyBlock | SanityBodyImage)[] = [];

  for (const block of blocks) {
    if (block._type === 'image') {
      const assetId = await uploadImage(block.image.src);
      result.push({
        _type: 'image',
        _key: block._key,
        asset: { _type: 'reference', _ref: assetId },
        alt: block.image.alt,
        caption: block.caption,
      });
      continue;
    }

    if (block._type === 'heading') {
      const { children, markDefs } = toSanitySpans([block.text], block._key);
      result.push({ _type: 'block', _key: block._key, style: block.level === 2 ? 'h2' : 'h3', children, markDefs });
      continue;
    }

    const { children, markDefs } = toSanitySpans(block.spans, block._key);
    result.push({ _type: 'block', _key: block._key, style: 'normal', children, markDefs });
  }

  return result;
}

async function toStoryPostDoc(entry: StoryEntry) {
  const mainImageAssetId = await uploadImage(entry.image.src);

  const doc: Record<string, unknown> = {
    _id: entry._id,
    _type: 'storyPost',
    title: entry.title,
    slug: { _type: 'slug', current: entry.slug },
    publishedAt: entry.publishedAt,
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: mainImageAssetId },
      alt: entry.image.alt,
    },
  };

  if (entry.article) {
    doc.excerpt = { vi: entry.article.content.vi.excerpt, en: entry.article.content.en.excerpt };
    doc.readingMinutes = entry.article.readingMinutes;
    doc.author = { name: entry.article.author.name };
    doc.body = {
      vi: await toSanityBody(entry.article.content.vi.body),
      en: await toSanityBody(entry.article.content.en.body),
    };
  }

  return doc;
}

async function main() {
  for (const entry of storyEntries) {
    const doc = await toStoryPostDoc(entry);
    await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0]);
    console.log(`✓ ${entry.slug} (${entry.article ? 'article' : 'teaser only'})`);
  }
  console.log(`\nSeeded ${storyEntries.length} storyPost documents.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
