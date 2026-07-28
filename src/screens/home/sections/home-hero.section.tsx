import Link from 'next/link';
import { heroContent, trustBadges } from '../constants/home.constant';

export function HomeHeroSection() {
  return (
    <section className="relative">
      {/* Video background */}
      <div className="relative flex items-center min-h-262.5 lg:min-h-screen overflow-hidden bg-ink">
        <video
          className="absolute inset-0 h-full w-full object-cover object-center md:object-[50%_75%]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={heroContent.videoSrc} type="video/mp4" />
        </video>

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/50" />

        {/* Vietnam map decoration */}
        <div className="pointer-events-none absolute left-0 top-0 h-full max-h-[90vh] aspect-square hidden lg:block">
          <img
            src={heroContent.mapImage}
            alt=""
            className="h-full w-full"
          />
        </div>

        {/* Content */}
        <div className="container-base relative z-10 flex h-full flex-col items-end justify-center gap-4.5 text-right">
          <p className="font-sans text-lg sm:text-2xl md:text-3xl lg:text-4xl text-cream mb-4.5">{heroContent.eyebrow}</p>
          <h1 className="font-display text-5xl sm:text-[54px] md:text-6xl lg:text-7xl leading-[1.05] text-cream mb-3.5 max-w-100 lg:max-w-150 uppercase">
            {heroContent.heading}
          </h1>
          <p className="font-sans text-lg sm:text-2xl md:text-3xl lg:text-4xl text-cream">{heroContent.subheading}</p>
          <Link
            href="#reservation"
            className="btn-base h-12 sm:h-11 md:h-10 px-6 py-3 max-w-47 w-full font-bold text-sm mt-3.5 bg-cream text-ink hover:bg-linen uppercase"
          >
            {heroContent.cta}
          </Link>
        </div>
      </div>

      {/* Trust badges bar */}
      <div className="absolute bottom-0 overflow-hidden w-full border-t border-black">
        <div
          // className="absolute z-0 inset-0 backdrop-blur-[65.49px] bg-gold/30"
          className="absolute z-0 inset-0"
          style={{
            background: "radial-gradient(151.92% 127.02% at 15.32% 21.04%, rgba(210, 171, 126, 0.20) 0%, rgba(121, 82, 49, 0.04) 77.08%, rgba(20, 48, 63, 0.00) 100%)",
            backdropFilter: "blur(32px)",
          }}

        ></div>
        <div className="relative container-base grid grid-cols-2 gap-8 pt-10 pb-6 lg:grid-cols-4 z-1">
          {trustBadges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center text-center">
              <img
                src={badge.image}
                alt={`${badge.label} ${badge.year}`}
                width={172}
                height={82}
                className="h-20.5 w-auto"
              />
              <p className="text-sm text-cream">{badge.label}</p>
              <p className="text-sm text-cream">{badge.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
