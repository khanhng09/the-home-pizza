'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useMediaQuery } from '@/shared/hooks/use-media-query.hook';
import { cn } from '@/shared/lib/utils';

/**
 * Direction names describe the direction of *motion*, matching the
 * `slide-*` keyframe convention already in `globals.css`
 * (e.g. `slide-left` starts offset to the right and travels left).
 */
export type RevealVariant =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in';

interface RevealProps {
  variant?: RevealVariant;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  children?: ReactNode;
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const OFFSET = 44;

const variants: Record<RevealVariant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    shown: { opacity: 1 },
  },
  'slide-up': {
    hidden: { opacity: 0, y: OFFSET },
    shown: { opacity: 1, y: 0 },
  },
  'slide-down': {
    hidden: { opacity: 0, y: -OFFSET },
    shown: { opacity: 1, y: 0 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: OFFSET },
    shown: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: -OFFSET },
    shown: { opacity: 1, x: 0 },
  },
  'zoom-in': {
    hidden: { opacity: 0, scale: 0.92 },
    shown: { opacity: 1, scale: 1 },
  },
};

/** Below `lg` every section collapses to one stacked column, so a
 * left/right pairing that answers a column layout stops meaning anything
 * — it's just a big sideways swoop on a narrow screen. Mobile always gets
 * this one small, fast, direction-agnostic rise instead. */
const mobileVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0 },
};

const MOBILE_DURATION = 0.45;
const MOBILE_MAX_DELAY_MS = 120;

/**
 * Scroll-triggered reveal used to pace each section as a story beat.
 *
 * Desktop (`lg` and up) gets the full choreography: pick `variant` from
 * the element's place in the layout — a left column drifting in with
 * `slide-right`, its right-hand pair answering with `slide-left` — so the
 * page reads as staged rather than one uniform fade.
 *
 * Below `lg`, sections stack into a single column, so directional
 * pairing has nothing left to answer to. Mobile is deliberately simpler:
 * one small fade+rise, ~half the duration, and delays capped low so a
 * fast thumb-scroll doesn't outrun the reveal and land on blank space.
 *
 * Also honors `prefers-reduced-motion` by collapsing to a plain instant
 * fade — Framer Motion animates via JS, so the global CSS reduced-motion
 * override in `globals.css` does not reach it.
 */
export function Reveal({
  variant = 'slide-up',
  delayMs = 0,
  durationMs = 800,
  className,
  children,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const activeVariants = prefersReducedMotion
    ? variants.fade
    : isDesktop
      ? variants[variant]
      : mobileVariant;

  const activeDuration = prefersReducedMotion ? 0.01 : isDesktop ? durationMs / 1000 : MOBILE_DURATION;
  const activeDelay = prefersReducedMotion ? 0 : isDesktop ? delayMs / 1000 : Math.min(delayMs, MOBILE_MAX_DELAY_MS) / 1000;

  return (
    <motion.div
      // Framer Motion resolves `initial` once at mount and won't
      // retroactively re-apply it if `variants` changes later. SSR/first
      // paint always reports mobile (see useMediaQuery's server snapshot),
      // so once `isDesktop` resolves to its real client value a beat
      // later, force a clean remount to pick up the correct starting
      // offset — happens before any scroll, so it's imperceptible.
      key={isDesktop ? 'lg' : 'sm'}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -10% 0px', amount: 0.15 }}
      variants={activeVariants}
      transition={{ duration: activeDuration, delay: activeDelay, ease: EASE_OUT_EXPO }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
