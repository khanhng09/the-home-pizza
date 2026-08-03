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
      <div className="container-base grid grid-cols-1 gap-10 py-16 lg:grid-cols-3 lg:gap-8">
        {/* Logo */}
        <div>
          <Link href="/" className="inline-block cursor-pointer">
            <TheHomeLogo aria-label={businessInfo.name} className="h-5 w-auto text-cream lg:h-8" />
          </Link>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2 text-sm text-cream/80">
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
          <p className="mt-2">{t('address')}</p>
          {/* The street addresses are localized too, not just their label —
              the constant's copy stays Vietnamese-only for the JSON-LD
              builders in `shared/lib/metadata.ts`, so the rendered text is
              looked up by the location's `id` instead. */}
          {businessInfo.locations.map((location) => (
            <p key={location.id}>{t(`locations.${location.id}`)}</p>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-start justify-start gap-3 lg:justify-end">
          <span className="text-sm text-cream/80">{t('followUs')}</span>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.icon as keyof typeof socialIcons];
              return (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(`social.${social.id}`)}
                  className="cursor-pointer text-cream/80 hover:text-cream transition-colors"
                >
                  <Icon size="sm" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer nav links */}
      <div className="border-t border-cream/10">
        <div className="container-base flex flex-wrap gap-6 py-6 text-xs text-cream/60">
          {navigation.footer.map((item) => (
            <Link key={item.id} href={item.href} className="cursor-pointer hover:text-cream transition-colors">
              {t(`nav.${item.id}`)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
