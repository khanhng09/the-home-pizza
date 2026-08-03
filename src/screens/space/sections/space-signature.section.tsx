import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { IcFacebook, IcInstagram } from "@/shared/components/icons";
import { businessInfo, socialLinks } from "@/shared/constants/site.constant";
import { cn } from "@/shared/lib/utils";
import { spaceLocations } from "../constants/space.constant";

type SpaceLocation = (typeof spaceLocations)[number];

const socialIcons = {
  IcFacebook,
  IcInstagram,
};

function AccentScroll({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative w-[3px] rounded-full bg-gold/40 md:w-1.5", className)}
    >
      <div className="absolute left-1/2 top-0 h-[77px] w-[2px] -translate-x-1/2 rounded-full bg-gold/45 md:h-[100px] md:w-1" />
    </div>
  );
}

function GalleryControls({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-x-0 top-1/2 z-10", className)}>
      <span className="absolute left-0 flex size-[37px] -translate-y-1/2 items-center justify-center rounded-r-md bg-gold/40 text-cream">
        <span className="block size-3 rotate-45 border-b border-l border-current" />
      </span>
      <span className="absolute right-0 flex size-[37px] -translate-y-1/2 items-center justify-center rounded-l-md bg-gold/40 text-cream">
        <span className="block size-3 rotate-45 border-r border-t border-current" />
      </span>
    </div>
  );
}

function HeroImage({
  location,
  heading,
  isFirst,
}: {
  location: SpaceLocation;
  heading: string;
  isFirst: boolean;
}) {
  const headingID = `space-${location.id}-heading`;
  const Heading = isFirst ? "h1" : "h2";

  return (
    <section aria-labelledby={headingID} className="relative h-[287px] overflow-hidden bg-ink md:h-[934px]">
      <picture>
        {location.mobileHeroImage ? (
          <source
            media="(max-width: 767px)"
            srcSet={location.mobileHeroImage}
            width={location.mobileHeroWidth}
            height={location.mobileHeroHeight}
          />
        ) : null}
        <img
          src={location.heroImage}
          alt=""
          width={location.heroWidth}
          height={location.heroHeight}
          sizes="100vw"
          loading={isFirst ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={isFirst ? "high" : undefined}
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
      </picture>

      <Heading
        id={headingID}
        className="absolute bottom-3 left-4 w-[calc(100%-32px)] max-w-[401px] font-display text-4xl leading-[1.2] text-cream md:bottom-[55px] md:left-[52px] md:max-w-[966px] md:text-[100px]"
      >
        {heading}
      </Heading>
    </section>
  );
}

function MobileLocationStory({
  location,
  paragraphs,
  galleryAlts,
}: {
  location: SpaceLocation;
  paragraphs: string[];
  galleryAlts: string[];
}) {
  const isDark = location.theme === "dark";

  return (
    <div className="relative mx-auto h-[699px] max-w-[430px] overflow-hidden md:hidden">
      <div className="grid grid-cols-[minmax(0,286px)_3px] gap-3 px-6 pt-10 min-[390px]:pl-[68px] min-[390px]:pr-[70px]">
        <div
          className={cn(
            "h-[356px] overflow-hidden font-sans text-sm leading-[1.4]",
            isDark ? "text-cream" : "text-ink"
          )}
        >
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="mb-5 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
        <AccentScroll className="h-[356px]" />
      </div>

      <div className="absolute left-0 top-[432px] flex h-[227px] w-[calc(100%+62px)] gap-2">
        {location.gallery.map((image, index) => (
          <div
            key={image.image}
            className={cn(
              "relative h-full shrink-0 overflow-hidden",
              index === 0 ? "w-[69.3%]" : "w-[30.7%]"
            )}
          >
            <img
              src={image.image}
              alt={galleryAlts[index] ?? ""}
              width={image.width}
              height={image.height}
              sizes={index === 0 ? "(max-width: 767px) 85vw, 617px" : "(max-width: 767px) 38vw, 273px"}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </div>
        ))}
        <GalleryControls />
      </div>
    </div>
  );
}

function DesktopLocationStory({
  location,
  paragraphs,
  galleryAlts,
}: {
  location: SpaceLocation;
  paragraphs: string[];
  galleryAlts: string[];
}) {
  const isDark = location.theme === "dark";

  return (
    <div className="relative mx-auto hidden h-[655px] max-w-[1400px] md:block">
      <div
        className={cn(
          "absolute top-[122px] h-[411px] w-[393px] overflow-hidden font-sans text-xl leading-[1.4]",
          isDark ? "left-[calc(66.666%-1px)] text-cream" : "left-[52px] text-ink"
        )}
      >
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="mb-7 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>

      <AccentScroll
        className={cn(
          "absolute top-[122px] h-[411px]",
          isDark ? "left-[calc(91.666%+59px)]" : "left-[calc(25%+112px)]"
        )}
      />

      <div
        className={cn(
          "absolute top-[122px] flex h-[411px] gap-2.5 overflow-hidden",
          isDark ? "left-0 w-[653px]" : "left-[calc(33.333%+25px)] w-[890px]"
        )}
      >
        {location.gallery.map((image, index) => (
          <div
            key={image.image}
            className={cn(
              "relative h-full shrink-0 overflow-hidden",
              isDark
                ? index === 0
                  ? "w-[617px]"
                  : "w-[739px]"
                : index === 0
                  ? "w-[617px]"
                  : "w-[273px]"
            )}
          >
            <img
              src={image.image}
              alt={galleryAlts[index] ?? ""}
              width={image.width}
              height={image.height}
              sizes={index === 0 ? "(max-width: 767px) 85vw, 617px" : "(max-width: 767px) 38vw, 739px"}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </div>
        ))}
        <GalleryControls />
      </div>
    </div>
  );
}

function LocationStory({
  location,
  paragraphs,
  galleryAlts,
}: {
  location: SpaceLocation;
  paragraphs: string[];
  galleryAlts: string[];
}) {
  const isDark = location.theme === "dark";

  return (
    <section className={cn("overflow-hidden", isDark ? "bg-ink" : "bg-cream")}>
      <MobileLocationStory location={location} paragraphs={paragraphs} galleryAlts={galleryAlts} />
      <DesktopLocationStory location={location} paragraphs={paragraphs} galleryAlts={galleryAlts} />
    </section>
  );
}

function SpaceFooter({
  mailLabel,
  telLabel,
  addressLabel,
  followLabel,
  socialLabels,
}: {
  mailLabel: string;
  telLabel: string;
  addressLabel: string;
  followLabel: string;
  socialLabels: Record<string, string>;
}) {
  return (
    <footer className="space-footer bg-ink text-cream">
      <div className="relative mx-auto h-[371px] max-w-[1400px] md:h-[360px]">
        <Link href="/" className="absolute left-4 top-[59px] inline-block cursor-pointer md:left-[53px] md:top-[108px]">
          <img
            src="/images/logo.png"
            alt={businessInfo.name}
            width={683}
            height={110}
            sizes="(max-width: 767px) 306px, 306px"
            loading="lazy"
            decoding="async"
            className="h-auto w-[306px]"
          />
        </Link>

        <address className="absolute left-4 top-[115px] not-italic md:left-[calc(50%+13px)] md:top-[108px]">
          <dl className="space-y-0 font-sans text-base leading-[1.4] text-white md:text-lg md:leading-6">
            <div>
              <dt className="inline">{mailLabel} </dt>
              <dd className="inline">
                <a href={`mailto:${businessInfo.email}`} className="cursor-pointer transition-colors hover:text-gold">
                  {businessInfo.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="inline">{telLabel} </dt>
              <dd className="inline">
                <a
                  href={`tel:${businessInfo.phone.replace(/\s/g, "")}`}
                  className="cursor-pointer transition-colors hover:text-gold"
                >
                  {businessInfo.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt>{addressLabel}</dt>
              {businessInfo.locations.map((location) => (
                <dd key={location.id}>{location.address}</dd>
              ))}
            </div>
          </dl>
        </address>

        <div className="absolute left-4 top-[268px] md:left-[calc(87.5%-59px)] md:top-[107px]">
          <p className="font-sans text-[19px] leading-6 text-cream">[&nbsp; {followLabel} &nbsp;]</p>
          <div className="mt-[13px] flex items-center gap-4 md:justify-center">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.icon as keyof typeof socialIcons];
              return (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLabels[social.id] ?? social.id}
                  className="flex size-[34px] cursor-pointer items-center justify-center text-cream transition-colors hover:text-gold"
                >
                  <Icon className="size-[34px]" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

export async function SpaceSignatureSection() {
  const t = await getTranslations("spacePage");
  const tFooter = await getTranslations("footer");

  return (
    <article className="space-page bg-cream">
      <style>{`body:has(.space-page) > footer:not(.space-footer){display:none;}`}</style>

      {spaceLocations.map((location, index) => (
        <div key={location.id}>
          <HeroImage location={location} heading={t(`locations.${location.id}.heading`)} isFirst={index === 0} />
          <LocationStory
            location={location}
            paragraphs={t.raw(`locations.${location.id}.paragraphs`) as string[]}
            galleryAlts={t.raw(`locations.${location.id}.galleryAlts`) as string[]}
          />
        </div>
      ))}

      <SpaceFooter
        mailLabel={tFooter("mail")}
        telLabel={tFooter("tel")}
        addressLabel={tFooter("address")}
        followLabel={tFooter("followUs")}
        socialLabels={tFooter.raw("social") as Record<string, string>}
      />
    </article>
  );
}
