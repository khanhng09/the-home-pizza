import { IcArrowRight } from '@/shared/components/icons';
import { humansHeroContent, humansHeroLinkList } from '../constants/humans.constant';

export function HumansHeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Video background */}
      <div className="relative min-h-[600px] lg:min-h-[934px]">
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={humansHeroContent.videoSrc} type="video/mp4" />
        </video>

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/60" />

        <div className="container-base relative pt-28 lg:pt-[338px]">
          <h1 className="max-w-91 font-display text-5xl leading-[1.2] text-cream lg:max-w-147 lg:text-[100px]">
            {humansHeroContent.heading}
          </h1>

          <ul className="mt-11 flex flex-col lg:mt-16">
            {humansHeroLinkList.map((link) => (
              <li key={link.id} className="max-w-73 border-b border-cream/90 lg:max-w-104">
                <a
                  href={link.href}
                  className="group flex min-h-11 items-center justify-between gap-4 py-2 font-sans text-lg uppercase tracking-wide text-cream sm:min-h-12 lg:py-4 lg:text-[27.51px]"
                >
                  {link.label}
                  <IcArrowRight className="h-4 w-4 shrink-0 text-cream transition-transform duration-300 group-hover:translate-x-1 lg:h-8 lg:w-8" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
