'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { storyStates } from '../constants/home.constant';
import { Button } from '@/shared/components/ui/button';
import { responsiveImage } from '@/shared/lib/image';
import { cn } from '@/shared/lib/utils';

export function HomeStoryTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  // Which tabs have had their image put into the DOM. Mounting is the
  // whole prefetch mechanism: hovering a tab mounts its image at opacity
  // 0 so the bytes are already in flight by the time it's clicked, and a
  // tab that is never touched never costs anything.
  const [mounted, setMounted] = useState(() => new Set([0]));
  const t = useTranslations('home.story.states');

  const mount = (index: number) =>
    setMounted((previous) =>
      previous.has(index) ? previous : new Set(previous).add(index)
    );

  return (
    <div className="relative">
      {/* Tabs */}
      <div className="absolute z-10 top-0 translate-y-[-50%] w-full">
        <div className="container-base flex md:grid md:grid-cols-3 gap-3.5 md:gap-10 lg:gap-20 items-center w-full justify-between overflow-x-auto">
          {storyStates.map((state, index) => {
            const isActive = index === activeIndex;
            return (
              <Button
                key={state.id}
                type="button"
                onClick={() => {
                  mount(index);
                  setActiveIndex(index);
                }}
                onPointerEnter={() => mount(index)}
                aria-pressed={isActive}
                className={cn(
                  'h-10 shrink-0 whitespace-nowrap rounded-full px-5 font-display text-[20px] sm:text-xl md:text-2xl lg:text-[clamp(1.75rem,1.25vw,2.25rem)] transition-all duration-300 sm:h-11 sm:px-6  lg:h-15 lg:px-9 ',
                  isActive
                    ? 'bg-gold text-ink hover:bg-gold animate-[pill-pop_420ms_cubic-bezier(0.16,1,0.3,1)]'
                    : 'bg-ink text-cream hover:brightness-110 hover:bg-ink'
                )}
              >
                {t(state.id)}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Crossfading state images. Only tabs the visitor has actually
          opened get mounted — the crossfade needs the outgoing image to
          stay put, but the two never-opened ones used to download on
          first paint for nothing. */}
      <div className="relative aspect-1402/512 min-h-109.5 max-h-128 w-full overflow-hidden">
        {storyStates.map((state, index) => {
          if (!mounted.has(index)) return null;
          const image = responsiveImage(state.image);

          return (
            <img
              key={state.id}
              src={image.src}
              srcSet={image.srcSet}
              alt={t(state.id)}
              width={2804}
              height={1024}
              sizes="100vw"
              loading="lazy"
              decoding="async"
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out',
                index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
