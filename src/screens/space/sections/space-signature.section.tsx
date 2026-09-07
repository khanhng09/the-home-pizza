import { getTranslations } from "next-intl/server";
import { SpaceGallerySlider } from "../components/space-gallery-slider";
import { spaceLocations, type SpaceLocation } from "../constants/space.constant";
import { Reveal } from "@/shared/components/ui/reveal";
import { CREAM_PAPER_TILE, CREAM_PAPER_TILE_SIZE } from "@/shared/constants/texture.constant";
import { responsiveImage } from "@/shared/lib/image";
import { cn } from "@/shared/lib/utils";

/**
 * Geometry notes below quote the Figma frames 1:1 — desktop from the
 * 1400-wide frame, mobile from the 430-wide one. The desktop band is
 * 122 + 411 + 122 = 655px tall and the mobile one 40 + 356 + 35 + 227 + 40
 * = 698, which is where every fixed number in here comes from.
 */

interface LocationCopy {
  heading: string;
  heroAlt: string;
  paragraphs: string[];
  galleryAlts: string[];
}

function LocationHero({
  location,
  copy,
  isFirst,
}: {
  location: SpaceLocation;
  copy: LocationCopy;
  isFirst: boolean;
}) {
  const headingID = `space-${location.id}-heading`;
  const Heading = isFirst ? "h1" : "h2";
  const hero = responsiveImage(location.hero.src);
  const heroMobile = location.heroMobile ? responsiveImage(location.heroMobile.src) : null;

  return (
    // The comp draws the hero at the full height of the viewport it was
    // laid out on (934 of ~934), with the translucent fixed header sitting
    // over the top of the photo — hence `svh` rather than a fixed 934px,
    // which overflowed every laptop screen. Below `lg` it keeps the mobile
    // frame's own 287/430 ratio instead.
    //
    // `id` makes `/space#phu-quoc` a shareable link to this house. It sits
    // on the hero so arriving lands on the title card, with the header
    // over the photo as drawn — nothing for a scroll offset to compensate
    // for.
    <section
      id={location.slug}
      aria-labelledby={headingID}
      className="relative h-svh min-h-fit overflow-hidden bg-ink"
    >
      <picture>
        {heroMobile && location.heroMobile ? (
          <source media="(max-width: 1023px)" srcSet={heroMobile.srcSet ?? heroMobile.src} sizes="100vw" />
        ) : null}
        <img
          src={hero.src}
          srcSet={hero.srcSet}
          alt={copy.heroAlt}
          width={location.hero.width}
          height={location.hero.height}
          sizes="100vw"
          loading={isFirst ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={isFirst ? "high" : undefined}
          className="absolute inset-0 size-full object-cover"
        />
      </picture>

      <div className="absolute inset-x-0 bottom-[10px] lg:bottom-[55px]">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-[52px]">
          <Reveal variant="slide-up">
            <Heading
              id={headingID}
              className="font-display leading-[1.2] text-cream text-[clamp(1.75rem,8.37vw,2.25rem)] lg:max-w-[966px] lg:text-[clamp(3.5rem,7.14vw,6.25rem)]"
            >
              {copy.heading}
            </Heading>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * The scrolling copy panel. The design's gold hairline beside the text is
 * the panel's own scrollbar, not decoration — see `.scrollbar-space` in
 * `globals.css`, and the same treatment on /humans and /story.
 *
 * Widths are set so the *content* lands on the design's measure once the
 * scrollbar and the gap the comp leaves in front of it are subtracted:
 * 416 − 17 − 6 = 393 on desktop, 294 − 18 − 3 = 273 on mobile.
 */
function LocationCopyPanel({ paragraphs, isDark }: { paragraphs: string[]; isDark: boolean }) {
  return (
    <div
      className={cn(
        "scrollbar-space flex h-[356px] w-full flex-col gap-5 overflow-y-scroll pr-[18px] font-sans text-sm leading-[1.4] lg:h-[411px] lg:gap-7 lg:pr-[17px] lg:text-xl",
        isDark ? "text-cream" : "text-ink"
      )}
    >
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function LocationStory({ location, copy }: { location: SpaceLocation; copy: LocationCopy }) {
  const isDark = location.theme === "dark";

  return (
    <section
      className={cn(
        // 655px desktop / 669px mobile — already inside one screen at both
        // breakpoints, so this only needs anchoring, not a height cap.
        "section-anchor relative flex flex-col justify-center overflow-hidden lg:block",
        isDark ? "bg-deep" : "bg-cream"
      )}
    >
      {!isDark ? (
        <>
          {/* Cream paper grain, tiled in both axes at a DPR-correct size
              rather than stretched to the section's width. Same treatment
              as StoryBackdrop. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-repeat lg:hidden"
            style={{
              backgroundImage: `url(${CREAM_PAPER_TILE.mobile})`,
              backgroundSize: CREAM_PAPER_TILE_SIZE.mobile,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-repeat lg:block"
            style={{
              backgroundImage: `url(${CREAM_PAPER_TILE.desktop})`,
              backgroundSize: CREAM_PAPER_TILE_SIZE.desktop,
            }}
          />
        </>
      ) : null}

      {/* One flex row per band, mirrored by theme: the light one runs copy
          left / photos bleeding off the right edge, the dark one the other
          way round. Below `lg` both stack, and the strip goes full-bleed.
          The copy column carries the band's 52px outer inset in its own
          width (416 + 52 = 468) so the strip can still reach the edge.
          `w-full` rather than leaving `width` to resolve on its own: the
          gallery's filmstrip scrolls its photos in one un-wrapped row, so
          without a definite width to stretch into, this flex item's own
          shrink-to-fit size follows that row's full unscrolled content
          width (past `max-w-[1400px]`) instead of the viewport — and
          `mx-auto` then centers that oversized box, pushing every child off
          both edges of the screen. */}
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-[35px] py-10 lg:h-[655px] lg:flex-row lg:items-center lg:gap-6 lg:py-0">
        <Reveal
          variant={isDark ? "slide-left" : "slide-right"}
          className={cn(
            "mx-auto w-[68.4%] max-w-[294px] shrink-0 lg:mx-0 lg:w-[468px] lg:max-w-none",
            isDark ? "lg:order-2 lg:pr-[52px]" : "lg:order-1 lg:pl-[52px]"
          )}
        >
          <LocationCopyPanel paragraphs={copy.paragraphs} isDark={isDark} />
        </Reveal>

        <Reveal
          variant={isDark ? "slide-right" : "slide-left"}
          delayMs={180}
          className={cn("min-w-0 lg:flex-1", isDark ? "lg:order-1" : "lg:order-2")}
        >
          <SpaceGallerySlider
            photos={location.gallery}
            alts={copy.galleryAlts}
            className="h-[min(52.8vw,227px)] lg:h-[411px]"
          />
        </Reveal>
      </div>
    </section>
  );
}

export async function SpaceSignatureSection() {
  const t = await getTranslations("spacePage");

  return (
    <article>
      {spaceLocations.map((location, index) => {
        const city = t(`locations.${location.id}.city`);
        const copy: LocationCopy = {
          heading: t(`locations.${location.id}.heading`),
          heroAlt: t(`locations.${location.id}.heroAlt`),
          paragraphs: t.raw(`locations.${location.id}.paragraphs`) as string[],
          // One alt per photo, numbered. The folder is a run of ambiance
          // shots with no individually describable subject, so numbering
          // them is what actually distinguishes one from the next for a
          // screen reader — repeating a single caption ten times would not.
          galleryAlts: location.gallery.map((_, position) =>
            t('galleryPhotoAlt', { city, index: position + 1, total: location.gallery.length })
          ),
        };

        return (
          <div key={location.id}>
            <LocationHero location={location} copy={copy} isFirst={index === 0} />
            <LocationStory location={location} copy={copy} />
          </div>
        );
      })}
    </article>
  );
}
