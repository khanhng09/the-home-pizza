import { storyContent } from '../constants/home.constant';
import { HomeStoryTabs } from '../components/home-story-tabs';

export function HomeStorySection() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="relative">
        <img src="/images/home/story/background.webp" alt="Background" className="absolute inset-0 h-full w-full object-cover" />
        <div className="container-base relative grid grid-cols-1 gap-10 pt-20 pb-16 lg:grid-cols-2 lg:gap-16 lg:pt-32.5 lg:pb-25">
          <h2 className="font-display text-5xl leading-[120%] text-foreground lg:text-[80px]">
            {storyContent.heading}
          </h2>

          <div className="flex flex-col gap-5 font-sans text-lg text-foreground lg:text-xl">
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
