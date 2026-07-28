'use client';

import { useState } from 'react';
import Image from 'next/image';
import { storyStates } from '../constants/home.constant';
import { cn } from '@/shared/lib/utils';

export function HomeStoryTabs() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative">
      {/* Tabs */}
      <div className="absolute z-10 top-0 translate-y-[-50%] w-full">
        <div className="w-full grid grid-cols-3 container-base gap-20 mx-auto">
          {storyStates.map((state, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={state.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
                className={cn(
                  'whitespace-nowrap rounded-full max-w-90 w-full h-15 font-display text-4xl transition-all duration-300',
                  isActive ? 'bg-gold text-ink' : 'bg-ink text-cream hover:brightness-110'
                )}
              >
                {state.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Crossfading state images */}
      <div className="relative aspect-1402/512 max-h-128 w-full overflow-hidden">
        {storyStates.map((state, index) => (
          <Image
            key={state.id}
            src={state.image}
            alt={state.label}
            fill
            sizes="100vw"
            priority={index === 0}
            className={cn(
              'object-cover transition-[opacity,transform] duration-700 ease-out',
              index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            )}
          />
        ))}
      </div>
    </div>
  );
}
