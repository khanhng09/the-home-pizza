'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Link } from '@/i18n/navigation';
import { IcArrowRight } from '@/shared/components/icons';
import { useMediaQuery } from '@/shared/hooks/use-media-query.hook';
import { cn } from '@/shared/lib/utils';

interface MenuCategory {
  id: string;
  href: string;
  label: string;
  /** Accessible name for the row's arrow link ("View the Pasta menu"). */
  linkLabel: string;
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
}

/**
 * The label is a button (it turns the page in the panel beside/below the
 * list), the trailing arrow is a separate link into that category on the
 * /menu screen — two jobs, so two controls rather than one element trying
 * to both select and navigate.
 */
export function HomeMenuCategoryList({
  categories,
  activeIndex,
  onSelect,
}: HomeMenuCategoryListProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

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
      className="relative mt-14 overflow-x-auto grid grid-cols-4 md:flex gap-4 lg:mt-24 lg:flex-col lg:gap-0 lg:overflow-x-visible"
    >
      {categories.map((category, index) => {
        const isActive = index === activeIndex;

        return (
          <motion.li
            key={category.id}
            variants={itemVariants}
            className={cn(
              'relative shrink-0 lg:shrink border-b-2 lg:border-b lg:border-cream',
              isActive ? 'border-gold' : 'border-transparent hover:border-cream/50'
            )}
          >
            <div className="flex items-center justify-between gap-4.5 lg:gap-7.5">
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-pressed={isActive}
                className={cn(
                  'flex-1 cursor-pointer text-left font-sans text-[20px] lg:text-[32px] uppercase tracking-wide py-3 lg:py-[11.5px] transition-colors duration-300',
                  isActive ? 'text-gold' : 'text-cream hover:text-gold'
                )}
              >
                {category.label}
              </button>

              <Link
                href={category.href}
                aria-label={category.linkLabel}
                className="group hidden shrink-0 items-center justify-center p-3.5 lg:inline-flex"
              >
                <IcArrowRight
                  className={cn(
                    'h-5 w-5 shrink-0 transition-[transform,color] duration-300 group-hover:translate-x-1',
                    isActive ? 'text-gold' : 'text-cream'
                  )}
                />
              </Link>
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
