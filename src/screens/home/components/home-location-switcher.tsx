'use client';

import { useState } from 'react';
import { IcArrowRight } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { locationContent, locationStates } from '../constants/home.constant';
import { IlustDongHoBanhDa, IlustDongHoHungQue, IlustDongHoNgheu } from '@/shared/components';

export function HomeLocationSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLocation = locationStates[activeIndex];

  return (
    <div className="grid min-h-[1040px] bg-deep lg:min-h-[914px] lg:grid-cols-2">
      <div className="relative flex min-h-[598px] overflow-hidden px-7 pt-19 pb-0 sm:px-10 lg:min-h-[914px] lg:px-14 lg:pt-32 lg:pb-14 xl:px-16">
        <div
          className="absolute inset-0 bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${locationContent.backgroundImageMobile})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${locationContent.backgroundImage})` }}
          aria-hidden="true"
        />

        <div className="relative flex w-full flex-col">
          <p className="max-w-[460px] font-sans text-2xl leading-[1.35] text-cream lg:max-w-[600px] lg:text-xl xl:text-[22px]">
            {locationContent.paragraph}
          </p>

          <IlustDongHoHungQue
            className="pointer-events-none absolute left-10 top-[182px] h-24 w-24 text-gold sm:top-[190px] lg:left-8 lg:top-[118px] lg:h-28 lg:w-28 xl:left-10 xl:h-32 xl:w-32"
            aria-hidden="true"
          />
          <IlustDongHoNgheu
            className="pointer-events-none absolute right-4 top-[300px] h-35 w-45 text-gold sm:right-8 lg:right-0 lg:top-[370px] lg:h-28 lg:w-36 xl:right-0 xl:top-[390px] xl:h-32 xl:w-44"
            aria-hidden="true"
          />
          <IlustDongHoBanhDa
            className="pointer-events-none absolute -bottom-18 left-[28%] hidden h-46 w-64 text-gold lg:block"
            aria-hidden="true"
          />

          <div className="mt-auto flex gap-4.5 lg:block">
            {locationStates.map((location, index) => {
              const isActive = index === activeIndex;

              return (
                <Button
                  key={location.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className="group flex h-auto flex-col items-start justify-start gap-2 rounded-none bg-transparent px-0 pb-2 text-left font-sans text-xl uppercase leading-[1.2] text-cream hover:bg-transparent focus-ring lg:w-full lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:border-b lg:border-cream lg:py-8 lg:font-display lg:text-[clamp(2.5rem,5.3vw,4.65rem)] lg:leading-none"
                >
                  <span className="lg:hidden">
                    {location.mobileLabel.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                  <span className="hidden lg:block">{location.label}</span>
                  <span
                    aria-hidden="true"
                    className={cn('h-1 w-full lg:hidden', isActive ? 'bg-gold' : 'bg-gold/0')}
                  />
                  <IcArrowRight className="hidden size-[62px] shrink-0 text-cream transition-transform duration-300 group-hover:translate-x-2 lg:block" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative min-h-[442px] overflow-hidden lg:min-h-[914px]">
        <img
          key={activeLocation.id}
          src={activeLocation.image}
          alt={activeLocation.alt}
          width={1400}
          height={1828}
          sizes="(max-width: 1023px) 100vw, 50vw"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center animate-fade-in"
        />
        <h2
          id="home-location-heading"
          className="absolute bottom-7 left-1/2 w-full max-w-full -translate-x-1/2 px-4 text-center font-display text-[clamp(2.5rem,15vw,4.5rem)] leading-none text-cream uppercase lg:top-[103px] lg:bottom-auto lg:px-8 lg:text-[clamp(4rem,8.5vw,9.5rem)]"
        >
          {locationContent.heading}
        </h2>
      </div>
    </div>
  );
}
