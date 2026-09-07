'use client';

import { useCallback } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { IcArrowRight } from '@/shared/components/icons';
import { useMediaQuery } from '@/shared/hooks/use-media-query.hook';
import { cn } from '@/shared/lib/utils';
// import { MENU_HOVER_DEBOUNCE_MS } from '../constants/home.constant';

interface MenuCategory {
  id: string;
  label: string;
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Desktop: rows sweep in from the left edge of the dark panel, staggered
 * generously since the panel is tall and the scroll is slow. Mobile: the
 * category list is a horizontally-scrollable pill row, not a sweeping
 * list, so it gets a small, fast, uniform fade+rise instead — a 40px
 * sideways sweep on a narrow screen reads as a glitch, not a flourish. */
const desktopList: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};
const desktopItem: Variants = {
  hidden: { opacity: 0, x: -40 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
};

const mobileList: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const mobileItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT_EXPO } },
};

const instantItem: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.01 } },
};

interface HomeMenuCategoryListProps {
  categories: MenuCategory[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** Fired the instant a pointer lands on a row, ahead of the debounce,
   * so the panel can start fetching what that row is about to show. */
  onIntent?: (index: number) => void;
}

/**
 * Every row does one job: it turns the panel beside/below the list to that
 * category. The trailing arrow used to be a second control that navigated
 * to /menu, which made a single row mean two different things depending on
 * where in it you clicked. It is now decorative — it slides on hover to
 * mark the row as live — and "Xem thực đơn" is the only way to /menu.
 *
 * A row activates on hover as well as on click, but hover has to hold for
 * `MENU_HOVER_DEBOUNCE_MS` first — see the constant for why. Clicking
 * cancels any pending hover and takes effect immediately.
 */
export function HomeMenuCategoryList({
  categories,
  activeIndex,
  onSelect,
  onIntent,
}: HomeMenuCategoryListProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // const hoverTimer = useRef<number | null>(null);

  // const cancelHover = useCallback(() => {
  //   if (hoverTimer.current !== null) {
  //     window.clearTimeout(hoverTimer.current);
  //     hoverTimer.current = null;
  //   }
  // }, []);

  // A row unmounting mid-hover would otherwise leave the timer to fire
  // into a dead component.
  // useEffect(() => cancelHover, [cancelHover]);

  // const handleEnter = useCallback(
  //   (index: number) => {
  //     onIntent?.(index);
  //     cancelHover();
  //     hoverTimer.current = window.setTimeout(() => onSelect(index), MENU_HOVER_DEBOUNCE_MS);
  //   },
  //   [cancelHover, onIntent, onSelect]
  // );

  const handleClick = useCallback(
    (index: number) => {
      // cancelHover();
      onSelect(index);
    },
    [onSelect]
  );

  const listVariants = prefersReducedMotion ? undefined : isDesktop ? desktopList : mobileList;
  const itemVariants = prefersReducedMotion ? instantItem : isDesktop ? desktopItem : mobileItem;

  return (
    <motion.ul
      // See Reveal's comment on the same pattern: `initial` is resolved
      // once at mount, so force a remount once the real breakpoint is
      // known instead of staying stuck on the SSR/mobile guess.
      key={isDesktop ? 'lg' : 'sm'}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -10% 0px', amount: 0.2 }}
      variants={listVariants}
      className="relative mt-8 max-w-[600px] overflow-x-auto grid grid-cols-4 md:flex gap-4.5 md:gap-10 lg:mt-[clamp(1rem,4vh,6rem)] lg:flex-col lg:gap-0 lg:overflow-x-visible"
    >
      {categories.map((category, index) => {
        const isActive = index === activeIndex;

        return (
          <motion.li
            key={category.id}
            variants={itemVariants}
            // On the row, not the button, so the trailing arrow counts as
            // hovering the category too.
            // onPointerEnter={() => handleEnter(index)}
            // onPointerLeave={cancelHover}
            className={cn(
              'group relative shrink-0 lg:shrink border-b-2 lg:border-b lg:border-cream',
              isActive ? 'border-gold' : 'border-transparent hover:border-cream/50'
            )}
          >
            <div className="flex items-center justify-between gap-4.5 lg:gap-7.5">
              <button
                type="button"
                onClick={() => handleClick(index)}
                aria-pressed={isActive}
                className={cn(
                  'flex-1 cursor-pointer text-left font-sans text-[14px] sm:text-[20px] lg:text-[clamp(1.25rem,2.2vh,2rem)] uppercase tracking-wide py-3 lg:py-[clamp(0.35rem,1.2vh,0.72rem)] transition-colors duration-300',
                  isActive ? 'text-gold' : 'text-cream hover:text-gold'
                )}
              >
                {category.label}
              </button>

              {/* Decorative: the row's own button is the control. */}
              <span
                aria-hidden="true"
                className="hidden shrink-0 items-center justify-center p-3.5 lg:inline-flex"
              >
                <IcArrowRight
                  className={cn(
                    'h-5 w-5 shrink-0 transition-[transform,color] duration-300 group-hover:translate-x-1',
                    isActive ? 'text-gold' : 'text-cream'
                  )}
                />
              </span>
            </div>

            {/* Desktop rows sit on a hairline rule rather than a border,
                so the active marker can sweep across it from the left
                instead of just switching colour. */}
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 bottom-0 hidden h-px origin-left scale-x-0 bg-gold transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block',
                isActive && 'scale-x-100'
              )}
            />
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
