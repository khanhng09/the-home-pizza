import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { businessInfo, navigation, socialLinks } from '@/shared/constants/site.constant';
import { IcFacebook, IcInstagram, TheHomeLogo } from '@/shared/components/icons';

const socialIcons = {
  IcFacebook,
  IcInstagram,
};

export async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="bg-ink text-cream">
      <div className="container-base grid grid-cols-1 lg:grid-cols-2 gap-6 py-16 lg:gap-8">
        {/* Logo */}
        <div className='lg:flex-2'>
          <Link href="/" className="inline-block cursor-pointer">
            <TheHomeLogo aria-label={businessInfo.name} className="w-auto text-cream h-5.75" />
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-between">
          {/* Contact Info */}
          <div className="flex flex-col lg:gap-1.5 text-base lg:text-lg text-white lg:flex-1.5">
            <p>
              {t('mail')}{' '}
              <a href={`mailto:${businessInfo.email}`} className="cursor-pointer hover:text-cream transition-colors">
                {businessInfo.email}
              </a>
            </p>
            <p>
              {t('tel')}{' '}
              <a href={`tel:${businessInfo.phone.replace(/\s/g, '')}`} className="cursor-pointer hover:text-cream transition-colors">
                {businessInfo.phone}
              </a>
            </p>
            {/* The street addresses are localized too, not just their label —
              the constant's copy stays Vietnamese-only for the JSON-LD
              builders in `shared/lib/metadata.ts`, so the rendered text is
              looked up by the location's `id` instead. */}
            <div className="lg:mt-2">
              <p>{t('address')}</p>
              {businessInfo.locations.map((location) => (
                <p key={location.id}>{t(`locations.${location.id}`)}</p>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-start gap-2 lg:flex-0.5">
            <p className="text-lg text-cream/80 whitespace-nowrap">[&nbsp;&nbsp;&nbsp;{t('followUs')}&nbsp;&nbsp;&nbsp;]</p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.icon as keyof typeof socialIcons];
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(`social.${social.id}`)}
                    className="cursor-pointer text-white hover:text-cream transition-colors flex items-center justify-center"
                  >
                    <Icon size="lg" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer nav links */}
      {/* <div className="border-t border-cream/10">
        <div className="container-base flex flex-wrap gap-6 py-6 text-xs text-cream/60">
          {navigation.footer.map((item) => (
            <Link key={item.id} href={item.href} className="cursor-pointer hover:text-cream transition-colors">
              {t(`nav.${item.id}`)}
            </Link>
          ))}
        </div>
      </div> */}
    </footer>
  );
}
