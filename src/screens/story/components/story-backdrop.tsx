import type { ReactNode } from 'react';
import { CREAM_PAPER_TILE, CREAM_PAPER_TILE_SIZE } from '@/shared/constants/texture.constant';

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
 * Tiled in both axes at a small, DPR-correct size instead of `cover` or a
 * full-width stretch: painting the whole photo across the section's width
 * would need roughly its native resolution doubled to stay sharp on a 2x
 * display, which the source doesn't have — see `CREAM_PAPER_TILE_SIZE`.
 */
export function StoryBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-cream overflow-x-hidden">
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
      <div className="relative">{children}</div>
    </div>
  );
}
