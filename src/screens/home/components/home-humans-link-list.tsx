'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Link } from '@/i18n/navigation';
import { IcArrowRight } from '@/shared/components/icons';
import { useMediaQuery } from '@/shared/hooks/use-media-query.hook';
import { humansLinkList } from '../constants/home.constant';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const desktopList: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};
const desktopItem: Variants = {
  hidden: { opacity: 0, x: 40 },
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

interface HomeHumansLinkListProps {
  labels: Record<string, string>;
}

export function HomeHumansLinkList({ labels }: HomeHumansLinkListProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const listVariants = prefersReducedMotion ? undefined : isDesktop ? desktopList : mobileList;
  const itemVariants = prefersReducedMotion ? instantItem : isDesktop ? desktopItem : mobileItem;

  return (
    <motion.ul
      key={isDesktop ? 'lg' : 'sm'}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -10% 0px', amount: 0.2 }}
      variants={listVariants}
    >
      {humansLinkList.map((link) => (
        <motion.li
          key={link.id}
          variants={itemVariants}
          className="border-b border-foreground"
        >
          <Link
            href={link.href}
            // The design draws these rows 27px tall on mobile, which is
            // well under the project's 44px tap-target floor. `min-h-11`
            // holds the floor and the vertical padding comes off instead,
            // so the row is exactly 44 rather than 52 — as close to the
            // design as the accessibility rule allows.
            className="group flex min-h-11 cursor-pointer items-center justify-between gap-2 font-sans text-lg uppercase tracking-wide text-foreground lg:py-[clamp(0.5rem,2vh,1.25rem)] lg:text-[28px]"
          >
            {labels[link.id]}
            <IcArrowRight className="h-6 w-6 shrink-0 text-foreground transition-transform duration-300 group-hover:translate-x-1 lg:h-8 lg:w-8" />
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
