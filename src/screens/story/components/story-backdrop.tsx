import type { ReactNode } from 'react';
import { storyBackdropContent } from '../constants/story.constant';
import { optimizedImage } from '@/shared/lib/image';

/**
 * The paper texture behind the whole /story screen.
 *
 * One layer wrapping every section rather than one layer per section —
 * which is also how the design draws it (a single texture node spanning
 * from just under the header down to the footer, not one per band). Two
 * `bg-cover` layers of the same image at different heights each resolve
 * the pattern to their own box, so the grain visibly restarts at the
 * boundary between them; a single element cannot seam against itself.
 *
 * Tiled vertically at natural width instead of `cover`: the screen runs
 * roughly 2.4x taller than the texture renders at full width, so `cover`
 * would scale the grain up by that much and read as a blur. `repeat-y`
 * keeps it at the size the design uses.
 */
export function StoryBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-top bg-[length:100%_auto] bg-repeat-y lg:hidden"
        style={{ backgroundImage: `url(${optimizedImage(storyBackdropContent.backgroundImageMobile)})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-top bg-[length:100%_auto] bg-repeat-y lg:block"
        style={{ backgroundImage: `url(${optimizedImage(storyBackdropContent.backgroundImage)})` }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
