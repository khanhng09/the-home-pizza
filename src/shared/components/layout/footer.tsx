import Link from 'next/link';
import { businessInfo, navigation, socialLinks } from '@/shared/constants/site.constant';
import { IcFacebook, IcInstagram, TheHomeLogo } from '@/shared/components/icons';

const socialIcons = {
  IcFacebook,
  IcInstagram,
};

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="container-base grid grid-cols-1 gap-10 py-16 lg:grid-cols-3 lg:gap-8">
        {/* Logo */}
        <div>
          <Link href="/" className="inline-block">
            <TheHomeLogo aria-label={businessInfo.name} className="h-8 w-auto text-cream" />
          </Link>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2 text-sm text-cream/80">
          <p>
            Mail:{' '}
            <a href={`mailto:${businessInfo.email}`} className="hover:text-cream transition-colors">
              {businessInfo.email}
            </a>
          </p>
          <p>
            Tel:{' '}
            <a href={`tel:${businessInfo.phone.replace(/\s/g, '')}`} className="hover:text-cream transition-colors">
              {businessInfo.phone}
            </a>
          </p>
          <p className="mt-2">Address:</p>
          {businessInfo.locations.map((location) => (
            <p key={location.id}>{location.address}</p>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-start justify-start gap-3 lg:justify-end">
          <span className="text-sm text-cream/80">Follow Nhà</span>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.icon as keyof typeof socialIcons];
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="text-cream/80 hover:text-cream transition-colors"
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
            <Link key={item.href} href={item.href} className="hover:text-cream transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
