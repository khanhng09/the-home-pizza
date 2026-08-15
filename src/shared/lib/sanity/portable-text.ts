import type { StoryBlock, StoryMark, StorySpanInput } from '@/shared/types/story-content.type';

/** What the GROQ query in `story-content.ts` actually returns per body
 * entry — Sanity's native Portable Text block/image shape, with the image
 * asset already dereferenced to a flat url/width/height. */
export interface RawPortableTextBlock {
  _key: string;
  _type: 'block' | 'image';
  style?: string;
  children?: { text: string; marks?: string[] }[];
  markDefs?: { _key: string; href?: string }[];
  alt?: string;
  caption?: string;
  src?: string;
  width?: number;
  height?: number;
}

const KNOWN_MARKS: readonly string[] = ['strong', 'em'] satisfies StoryMark[];

function isKnownMark(mark: string): mark is StoryMark {
  return KNOWN_MARKS.includes(mark);
}

/** A span's `marks` array mixes two things Portable Text doesn't
 * distinguish by shape: decorator names (`strong`) and `markDefs` keys
 * (an id pointing at an annotation object elsewhere in the same block,
 * e.g. a link's `href`). This is the join between the two. */
function toSpans(block: RawPortableTextBlock): StorySpanInput[] {
  const markDefs = block.markDefs ?? [];

  return (block.children ?? []).map((child) => {
    const marks = (child.marks ?? []).filter(isKnownMark);
    const linkDef = (child.marks ?? [])
      .map((mark) => markDefs.find((def) => def._key === mark))
      .find((def) => def?.href);

    if (!marks.length && !linkDef) return child.text;
    return { text: child.text, marks: marks.length ? marks : undefined, href: linkDef?.href };
  });
}

/**
 * Sanity's raw Portable Text -> the app's existing `StoryBlock` union
 * (`shared/types/story-content.type.ts`). Kept as a plain function rather
 * than folded into the GROQ query: resolving a link mark means joining a
 * span against `markDefs` by key, which is fiddly to express (and to
 * unit-test) as a query string but straightforward as code.
 *
 * A block missing data the union requires (an image with no `alt`, say)
 * is dropped rather than rendered half-broken — same failure mode the
 * existing serializer already uses for an unrecognised `_type`.
 */
export function toStoryBlocks(rawBlocks: RawPortableTextBlock[] | null | undefined): StoryBlock[] {
  if (!rawBlocks) return [];

  return rawBlocks.flatMap((block): StoryBlock[] => {
    if (block._type === 'image') {
      if (!block.src || !block.width || !block.height || !block.alt) return [];
      return [
        {
          _type: 'image',
          _key: block._key,
          image: { src: block.src, width: block.width, height: block.height, alt: block.alt },
          caption: block.caption,
        },
      ];
    }

    if (block.style === 'h2' || block.style === 'h3') {
      const text = (block.children ?? []).map((child) => child.text).join('');
      return [{ _type: 'heading', _key: block._key, level: block.style === 'h2' ? 2 : 3, text }];
    }

    return [{ _type: 'paragraph', _key: block._key, spans: toSpans(block) }];
  });
}
