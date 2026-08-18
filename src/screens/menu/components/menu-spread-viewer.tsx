'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { IcChevronLeft, IcChevronRight } from '@/shared/components/icons';
import { MENU_PANEL_SIZES, MenuPageFlip } from '@/shared/components/ui/menu-page-flip';
import type { MenuSpread } from '@/shared/constants/menu-spreads.constant';
import { CREAM_PAPER_TILE, CREAM_PAPER_TILE_SIZE } from '@/shared/constants/texture.constant';
import { useMediaQuery } from '@/shared/hooks/use-media-query.hook';
import { responsiveImage } from '@/shared/lib/image';
import { cn } from '@/shared/lib/utils';

/** How long each spread holds before the panel turns to the next one. */
export const MENU_SPREAD_INTERVAL_MS = 2000;

/** How long the travelling sheet takes to cross the spine, in seconds.
 * Slower than the home page's single-page turn: this sheet covers twice
 * the distance. The shape of the turn lives in `globals.css` — see
 * `@keyframes menu-sheet-turn-forward`. */
const SPREAD_FLIP_DURATION = 0.9;

/**
 * One turn of a single physical sheet across the spine.
 *
 * The four faces are all different pages, which is the whole trick. Going
 * forward from `1 2` to `3 4`: you grab page 2 and swing it left, so the
 * sheet's front is 2 and its back is 3 — and while it travels, the left
 * half must still read 1 (it isn't covered yet) while the right half
 * already reads 4 (the sheet has lifted off it). Only once the sheet
 * lands do both halves settle to `3 4`.
 */
interface TurnState {
  id: string;
  /** true = right page swings left (next spread); false = the mirror. */
  forward: boolean;
  /** The travelling sheet's face at rest — the page being turned. */
  front: MenuSpread;
  /** What that sheet shows once it's face-down on the far side. */
  back: MenuSpread;
  /** The halves *underneath* the sheet for the duration of the turn. */
  underLeft: MenuSpread;
  underRight: MenuSpread;
}

/** Warms the browser cache so the next sheet is decoded before it is
 * turned to. Without it every tick uncovers an image that only starts
 * downloading once it mounts, and the panel shows a blank sheet. */
function preload(source: string | undefined, sizes: string) {
  if (!source) return;

  const { src, srcSet } = responsiveImage(source);
  const image = new window.Image();
  // `sizes`/`srcset` first: the browser resolves the candidate when `src`
  // is assigned, so setting them after would warm the wrong file.
  image.sizes = sizes;
  if (srcSet) image.srcset = srcSet;
  image.src = src;

  // Fetching alone isn't enough. The travelling sheet mounts two fresh
  // `<img>`s at the instant the turn starts, and an image that's in cache
  // but not yet *decoded* still costs a frame — which shows up as the sheet
  // flashing its blank paper right as it begins to move. Decoding here
  // means those faces can paint on their first frame.
  image.decode?.().catch(() => {
    // Rejects if the element is replaced or the source can't decode;
    // neither is worth surfacing — the turn just falls back to a
    // fetch-warmed image.
  });
}

/** Works out the four faces of a single turn — see `TurnState` for why
 * they're all different pages, and why the two halves underneath have to
 * show a mix of the outgoing and incoming spreads while it travels. */
function buildTurn(
  spreads: readonly MenuSpread[],
  from: number,
  to: number,
  direction: number,
  key: string
): TurnState {
  const total = spreads.length;
  const pageAt = (start: number, offset: number) => spreads[(start + offset) % total];
  const forward = direction >= 0;

  return {
    id: `${key}-${from}-${to}`,
    forward,
    front: forward ? pageAt(from, 1) : pageAt(from, 0),
    back: forward ? pageAt(to, 0) : pageAt(to, 1),
    // Forward, the left half is still the page you haven't covered yet and
    // the right half is the one you've just uncovered. Back, mirror.
    underLeft: forward ? pageAt(from, 0) : pageAt(to, 0),
    underRight: forward ? pageAt(to, 1) : pageAt(from, 1),
  };
}

/**
 * One half of the open spread.
 *
 * Reassigning `src` on a live `<img>` blanks it — measured on this page,
 * the element reports `complete: false` / `naturalWidth: 0` for at least a
 * task before even a *cached* source resolves, which paints as a flash of
 * bare paper exactly when a turn starts or lands. Warming the cache ahead
 * of time doesn't help: the blanking is a property of the element's own
 * swap, not of the network.
 *
 * So each source gets its own element, and the outgoing one stays mounted
 * underneath until the incoming one has actually arrived. There is a
 * painted page on screen at every moment, and the stack collapses back to
 * a single layer as soon as the new page is up.
 */
function SpreadPage({ page, alt, sizes }: { page: MenuSpread; alt: string; sizes: string }) {
  const [layers, setLayers] = useState<readonly MenuSpread[]>([page]);

  const top = layers[layers.length - 1];
  if (top.src !== page.src) {
    // Adjusted during render rather than in an effect (same idiom as
    // `active` below) so the incoming layer is present in the very first
    // commit that asks for it — an effect would leave one frame showing
    // the old page after the turn has already landed on the new one.
    setLayers([...layers, page]);
  }

  // Returning `current` unchanged when there's nothing to drop matters:
  // `slice()` would hand back a fresh array every time, React would treat
  // that as a real update, and the effect below — which depends on
  // `layers` — would re-run and call this again, forever. Same reference
  // means React bails out of the re-render and the loop never starts.
  const collapse = useCallback(
    () => setLayers((current) => (current.length === 1 ? current : current.slice(-1))),
    []
  );
  const topRef = useRef<HTMLImageElement | null>(null);

  // A cached image can finish loading before React has wired `onLoad` up,
  // in which case that event never fires for it. Re-checking after every
  // commit catches exactly that case — without it the stack keeps growing
  // one dead layer per turn instead of collapsing back to a single page.
  useEffect(() => {
    const node = topRef.current;
    if (node?.complete && node.naturalWidth > 0) collapse();
  }, [layers, collapse]);

  return (
    <>
      {layers.map((layer, position) => {
        const isTop = position === layers.length - 1;
        const image = responsiveImage(layer.src);

        return (
          <img
            key={layer.src}
            ref={isTop ? topRef : undefined}
            src={image.src}
            srcSet={image.srcSet}
            // Only the page actually on top is the one being described;
            // an outgoing layer is a rendering detail, not content.
            alt={isTop ? alt : ''}
            aria-hidden={isTop ? undefined : true}
            width={layer.width}
            height={layer.height}
            sizes={sizes}
            loading="lazy"
            // `sync`: these are warmed and decoded by `preload` well before
            // they mount, so there's nothing to block on — and it makes the
            // new layer appear in one piece instead of a frame later.
            decoding="sync"
            // `onError` too: a page that can't load must still release the
            // layer beneath it, or one broken file pins a stale page on
            // screen for good.
            onLoad={isTop ? collapse : undefined}
            onError={isTop ? collapse : undefined}
            className="absolute inset-0 h-full w-full object-contain"
          />
        );
      })}
    </>
  );
}

interface MenuSpreadViewerProps {
  spreads: readonly MenuSpread[];
  /** One description for the whole set — the panel shows one or two pages
   * at a time and they are all "the <category> menu". */
  alt: string;
  /** Changing this restarts the viewer at the first spread. Pass the
   * category id: a newly picked category always opens on its first page,
   * not wherever the last one's timer happened to be. */
  resetKey: string;
  /** Which edge the first sheet of a new `resetKey` hinges on — ≥ 0 turns
   * forward, < 0 turns back. */
  resetDirection?: number;
  /** Must describe the box this paints into, for `srcset` selection. */
  sizes?: string;
  /** 2 opens the panel as a spread — two sheets side by side, like a book
   * lying open — instead of one. Only takes effect at `lg` and above (an
   * open two-page spread doesn't fit a phone width, so mobile always shows
   * one regardless of this prop), and only when there's a second spread to
   * fill it with. Stepping and the auto-turn move by however many pages
   * are actually on screen, so a spread always turns as a pair.
   *
   * Each sheet is sized to its own aspect ratio at the panel's full height
   * rather than stretched to a 50/50 column, and the pair is centred as a
   * unit — so the two pages meet flush at the spine (no gap in the
   * middle) and the paper grain shows through only in the margins outside
   * them, the way an open book actually sits on a table. */
  pagesOnDesktop?: 1 | 2;
  /** How long a spread holds before the panel turns to the next one.
   * Defaults to `MENU_SPREAD_INTERVAL_MS`. */
  intervalMs?: number;
  className?: string;
}

/**
 * /menu's category artwork: a stack of pages that turns on a timer, or
 * under the visitor's own prev/next controls, and can open as a two-up
 * spread. Built for the /menu accordion specifically — the home page's
 * menu section pages through the same underlying artwork but shows one
 * page at a time with only a forward control, which is different enough
 * (single vs. spread, one arrow vs. two, cream vs. ink paper) that it gets
 * its own component: `HomeMenuPanel` under `screens/home`. Both still turn
 * pages through the same low-level `MenuPageFlip`.
 *
 * The auto-turn is deliberately conservative about when it runs. It stops
 * when the panel scrolls out of view, when the tab is backgrounded, under
 * `prefers-reduced-motion`, and while the pointer or keyboard focus is on
 * the controls — that last one because turning a page out from under
 * someone reaching for the arrows is the one moment the timer actively
 * fights them.
 */
export function MenuSpreadViewer({
  spreads,
  alt,
  resetKey,
  resetDirection = 1,
  sizes = MENU_PANEL_SIZES,
  pagesOnDesktop = 1,
  intervalMs = MENU_SPREAD_INTERVAL_MS,
  className,
}: MenuSpreadViewerProps) {
  const prefersReducedMotion = useReducedMotion();
  const tCommon = useTranslations('common');
  const rootRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // How many sheets are actually open right now — never more than there is
  // artwork for, so a 1-spread category doesn't show its only page twice.
  const pageCount = pagesOnDesktop === 2 && isDesktop && spreads.length > 1 ? 2 : 1;

  // Auto-advance only runs while the panel is on screen. Left running, it
  // would page through every spread in the background and pull down
  // megabytes the visitor never looks at.
  const isOnScreen = useInView(rootRef, { amount: 0.2 });

  // "On screen" is not the same as "being painted". A backgrounded tab
  // still reports the panel as in view, so the timer kept ticking with
  // nothing to render: every tick mounted a new page and fetched its
  // image, while the page it replaced could never finish its exit (Motion
  // is driven by rAF, which the tab has none of) and so was never
  // unmounted. Left alone for a couple of minutes that stacks the whole
  // run of spreads in the panel — measured 16 pages, and 16 downloads —
  // which then resolve in a heap the moment the visitor comes back.
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const sync = () => setIsPageVisible(document.visibilityState === 'visible');

    sync();
    document.addEventListener('visibilitychange', sync);

    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  // Direction rides along with the index so the panel knows which edge to
  // hinge on — `>` turns the page forward, `<` turns it back, and the
  // timer always turns forward.
  const [active, setActive] = useState({ key: resetKey, index: 0, direction: resetDirection });

  // Adjusting state during render rather than in an effect: React drops
  // the in-progress output and re-renders immediately, so the panel never
  // paints the old category's page under the new category's key. An
  // effect would, for one frame.
  if (active.key !== resetKey) {
    setActive({ key: resetKey, index: 0, direction: resetDirection });
  }

  const index = active.key === resetKey ? active.index : 0;
  // The pages open right now, starting at `index` — wraps past the end so
  // a spread never runs off the array (e.g. the last page paired with the
  // first, closing the loop the same way a single page already wraps).
  const openSpreads = Array.from(
    { length: pageCount },
    (_, offset) => spreads[(index + offset) % spreads.length]
  );

  /** Wraps in both directions so neither arrow ever dead-ends. Steps by a
   * whole spread — `pageCount` pages at once — so a two-up view always
   * turns to the *next* pair rather than sliding one page at a time and
   * repeating a page across turns. */
  const step = useCallback(
    (delta: number) =>
      setActive((previous) => ({
        ...previous,
        index: (previous.index + delta * pageCount + spreads.length) % spreads.length,
        direction: delta >= 0 ? 1 : -1,
      })),
    [spreads.length, pageCount]
  );

  // Keyed on the index, so turning a page by hand restarts the clock and
  // the new page gets a full interval rather than whatever was left of the
  // previous one's.
  useEffect(() => {
    if (prefersReducedMotion || !isOnScreen || !isPageVisible || isPaused) return;
    // Same test as the arrows: with nothing left unopened, a tick would
    // land on the spread already showing and re-render on a loop forever.
    if (spreads.length <= pageCount) return;

    const timer = window.setTimeout(() => {
      setActive((previous) => ({
        ...previous,
        index: (previous.index + pageCount) % spreads.length,
        direction: 1,
      }));
    }, intervalMs);

    return () => window.clearTimeout(timer);
  }, [
    spreads.length,
    index,
    pageCount,
    intervalMs,
    isOnScreen,
    isPageVisible,
    isPaused,
    prefersReducedMotion,
  ]);

  // One step ahead is enough: the timer never skips, so anything further
  // out would just be speculative bandwidth. That's a whole spread's worth
  // in two-up mode, not just the next single page.
  useEffect(() => {
    const total = spreads.length;

    for (let offset = 0; offset < pageCount; offset += 1) {
      preload(spreads[(index + pageCount + offset) % total]?.src, sizes);
      // Backward as well: unlike the home panel, the prev arrow here is a
      // first-class control, and a spread only ever warmed in the forward
      // direction flashes the first time someone turns back to it.
      preload(spreads[(index - pageCount + offset + total * 2) % total]?.src, sizes);
    }
  }, [spreads, index, pageCount, sizes]);

  // What the spread is currently showing, plus the sheet in flight if the
  // index has just moved. The turn has to live at this level rather than
  // inside `MenuPageFlip`, because that clips each sheet to its own box
  // (`overflow-hidden` + `isolate`) — and a sheet crossing the spine is
  // precisely a sheet that must not be clipped to its own half.
  //
  // Derived *during render*, not in an effect, for the same reason `active`
  // above is: an effect runs after the browser has already painted the
  // commit that moved `index`. That left one frame where both halves had
  // switched to the new spread with no sheet over them yet — a visible
  // flash of the destination on both pages, before the turn had even
  // started — and then a second jump back as the sheet appeared. Adjusting
  // during render makes React drop this output and re-render before
  // painting, so that intermediate state never reaches the screen.
  const [shown, setShown] = useState<{ key: string; index: number; turn: TurnState | null }>({
    key: resetKey,
    index,
    turn: null,
  });

  let turn = shown.turn;

  if (shown.key !== resetKey) {
    // A new category opens on its first spread; it doesn't turn there.
    turn = null;
    setShown({ key: resetKey, index, turn: null });
  } else if (shown.index !== index) {
    turn =
      pageCount === 2 && !prefersReducedMotion
        ? buildTurn(spreads, shown.index, index, active.direction, resetKey)
        : null;
    setShown({ key: resetKey, index, turn });
  }

  const endTurn = useCallback(
    () => setShown((current) => (current.turn ? { ...current, turn: null } : current)),
    []
  );

  if (openSpreads.length === 0 || !openSpreads[0]) return null;

  // While a sheet is crossing, the two halves are a mix of the outgoing and
  // incoming spreads (see `TurnState`); they only settle to the new pair
  // once it lands.
  const leftPage = turn ? turn.underLeft : openSpreads[0];
  // `?? openSpreads[0]` is only ever reached in 1-up mode, where the second
  // half isn't rendered at all — it just keeps this typed as a MenuSpread.
  const rightPage = turn ? turn.underRight : (openSpreads[1] ?? openSpreads[0]);

  // One ratio for the whole set, not each file's own. Every page is a leaf
  // of the same printed book, but a few scans came back on a different crop
  // — dac-san-viet's last pair is 582x842 against the set's 1241x1754 — and
  // sizing each half to its own file made the spread visibly change width
  // when that pair came up, with the travelling sheet landing on a half a
  // different size from itself. Holding the book at one shape instead lets
  // the odd page letterbox a couple of px onto the paper, which is
  // invisible next to the whole spread resizing mid-turn.
  const spreadRatio = `${spreads[0].width} / ${spreads[0].height}`;
  // The panel's own height comes from this ratio, not from the viewport —
  // two pages side by side are twice as wide as one for the same height.
  // Driving the panel's box size (below) from the artwork's own ratio,
  // instead of stretching it to fill whatever height the caller hands in,
  // is what keeps the photo filling the panel edge to edge with no paper
  // showing through around it.
  const panelRatio =
    pageCount === 2 ? `${spreads[0].width * 2} / ${spreads[0].height}` : spreadRatio;

  return (
    <div ref={rootRef} className={cn('relative', className)} style={{ aspectRatio: panelRatio }}>
      {/* The panel's own cream paper, under everything — painted once here
          rather than per sheet (see `MenuPageFlip`'s note on why it no
          longer paints its own background). A single layer is what keeps
          the grain continuous under the margins outside a two-up spread
          instead of seaming at the spine where two sheets' own tiles used
          to meet. Static: it isn't part of the page-turn animation, and it
          sits outside anything that might reveal/fade this panel in, so
          scrolling it into view never touches it either. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cream bg-repeat"
        style={{
          backgroundImage: `url(${CREAM_PAPER_TILE.desktop})`,
          backgroundSize: CREAM_PAPER_TILE_SIZE.desktop,
        }}
      />

      {/* `perspective` belongs on the element that holds *both* halves and
          the travelling sheet, not on each sheet separately: they have to
          share one 3D space, or the sheet reads as pivoting in mid-air
          beside the book instead of hinging on its spine. */}
      <div
        className={cn(
          'relative flex h-full items-stretch justify-center',
          pageCount === 2 && '[perspective:2400px]'
        )}
      >
        {(pageCount === 2 ? [leftPage, rightPage] : [leftPage]).map((page, half) => (
          // Sized to this sheet's own aspect ratio rather than stretched to
          // fill its column — a sheet stretched full-bleed lets
          // `object-contain` letterbox inside it, and the shading (painted
          // across the whole sheet, not just the photo) then darkens that
          // gap against the paper behind it. This way any gap sits outside
          // the sheet, where it's just static background.
          <div
            key={half}
            className="relative h-full max-w-full"
            style={{ aspectRatio: spreadRatio }}
          >
            {pageCount === 2 ? (
              // Two-up halves don't animate themselves — the sheet crossing
              // above them is the whole animation, and they simply hold the
              // right page for each moment of it (see `TurnState`).
              <SpreadPage page={page} alt={alt} sizes={sizes} />
            ) : (
              <MenuPageFlip
                pageKey={`${resetKey}-${index}`}
                src={page.src}
                alt={alt}
                width={page.width}
                height={page.height}
                direction={active.direction}
                sizes={sizes}
                theme="cream"
              />
            )}
          </div>
        ))}

        {/* The travelling sheet. Anchored by its spine edge to the centre
            of the spread, so `left: 50%` (forward) or `right: 50%` (back)
            puts its hinge exactly where the two pages meet. `z` lifts it
            off the book over the arc so it clears the page it's crossing —
            which also guarantees it paints above both halves inside this
            `preserve-3d` context, where plain z-index does not apply. */}
        {turn && (
          <div
            key={turn.id}
            aria-hidden="true"
            className="absolute top-0 h-full [transform-style:preserve-3d]"
            style={{
              aspectRatio: spreadRatio,
              ...(turn.forward ? { left: '50%' } : { right: '50%' }),
              transformOrigin: turn.forward ? 'left center' : 'right center',
              animation: `${turn.forward ? 'menu-sheet-turn-forward' : 'menu-sheet-turn-back'} ${SPREAD_FLIP_DURATION}s both`,
            }}
            // Only this element's own turn resolves the spread — the two
            // face shades below run their own animations that bubble up
            // here, and acting on those would clear the sheet mid-flight.
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) endTurn();
            }}
          >
            {/* Front — the page being turned, hidden once past 90°. */}
            <div className="absolute inset-0 bg-cream [backface-visibility:hidden]">
              <img
                src={responsiveImage(turn.front.src).src}
                srcSet={responsiveImage(turn.front.src).srcSet}
                alt=""
                sizes={sizes}
                // `sync`, unlike everywhere else in this file: these two
                // faces mount already warmed *and decoded* by `preload`, so
                // there's no decode to block on — and it's the only way to
                // guarantee they're painted on the frame the turn starts,
                // rather than a frame into it.
                decoding="sync"
                className="absolute inset-0 h-full w-full object-contain"
              />
              {/* Rakes away from the light as it stands up, so it darkens. */}
              <div
                className={cn(
                  'absolute inset-0',
                  turn.forward
                    ? 'bg-gradient-to-l from-black via-black/60 to-black/20'
                    : 'bg-gradient-to-r from-black via-black/60 to-black/20'
                )}
                style={{ animation: `menu-sheet-front-shade ${SPREAD_FLIP_DURATION}s both` }}
              />
            </div>

            {/* Back — what the sheet reveals once face-down on the far
                side. Pre-rotated so it reads the right way round, and lit
                in opposition to the front: near-black as it swings into
                view at 90°, clean by the time it lands. */}
            <div className="absolute inset-0 bg-cream [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <img
                src={responsiveImage(turn.back.src).src}
                srcSet={responsiveImage(turn.back.src).srcSet}
                alt=""
                sizes={sizes}
                decoding="sync"
                className="absolute inset-0 h-full w-full object-contain"
              />
              <div
                className={cn(
                  'absolute inset-0',
                  turn.forward
                    ? 'bg-gradient-to-r from-black via-black/70 to-black/30'
                    : 'bg-gradient-to-l from-black via-black/70 to-black/30'
                )}
                style={{ animation: `menu-sheet-back-shade ${SPREAD_FLIP_DURATION}s both` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* `> pageCount`, not `> 1`: what matters is whether there's a page
          left that isn't already open. A two-page category (mon-chinh,
          trang-mieng) shows both at once on desktop, so stepping a whole
          spread lands back where it started — the arrows were rendered but
          did nothing. On mobile the same category opens one page at a time
          and there genuinely is somewhere to turn, which is why this is
          measured against `pageCount` rather than a fixed number.

          `pointer-events-none` on the rail, `auto` on the buttons: the rail
          spans the panel so the two arrows sit on its outer edges, but it
          must not swallow clicks across the page in between. */}
      {spreads.length > pageCount && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-3 lg:px-5">
          {[-1, 1].map((delta) => {
            const isPrevious = delta < 0;
            const Chevron = isPrevious ? IcChevronLeft : IcChevronRight;

            return (
              <button
                key={delta}
                type="button"
                onClick={() => step(delta)}
                onPointerEnter={() => setIsPaused(true)}
                onPointerLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                aria-label={tCommon(isPrevious ? 'prevPage' : 'nextPage')}
                className="pointer-events-auto flex size-11 cursor-pointer items-center justify-center rounded-full bg-ink/50 text-cream backdrop-blur-sm transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <Chevron aria-hidden="true" className="size-5" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
