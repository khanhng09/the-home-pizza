'use client';

import type { MouseEvent } from 'react';
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { MENU_PANEL_SIZES } from '@/shared/components/ui/menu-page-flip';
import { IcArrowRight } from '@/shared/components/icons';
import { menuCatalog } from '../constants/menu.constant';
import { MenuSpreadViewer } from './menu-spread-viewer';

// Safety net only — used if no accordion-content animation ever fires (e.g.
// this item has no sibling to collapse), so the trigger still scrolls into
// view instead of never moving.
const ACCORDION_SCROLL_FALLBACK_MS = 300;

/**
 * Parks the trigger directly under the fixed header.
 *
 * `scrollIntoView({ block: 'start' })` aligns it with the top of the
 * *viewport*, which is behind the header — the trigger ended up hidden
 * under the bar every time. The header's height is a CSS variable so the
 * offset can't drift away from the bar itself.
 */
function scrollTriggerUnderHeader(trigger: HTMLButtonElement) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headerHeight =
    Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height')
    ) || 0;

  window.scrollTo({
    top: window.scrollY + trigger.getBoundingClientRect().top - headerHeight,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}

/**
 * Opening a trigger also collapses whichever item was previously open — if
 * that item sits above the one just clicked, its content shrinking away
 * shifts the clicked trigger upward as it collapses. Scrolling immediately
 * targets a position that's about to move; guessing at the animation's
 * duration is fragile (it's forced to ~0 under `prefers-reduced-motion`,
 * changes if the CSS duration ever changes, etc). Instead, wait for the
 * accordion's own open/close animation to actually finish — `animationend`,
 * bubbled up from whichever `AccordionContent` panel(s) are transitioning —
 * before scrolling.
 */
function handleTriggerClick(event: MouseEvent<HTMLButtonElement>) {
  const trigger = event.currentTarget;
  const root = trigger.closest('[data-slot="accordion"]');

  if (!(root instanceof HTMLElement)) {
    scrollTriggerUnderHeader(trigger);
    return;
  }

  let settled = false;
  const settle = () => {
    if (settled) return;
    settled = true;
    root.removeEventListener('animationend', onAnimationEnd);
    window.clearTimeout(fallback);
    scrollTriggerUnderHeader(trigger);
  };

  const onAnimationEnd = (animationEvent: Event) => {
    const target = animationEvent.target;
    if (target instanceof HTMLElement && target.getAttribute('data-slot') === 'accordion-content') {
      settle();
    }
  };

  root.addEventListener('animationend', onAnimationEnd);
  const fallback = window.setTimeout(settle, ACCORDION_SCROLL_FALLBACK_MS);
}

/**
 * Category list below the hero. Built on shadcn/Radix's Accordion so
 * expand/collapse gets correct keyboard nav and aria-expanded/aria-controls
 * for free — `type="single" collapsible` gives the "opening one closes the
 * previous one" behavior the design calls for.
 *
 * An open panel's height is intrinsic to its own artwork — `MenuSpreadViewer`
 * sizes itself from the spread's aspect ratio rather than being forced to
 * fill the leftover viewport height here. A fixed `100svh`-derived height
 * used to fight the image's own ratio: whichever dimension the viewport
 * happened to constrain, the page's `object-contain` letterboxed the other
 * one onto the paper background. Letting the panel's own ratio drive its
 * height means the artwork always fills the panel edge to edge. The artwork
 * is the same set the home page's menu section pages through, with the same
 * underlying page-turn — but as a two-up spread with its own prev/next
 * arrows, not the home page's single forward-only page. See
 * `MenuSpreadViewer`'s doc comment for why the two no longer share a viewer.
 */
export function MenuCategoryAccordion() {
  const t = useTranslations('menuPage');
  const tCatalog = useTranslations('menuPage.catalog');

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={menuCatalog[0].id}
      className="w-full border-b border-ink/25"
    >
      {menuCatalog.map((category) => {
        const label = tCatalog(`${category.id}.label`);

        return (
          <AccordionItem
            key={category.id}
            value={category.id}
            className="not-last:border-b-0 border-t border-ink/25"
          >
            <AccordionTrigger
              onClick={handleTriggerClick}
              className="relative h-[var(--menu-trigger-height)] items-center justify-center gap-4 rounded-none border-none bg-linen px-14 py-0 text-center font-normal hover:bg-linen/70 hover:no-underline focus-visible:rounded-none focus-visible:border-none focus-visible:ring-0 [&_[data-slot=accordion-trigger-icon]]:hidden"
            >
              <span className="font-sans text-lg uppercase tracking-wide text-ink lg:text-2xl">
                {label}
              </span>
              <IcArrowRight
                aria-hidden="true"
                className="absolute right-10 hidden size-8 shrink-0 text-ink lg:block"
              />
            </AccordionTrigger>

            <AccordionContent className="p-0">
              {category.spreads.length > 0 ? (
                <MenuSpreadViewer
                  spreads={category.spreads}
                  alt={t('catalog.imageAlt', { category: label })}
                  resetKey={category.id}
                  sizes={MENU_PANEL_SIZES}
                  pagesOnDesktop={2}
                  intervalMs={3000}
                  className="w-full"
                />
              ) : (
                <p className="px-6 py-16 text-center font-sans text-lg text-ink/60">
                  {t('comingSoon')}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
