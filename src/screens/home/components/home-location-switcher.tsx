'use client';

import { useState } from 'react';
import { IcArrowRight } from '@/shared/components/icons';
import { IlustBasil, IlustClam, IlustSpinach } from '@/shared/components/illustrations';
import { cn } from '@/shared/lib/utils';
import { locationContent, locationStates } from '../constants/home.constant';

export function HomeLocationSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLocation = locationStates[activeIndex];

  return (
    <div className="grid min-h-[1040px] bg-deep lg:min-h-[914px] lg:grid-cols-2">
      <div className="relative flex min-h-[598px] overflow-hidden px-7 pt-19 pb-0 sm:px-10 lg:min-h-[914px] lg:px-14 lg:pt-32 lg:pb-14 xl:px-16">
        <div
          className="absolute inset-0 aspect-[430/598] lg:aspect-auto bg-cover bg-center lg:hidden"
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

          <IlustBasil
            className="pointer-events-none absolute left-10 top-[182px] h-24 w-24 text-gold sm:top-[190px] lg:left-8 lg:top-[118px] lg:h-28 lg:w-28 xl:left-10 xl:h-32 xl:w-32"
            aria-hidden="true"
          />
          <IlustClam
            className="pointer-events-none absolute right-4 top-[300px] h-35 w-45 text-gold sm:right-8 lg:right-0 lg:top-[370px] lg:h-28 lg:w-36 xl:right-0 xl:top-[390px] xl:h-32 xl:w-44"
            aria-hidden="true"
          />
          <IlustSpinach
            className="pointer-events-none absolute -bottom-18 left-[28%] hidden h-46 w-64 text-gold lg:block"
            aria-hidden="true"
          />

          <div className="mt-auto grid grid-cols-[auto_auto_1fr] items-end gap-x-8 sm:gap-x-12 lg:block">
            {locationStates.map((location, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={cn(
                    'group min-h-14 pb-4 text-left font-sans text-[32px] uppercase leading-[1.16] text-cream transition-colors duration-300 focus-ring sm:text-4xl lg:flex lg:min-h-0 lg:w-full lg:items-center lg:justify-between lg:border-b lg:border-cream lg:py-8 lg:font-display lg:text-7xl lg:leading-none xl:text-[88px]',
                    isActive ? 'border-b-6 border-gold lg:border-cream' : 'border-b-6 border-transparent text-cream/85 hover:text-cream lg:border-cream'
                  )}
                >
                  <span className="lg:hidden">
                    {location.mobileLabel.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                  <span className="hidden lg:block">{location.label}</span>
                  <IcArrowRight className="hidden h-14 w-14 shrink-0 text-cream transition-transform duration-300 group-hover:translate-x-2 lg:block xl:h-16 xl:w-16" />
                </button>
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
          className="absolute bottom-7 left-1/2 -translate-x-1/2 font-display text-[72px] leading-none text-cream uppercase sm:text-[96px] lg:top-[103px] lg:bottom-auto lg:text-[128px] xl:text-[150px]"
        >
          {locationContent.heading}
        </h2>
      </div>
    </div>
  );
}
