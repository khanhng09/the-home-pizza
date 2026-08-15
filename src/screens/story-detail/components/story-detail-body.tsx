import type { ReactNode } from 'react';
import type {
  StoryBlock,
  StoryMark,
  StorySpan,
  StorySpanInput,
} from '@/shared/types/story-content.type';
import { sanityResponsiveImage } from '@/shared/lib/sanity/image';

/**
 * Renders one article body — the ordered list of typed blocks the content
 * source returns.
 *
 * This is the Portable Text serializer pattern: switch on `_type`, emit a
 * React element per block. Two things follow from it that matter here.
 *
 * The first is security. Nothing in this file reaches for
 * `dangerouslySetInnerHTML`, because nothing it receives is HTML — a
 * paragraph is an array of `{ text, marks }`, and an image is an asset
 * reference. Text goes through JSX, which escapes it. A block whose
 * `_type` this file does not know renders as `null` rather than as unknown
 * markup, so a new block type added in the CMS degrades to a gap instead of
 * breaking the page. The one field that could still carry an injection is
 * a link's `href`, which `safeHref` allow-lists by scheme.
 *
 * The second is layout control. Each block type gets its own classes, which
 * is what makes it possible to hit the design exactly — a `.prose`-style
 * descendant selector over a blob of CMS HTML could not give the image
 * blocks their own aspect ratios and caption treatment.
 */

/** Aspect ratios the design crops body images to: the opening image is
 * near-square, the ones further down are landscape. Both are fixed boxes
 * with `object-cover` inside, so an editor uploading a portrait shot can't
 * change the page's rhythm — and the box is reserved before the file
 * arrives, so nothing shifts. */
const LEAD_IMAGE_RATIO = '856 / 876';
const IMAGE_RATIO = '856 / 576';

const MARK_CLASS: Record<StoryMark, string> = {
  strong: 'font-semibold',
  em: 'italic',
};

/** Only `http(s)`, in-site paths, `mailto:` and `tel:` survive. Anything
 * else — `javascript:` above all — loses its link and renders as plain
 * text, so a malformed or hostile value degrades instead of executing. */
function safeHref(href: string): string | null {
  const value = href.trim();
  if (value.startsWith('/') || value.startsWith('#')) return value;
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  return null;
}

function toSpan(span: StorySpanInput): StorySpan {
  return typeof span === 'string' ? { text: span } : span;
}

function renderSpans(spans: StorySpanInput[]): ReactNode[] {
  return spans.map((input, index) => {
    const span = toSpan(input);
    const className = span.marks?.map((mark) => MARK_CLASS[mark]).filter(Boolean).join(' ');

    const content = className ? <span className={className}>{span.text}</span> : span.text;
    const href = span.href ? safeHref(span.href) : null;
    const key = `${index}-${span.text.slice(0, 12)}`;

    if (!href) return <span key={key}>{content}</span>;

    // External links get the usual `noopener` pairing; an editor should not
    // have to remember it per link.
    const external = /^https?:/i.test(href);
    return (
      <a
        key={key}
        href={href}
        className="underline underline-offset-4 transition-colors hover:text-gold"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  });
}

export function StoryDetailBody({ blocks }: { blocks: StoryBlock[] }) {
  // Only the first image is treated as the lead visual; the design gives it
  // a taller crop than the ones that follow. Resolved up front rather than
  // tracked while mapping, so rendering stays free of side effects.
  const leadImageKey = blocks.find((block) => block._type === 'image')?._key;

  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case 'paragraph':
            return (
              <p
                key={block._key}
                className="font-sans text-sm leading-[1.4] text-cream lg:text-xl"
              >
                {renderSpans(block.spans)}
              </p>
            );

          case 'heading': {
            const Tag = block.level === 2 ? 'h2' : 'h3';
            return (
              <Tag
                key={block._key}
                className="font-display leading-[1.2] text-cream text-[1.75rem] lg:text-[2.5rem]"
              >
                {block.text}
              </Tag>
            );
          }

          case 'image': {
            const isLead = block._key === leadImageKey;
            const source = sanityResponsiveImage(block.image);

            return (
              <figure key={block._key} className="flex flex-col gap-3">
                <div
                  className="w-full overflow-hidden"
                  style={{ aspectRatio: isLead ? LEAD_IMAGE_RATIO : IMAGE_RATIO }}
                >
                  <img
                    src={source.src}
                    srcSet={source.srcSet}
                    alt={block.image.alt}
                    width={block.image.width}
                    height={block.image.height}
                    sizes="(min-width: 888px) 856px, calc(100vw - 32px)"
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="font-sans text-xs italic leading-[1.4] text-cream lg:text-base">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          default:
            // An unrecognised block type — a new one added in the CMS
            // before this serializer knows about it. Rendering nothing is
            // the safe failure here.
            return null;
        }
      })}
    </>
  );
}
