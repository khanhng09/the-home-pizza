import { storyContent } from '../constants/home.constant';
import { HomeStoryTabs } from '../components/home-story-tabs';
import { IlustDongHoHen, IlustDongHoTom } from '@/shared/components';

export function HomeStorySection() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="relative">
        {/* Background texture — swaps per breakpoint */}
        <div
          className="absolute inset-0 bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${storyContent.backgroundImageMobile})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${storyContent.backgroundImage})` }}
          aria-hidden="true"
        />

        <IlustDongHoTom className="pointer-events-none absolute left-4 top-28 h-14 w-14 text-gold lg:bottom-8 lg:left-8 lg:top-auto lg:h-32 lg:w-32" />
        <IlustDongHoHen className="pointer-events-none absolute right-6 top-64 h-20 w-24 text-gold lg:-right-4 lg:top-4 lg:h-24 lg:w-28" />

        <div className="container-base relative grid grid-cols-1 gap-10 pt-20 pb-16 lg:grid-cols-2 lg:gap-16 lg:pt-32.5 lg:pb-25">
          <h2 className="max-w-60 font-display text-4xl sm:max-w-none sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] leading-[120%] text-foreground">
            {storyContent.heading}
          </h2>

          <div className="flex flex-col gap-5 pl-24 font-sans text-sm sm:pl-28 lg:pl-0 sm:text-base md:text-lg lg:text-xl text-foreground">
            {storyContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      <HomeStoryTabs />
    </section>
  );
}
