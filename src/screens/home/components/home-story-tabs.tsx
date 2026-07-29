'use client';

import { useState } from 'react';
import { storyStates } from '../constants/home.constant';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

export function HomeStoryTabs() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative">
      {/* Tabs */}
      <div className="absolute z-10 top-0 translate-y-[-50%] w-full">
        <div className="container-base flex gap-3.5 overflow-x-auto lg:gap-5">
          {storyStates.map((state, index) => {
            const isActive = index === activeIndex;
            return (
              <Button
                key={state.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
                className={cn(
                  'h-10 shrink-0 whitespace-nowrap rounded-full px-5 font-display text-xs transition-all duration-300 sm:h-11 sm:px-6 sm:text-sm lg:h-15 lg:px-9 lg:text-4xl',
                  isActive ? 'bg-gold text-ink hover:bg-gold' : 'bg-ink text-cream hover:brightness-110 hover:bg-ink'
                )}
              >
                {state.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Crossfading state images */}
      <div className="relative aspect-1402/512 max-h-128 w-full overflow-hidden">
        {storyStates.map((state, index) => (
          <img
            key={state.id}
            src={state.image}
            alt={state.label}
            loading={index === 0 ? 'eager' : 'lazy'}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out',
              index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            )}
          />
        ))}
      </div>
    </div>
  );
}
