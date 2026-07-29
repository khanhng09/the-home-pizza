import { menuHeroContent } from '../constants/menu.constant';
import { MenuRegionList } from '../components/menu-region-list';

export function MenuHeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Background texture */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-cream" />
        <img
          src={menuHeroContent.backgroundImage}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-50"
        />
      </div>

      <div className="container-base relative grid grid-cols-1 gap-8 pt-24 pb-12 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:items-center lg:gap-16 lg:pt-44 lg:pb-20">
        {/* Text column — first on mobile, top-right on desktop */}
        <div className="order-1 flex flex-col items-start gap-6 lg:order-none lg:col-start-2 lg:row-start-1">
          <p className="font-sans text-lg tracking-wide text-ink lg:text-2xl">
            {menuHeroContent.greeting}
          </p>

          <div className="flex flex-col gap-5 font-sans text-sm text-ink lg:max-w-131 lg:text-xl">
            {menuHeroContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Region tabs — between the text and the map on mobile, under the
            text on desktop */}
        <div className="order-2 w-full lg:order-none lg:col-start-2 lg:row-start-2 lg:max-w-132">
          <MenuRegionList />
        </div>

        {/* Map illustration — full-bleed (wider than the viewport, per
            design) on mobile, contained in the left column on desktop */}
        <div className="order-3 relative lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:aspect-[862/585] lg:w-full">
          <div
            className="relative -ml-[7.4%] aspect-[718.824/414] w-[167%] lg:ml-0 lg:size-full lg:aspect-auto"
          >
            <img
              src={menuHeroContent.mapImage}
              alt="Bản đồ đặc sản Việt trên đế bánh pizza"
              width={1600}
              height={979}
              className="absolute inset-0 size-full object-contain"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
