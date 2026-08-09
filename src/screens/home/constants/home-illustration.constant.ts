/**
 * Where every đông hồ illustration sits on the home screen, taken straight
 * from the design.
 *
 * Two things this file exists to fix, both of which came from placing these
 * by eye with Tailwind `h-*`/`w-*`/`top-*` utilities:
 *
 * 1. **Boxes have to match the artwork's own aspect ratio.** `Illustration`
 *    paints a CSS mask with `mask-size: contain`, so a box of the wrong
 *    ratio letterboxes the art — it renders smaller than the box *and* gets
 *    centred inside it, which quietly shifts it down. A 144x144 box around
 *    `cua` (natural 1.47) drew it at 144x98 and 23px lower than the `top`
 *    said. Every `ratio` below is the design's box, which matches the
 *    artwork in all 13 cases — a good check that the design is the source of
 *    truth here.
 *
 * 2. **Offsets have to be relative to the section, not to whichever inner
 *    panel the markup happened to nest them in.** Percentages resolve
 *    against the containing block, so `HomeIllustrationLayer` spans the
 *    whole section and every number here is a share of that box: `left` and
 *    `width` of its width, `top` of its height.
 *
 * Numbers are `<figma px> / <canvas>` — desktop off the 1400x5045 frame
 * (`541:73`), mobile off the 430x4818 one (`905:371`) — with `top` measured
 * from each section's own top edge rather than the page's:
 *
 *              desktop            mobile
 *   story      934 - 1847  (913)  1050 - 1981  (931)
 *   menu      1847 - 2761  (914)  1981 - 2913  (932)
 *   human     2761 - 3771 (1010)  2913 - 3515  (602)
 *   location  3771 - 4685  (914)  3515 - 4447  (932)
 *
 * The desktop section heights are enforced (see `lg:min-h-*` on the menu and
 * human sections) so these land on the design's pixels. Mobile heights stay
 * content-driven — the human and location sections run taller there than the
 * design's frame because the link lists wrap — so a percentage keeps each
 * illustration at the same relative point in the section instead of drifting
 * off the end of it.
 */
import type { IllustrationName } from '@/shared/components/illustrations/illustration';

export interface HomeIllustrationPlacement {
  name: IllustrationName;
  /** Share of the section's width. */
  left: string;
  /** Share of the section's height, from its top edge. */
  top: string;
  /** Share of the section's width. */
  width: string;
  /** The artwork's own ratio, as `aspect-ratio`. Never invent one — read it
   * off the design's box, which matches the source file. */
  ratio: string;
}

export interface HomeIllustrationSet {
  /** Tailwind colour for this section's illustrations. Kept per section
   * because the cream sections and the dark ones were already tuned
   * differently, and this refactor is about geometry only. */
  tone: string;
  /** Below `lg`. The design's mobile frame drops two illustrations the
   * desktop one has — `bo` from the human section and `banh-da` from
   * location — so these lists are not just rescaled copies. */
  mobile: HomeIllustrationPlacement[];
  desktop: HomeIllustrationPlacement[];
}

export type HomeIllustrationSectionId = 'story' | 'menu' | 'human' | 'location';

export const homeIllustrations: Record<HomeIllustrationSectionId, HomeIllustrationSet> = {
  story: {
    tone: 'text-gold',
    // `dổi` — not `hung-que`, which is what the markup used to render here.
    mobile: [
      { name: 'dong-ho-doi', left: '71.163%', top: '0%', width: '25.116%', ratio: '108 / 83' },
      { name: 'dong-ho-tom', left: '3.721%', top: '18.367%', width: '20.465%', ratio: '88 / 42' },
      { name: 'dong-ho-hen', left: '62.093%', top: '40.064%', width: '34.186%', ratio: '147 / 88' },
    ],
    desktop: [
      { name: 'dong-ho-doi', left: '41.857%', top: '0%', width: '11.500%', ratio: '161 / 123' },
      { name: 'dong-ho-tom', left: '3.714%', top: '25.630%', width: '17.500%', ratio: '245 / 117' },
      { name: 'dong-ho-hen', left: '90.143%', top: '21.468%', width: '13.643%', ratio: '191 / 114' },
    ],
  },

  menu: {
    tone: 'text-accent/70',
    mobile: [
      { name: 'dong-ho-tre', left: '72.558%', top: '2.575%', width: '23.488%', ratio: '101 / 102' },
      { name: 'dong-ho-tieu', left: '45.581%', top: '21.137%', width: '18.605%', ratio: '80 / 52' },
      { name: 'dong-ho-nhum', left: '86.279%', top: '30.687%', width: '9.767%', ratio: '42 / 43' },
    ],
    desktop: [
      { name: 'dong-ho-tre', left: '36.143%', top: '4.267%', width: '11.714%', ratio: '164 / 166' },
      { name: 'dong-ho-tieu', left: '20.143%', top: '40.700%', width: '9.286%', ratio: '130 / 84' },
      { name: 'dong-ho-nhum', left: '41.357%', top: '88.731%', width: '5.857%', ratio: '82 / 85' },
    ],
  },

  human: {
    tone: 'text-gold',
    // The basil rides slightly above the section's top edge, overlapping the
    // menu photo above it — as drawn.
    mobile: [
      { name: 'dong-ho-hung-que', left: '39.070%', top: '-1.827%', width: '29.535%', ratio: '127 / 107' },
      { name: 'dong-ho-tieu', left: '77.674%', top: '55.814%', width: '27.907%', ratio: '120 / 78' },
      { name: 'dong-ho-cua', left: '3.488%', top: '77.243%', width: '20.698%', ratio: '89 / 60' },
    ],
    desktop: [
      { name: 'dong-ho-hung-que', left: '53.714%', top: '2.376%', width: '11.857%', ratio: '166 / 139' },
      { name: 'dong-ho-cua', left: '2.071%', top: '34.950%', width: '15.571%', ratio: '218 / 148' },
      { name: 'dong-ho-tieu', left: '87.500%', top: '54.356%', width: '11.929%', ratio: '167 / 109' },
      { name: 'dong-ho-bo', left: '8.429%', top: '77.624%', width: '8.929%', ratio: '125 / 117' },
    ],
  },

  location: {
    tone: 'text-gold',
    mobile: [
      { name: 'dong-ho-hung-que', left: '4.186%', top: '17.597%', width: '20.000%', ratio: '86 / 73' },
      { name: 'dong-ho-ngheu', left: '63.256%', top: '24.893%', width: '32.326%', ratio: '139 / 89' },
    ],
    desktop: [
      { name: 'dong-ho-hung-que', left: '4.214%', top: '25.602%', width: '9.143%', ratio: '128 / 108' },
      { name: 'dong-ho-ngheu', left: '36.714%', top: '50.000%', width: '9.929%', ratio: '139 / 89' },
      { name: 'dong-ho-banh-da', left: '15.214%', top: '90.810%', width: '18.000%', ratio: '252 / 168' },
    ],
  },
};
