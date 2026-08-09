import {
  homeIllustrations,
  type HomeIllustrationSectionId,
} from '../constants/home-illustration.constant';
import { Illustration } from '@/shared/components/illustrations/illustration';
import { cn } from '@/shared/lib/utils';

/**
 * Paints one home section's đông hồ illustrations.
 *
 * Rendered as a full-bleed layer so the section itself is the containing
 * block every offset in `home-illustration.constant.ts` resolves against —
 * which is the whole point, since the design measures them from the section
 * edge while the markup nests its content in panels and grids that start
 * somewhere else.
 *
 * Drop it as a direct child of a `relative` section. It does not clip: a
 * couple of these bleed past the section edge on purpose (the story's `dổi`
 * at the top, the human section's basil above it on mobile), so clipping is
 * left to whichever section actually wants it.
 */
export function HomeIllustrationLayer({ section }: { section: HomeIllustrationSectionId }) {
  const { tone, mobile, desktop } = homeIllustrations[section];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-1">
      {mobile.map((item) => (
        <Illustration
          key={`sm-${item.name}`}
          name={item.name}
          className={cn('absolute lg:hidden', tone)}
          style={{ left: item.left, top: item.top, width: item.width, aspectRatio: item.ratio }}
        />
      ))}

      {desktop.map((item) => (
        <Illustration
          key={`lg-${item.name}`}
          name={item.name}
          className={cn('absolute hidden lg:block', tone)}
          style={{ left: item.left, top: item.top, width: item.width, aspectRatio: item.ratio }}
        />
      ))}
    </div>
  );
}
