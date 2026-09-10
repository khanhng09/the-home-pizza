import { getTranslations } from 'next-intl/server';
import { StoryImageSlider } from '../components/story-image-slider';
import {
  STORY_COLLAGE_CANVAS,
  storyHeroBand,
  storyPhotoById,
  storyPhotoSizes,
} from '../constants/story.constant';
import { Illustration } from '@/shared/components/illustrations/illustration';
import { Reveal } from '@/shared/components/ui/reveal';
import { responsiveImage } from '@/shared/lib/image';

/**
 * Desktop is a fixed collage, so it is laid out the way the design is
 * drawn: one box of a known aspect ratio with every element positioned as
 * a percentage of it. Percentages rather than pixels mean the whole
 * composition scales with the viewport instead of drifting apart at
 * widths other than the 1400px the design was drawn at.
 *
 * Every number below is `<figma px> / 1400` (x, width) or `/ 870` (y,
 * height), where 870 is the collage's height on that canvas — measured
 * from the bottom of the roofline band down to the last photo.
 */
const DESKTOP_CANVAS = STORY_COLLAGE_CANVAS;
const px = (value: number, axis: 'x' | 'y') =>
  `${((value / (axis === 'x' ? DESKTOP_CANVAS.width : DESKTOP_CANVAS.height)) * 100).toFixed(3)}%`;

/** Scrollbar styling shared by the desktop and mobile copy panels. The
 * design draws track and thumb in the same gold/40, which leaves no
 * visible scroll affordance at all — the thumb is lifted to gold so
 * the control reads as draggable while the resting state still looks
 * like the design's single gold hairline. */
const SCROLLBAR =
  '[scrollbar-color:color-mix(in_oklab,var(--palette-gold)_70%,transparent)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gold/70 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gold/30';

export async function StoryIntroSection() {
  const t = await getTranslations('storyPage.intro');
  const paragraphs = t.raw('paragraphs') as string[];
  const heroBand = responsiveImage(storyHeroBand.src);

  const chefOven = storyPhotoById['chef-oven'];
  const exterior = storyPhotoById['exterior'];
  const kitchenStaff = storyPhotoById['kitchen-staff'];
  const plateDetail = storyPhotoById['plate-detail'];
  const dishDetail = storyPhotoById['dish-detail'];
  const diningRoom = storyPhotoById['dining-room'];

  /** The collage photos, in the four corner slots + two small squares the
   * design places them in. Kept as data so the markup below stays a flat
   * list of positioned boxes rather than six near-identical blocks.
   *
   * Slot widths come from each photo's own `collageWidth` rather than being
   * repeated here — `storyPhotoSizes()` reads the same field to build the
   * `sizes` attribute, and the two have to describe the same box or the
   * browser downloads a variant that doesn't match what it paints. */
  const collage = [
    // Left column — tall chef portrait above the kitchen shot.
    { photo: chefOven, style: { left: 0, top: px(77, 'y'), width: px(chefOven.collageWidth, 'x'), height: px(354, 'y') }, reveal: 'slide-right' as const, delay: 0 },
    { photo: kitchenStaff, style: { left: px(3, 'x'), top: px(574, 'y'), width: px(kitchenStaff.collageWidth, 'x'), height: px(197, 'y') }, reveal: 'slide-right' as const, delay: 220 },
    // Right column — exterior above the dining room.
    { photo: exterior, style: { right: 0, top: px(67, 'y'), width: px(exterior.collageWidth, 'x'), height: px(196, 'y') }, reveal: 'slide-left' as const, delay: 0 },
    { photo: diningRoom, style: { right: 0, top: px(500, 'y'), width: px(diningRoom.collageWidth, 'x'), height: px(346, 'y') }, reveal: 'slide-left' as const, delay: 220 },
    // The two small squares that sit inboard of each column.
    { photo: plateDetail, style: { left: px(276, 'x'), top: px(645, 'y'), width: px(plateDetail.collageWidth, 'x'), height: px(126, 'y') }, reveal: 'fade' as const, delay: 380 },
    { photo: dishDetail, style: { left: px(1004, 'x'), top: px(645, 'y'), width: px(dishDetail.collageWidth, 'x'), height: px(126, 'y') }, reveal: 'fade' as const, delay: 380 },
  ];

  return (
    // Transparent — the paper texture and cream base come from
    // StoryBackdrop, which wraps every section on this screen so the grain
    // runs continuously across their boundaries.
    // `.section-screen` still targets one screen first, but only the
    // desktop collage below still relies on a definite height + its own
    // internal scroll — its copy box is one absolutely-positioned tile
    // among six photos pinned by fixed percentages, so letting it grow
    // would run text over the neighbouring photos rather than past the
    // section. The mobile copy block has no such neighbours and now grows
    // the section (and lets the page scroll) instead of hiding text behind
    // a scrollbar — see the comment on its paragraph list below.
    <section className="section-anchor section-screen relative flex flex-col">
      {/* Wavy roofline band — full-bleed, tucked under the fixed header at
          the very top of the page. The design scales the artwork to 156%
          of the band's height and anchors it to the bottom, cropping the
          top away, so the wave reads deeper than the source's own aspect
          ratio would give. Likely the LCP candidate, hence eager/high. */}
      <div className="relative h-[23vw] max-h-[99px] w-screen shrink-0 overflow-hidden lg:h-[17.07vw] lg:max-h-[239px]">
        <img
          src={heroBand.src}
          srcSet={heroBand.srcSet}
          alt=""
          aria-hidden="true"
          width={storyHeroBand.width}
          height={storyHeroBand.height}
          sizes="100vw"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-x-0 bottom-0 h-auto w-full object-contain"
        />
      </div>

      {/* No `min-h-0` here (or anywhere in the mobile block further down):
          it doesn't just let this row shrink below its children's content —
          it also zeroes this row's contribution to `.section-screen`'s own
          `min-height: fit-content` calculation on the ancestor `<section>`,
          which otherwise can't tell the section needs to grow past one
          screen. Confirmed the desktop collage's `lg:h-full` still resolves
          fine without it — flex layout gives this row a definite computed
          height regardless. */}
      <div className="relative flex flex-1 flex-col">
        {/* ---------- Desktop collage ----------
            Height-driven, not width-driven. The 1400x870 canvas used to
            resolve its height from the full viewport width (796px at 1280,
            which with the roofline band put the section at 1014 — 340 past
            a 720p laptop). Anchoring it to the leftover band and letting
            the *width* follow from the same aspect ratio keeps every
            percentage offset inside the collage exactly where it was
            drawn, at whatever scale the screen allows. Same move as the
            home menu panel. */}
        <div
          className="relative mx-auto hidden min-h-0 w-full flex-1 lg:block lg:h-full lg:w-auto"
          style={{ aspectRatio: `${DESKTOP_CANVAS.width} / ${DESKTOP_CANVAS.height}` }}
        >
          {/* Positioning stays on a plain wrapper rather than on Reveal —
              Framer Motion writes its own inline `transform`/`opacity`
              onto the element it animates, so geometry and animation are
              kept on separate nodes throughout this collage. */}
          {collage.map(({ photo, style, reveal, delay }) => {
            const image = responsiveImage(photo.src);
            return (
              <div key={photo.id} className="absolute z-2" style={style}>
                <Reveal variant={reveal} delayMs={delay} className="h-full">
                  <img
                    src={image.src}
                    srcSet={image.srcSet}
                    alt={t(`photoAlts.${photo.id}`)}
                    width={photo.width}
                    height={photo.height}
                    sizes={storyPhotoSizes(photo)}
                    loading="lazy"
                    // `loading="lazy"` does nothing for this subtree below
                    // `lg`, where it is `display: none`: with no layout box
                    // there is nothing for the browser to defer against, so
                    // all six photos are fetched at once — on mobile, while
                    // the roofline band above is still trying to become the
                    // LCP. They can't be dropped (the filmstrip renders the
                    // same URLs), but they can be told to wait their turn.
                    fetchPriority="low"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </Reveal>
              </div>
            );
          })}

          <Illustration
            name="dong-ho-pizza-dough"
            className="absolute text-gold z-1"
            style={{ left: px(114, 'x'), top: px(367, 'y'), width: px(215, 'x'), height: px(138, 'y') }}
          />
          <Illustration
            name="dong-ho-ghe"
            className="absolute text-gold z-1"
            style={{ left: px(1129, 'x'), top: px(325, 'y'), width: px(238, 'x'), height: px(135, 'y') }}
          />
          <Illustration
            name="dong-ho-hoi-que"
            className="absolute text-gold z-1"
            style={{ left: px(459, 'x'), top: px(655, 'y'), width: px(160, 'x'), height: px(105, 'y') }}
          />

          {/* Centering lives on this wrapper, not on Reveal — Framer Motion
              writes its own inline `transform`, which would clobber the
              `-translate-x-1/2` that centers the heading. */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: '50%', top: px(124, 'y'), width: px(734, 'x') }}
          >
            <Reveal variant="fade">
              <h1 className="text-center font-display leading-[1.2] text-foreground whitespace-nowrap text-[clamp(3rem,7.14vw,6.5rem)]">
                {t('heading')}
              </h1>
            </Reveal>
          </div>

          <div
            className="absolute"
            style={{ left: px(350, 'x'), top: px(191, 'y'), width: px(700, 'x'), height: px(422, 'y') }}
          >
            <Reveal variant="slide-up" delayMs={150} className="h-full">
              {/* `overflow-y: auto` is exactly the requested behaviour —
                  the scrollbar only appears once the copy is taller than
                  this fixed-height panel. */}
              <div
                className={`flex h-full flex-col gap-4 overflow-y-scroll pr-4 text-justify font-sans leading-[1.4] text-foreground text-[clamp(0.875rem,1.43vw,1.25rem)] ${SCROLLBAR}`}
              >
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* ---------- Mobile ----------
            Offsets below are the design's own, measured from the bottom of
            the roofline band on its 430px canvas. Kept in px rather than
            percentages because these three illustrations are meant to run
            off the edge at a constant size — scaling them by viewport
            width would pull them back into the text column on a 320px
            phone. */}
        {/* No `overflow-hidden` here any more — the page's own
            `overflow-x-hidden` on `<body>` (see `[locale]/layout.tsx`)
            already clips the illustrations' horizontal bleed, and setting
            it again here would force `overflow-y` to compute to `auto`
            too (browsers require the other axis to leave `visible` once
            one axis isn't) — right back to an internal scroll trap. */}
        <div className="relative flex flex-1 flex-col pt-11 lg:hidden">
          <Illustration
            name="dong-ho-ghe"
            className="absolute -right-9 top-10 h-[61px] w-[106px] text-gold z-1"
          />
          <Illustration
            name="dong-ho-pizza-dough"
            className="absolute -left-8 top-[94px] h-[62px] w-24 text-gold z-1"
          />
          <Illustration
            name="dong-ho-hoi-que"
            className="absolute -left-[18px] top-[501px] h-[51px] w-[77px] text-gold z-1"
          />

          <div className="container-base relative flex flex-1 flex-col">
            <Reveal variant="fade" className="shrink-0">
              <h1 className="text-center font-display whitespace-nowrap text-foreground text-[clamp(2.5rem,9.46vw,2.75rem)]">
                {t('heading')}
              </h1>
            </Reveal>

            {/* Used to be pinned to a fixed share of the screen with its own
                internal `overflow-y-auto`, which hid text behind a
                scrollbar the moment a translation ran long. No `min-h-0`
                now: the paragraph list keeps its automatic minimum size, so
                it grows the section (and the page scrolls) instead. */}
            <Reveal variant="slide-up" delayMs={150} className="mt-1 flex-1">
              <div className="mx-auto flex max-w-[285px] flex-col gap-4 pr-3 text-justify font-sans text-sm leading-[1.4] text-foreground">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Full-bleed photo strip — sits outside container-base because
              the design runs it edge to edge. */}
          <Reveal variant="fade" delayMs={250} className="mt-7">
            <StoryImageSlider />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
