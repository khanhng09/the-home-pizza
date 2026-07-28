import { storyContent } from '../constants/home.constant';
import { HomeStoryTabs } from '../components/home-story-tabs';
import { IlustDongHoHen, IlustDongHoTom } from '@/shared/components';

export function HomeStorySection() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="relative">
        {/* Background texture — swaps per breakpoint */}
        <div
          className="absolute inset-0 aspect-[430/600] lg:aspect-auto bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${storyContent.backgroundImageMobile})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${storyContent.backgroundImage})` }}
          aria-hidden="true"
        />

        <IlustDongHoTom className="pointer-events-none absolute left-4 bottom-8 hidden h-24 w-24 text-gold lg:block lg:left-8 lg:h-32 lg:w-32" />
        <IlustDongHoHen className="pointer-events-none absolute -right-4 top-4 hidden h-20 w-24 text-gold lg:block lg:h-24 lg:w-28" />

        <div className="container-base relative grid grid-cols-1 gap-10 pt-20 pb-16 lg:grid-cols-2 lg:gap-16 lg:pt-32.5 lg:pb-25">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] leading-[120%] text-foreground">
            {storyContent.heading}
          </h2>

          <div className="flex flex-col gap-5 font-sans text-sm sm:text-base md:text-lg lg:text-xl text-foreground">
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
