'use client';

import type { MouseEvent } from 'react';
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { IcArrowRight } from '@/shared/components/icons';
import { cn } from '@/shared/lib/utils';
import { menuCatalog } from '../constants/menu.constant';

// Safety net only — used if no accordion-content animation ever fires (e.g.
// this item has no sibling to collapse), so the trigger still scrolls into
// view instead of never moving.
const ACCORDION_SCROLL_FALLBACK_MS = 300;

function scrollTriggerIntoView(trigger: HTMLButtonElement) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  trigger.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
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
    scrollTriggerIntoView(trigger);
    return;
  }

  let settled = false;
  const settle = () => {
    if (settled) return;
    settled = true;
    root.removeEventListener('animationend', onAnimationEnd);
    window.clearTimeout(fallback);
    scrollTriggerIntoView(trigger);
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
        const spreadAlts = tCatalog.raw(`${category.id}.spreads`) as string[];
        return (
        <AccordionItem
          key={category.id}
          value={category.id}
          className="not-last:border-b-0 border-t border-ink/25"
        >
          <AccordionTrigger
            onClick={handleTriggerClick}
            className="relative h-16 items-center justify-center gap-4 rounded-none border-none bg-linen px-14 py-0 text-center font-normal hover:bg-linen/70 hover:no-underline focus-visible:rounded-none focus-visible:border-none focus-visible:ring-0 lg:h-[99px] [&_[data-slot=accordion-trigger-icon]]:hidden"
          >
            <span className="font-display text-[33px] text-ink lg:text-[59px]">
              {tCatalog(`${category.id}.label`)}
            </span>
            <IcArrowRight
              aria-hidden="true"
              className="absolute right-10 hidden h-[62px] w-[62px] shrink-0 text-ink lg:block"
            />
          </AccordionTrigger>

          <AccordionContent className="p-0">
            {category.spreads.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {category.spreads.map((spread, index) => (
                  <img
                    key={spread.src}
                    src={spread.src}
                    alt={spreadAlts[index]}
                    width={spread.width}
                    height={spread.height}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className={cn('h-auto w-full object-cover', index > 0 && 'hidden lg:block')}
                  />
                ))}
              </div>
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
