import Link from 'next/link';
import { navigation, businessInfo } from '@/shared/constants/site.constant';

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-gold/25 backdrop-blur-md">
      <div className="container-base flex items-center justify-between h-[46px]">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img
            src="/images/logo.webp"
            alt={businessInfo.name}
            width={170.53}
            height={23.49}
            className="h-6 w-auto"
          />
        </Link>

        {/* Main Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-sans text-cream hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {/* {navigation.locales.map((locale) => (
            <Link
              key={locale.href}
              href={locale.href}
              className="text-2xl font-sans text-cream/90 hover:text-cream transition-colors flex items-center gap-1"
            >
              {locale.label}
              <span aria-hidden="true">⌄</span>
            </Link>
          ))} */}
        </nav>

        {/* CTA Button */}
        <Link
          href="#reservation"
          className="flex items-center justify-center uppercase max-w-35 font-bold text-sm w-full rounded-full h-5.5 border border-cream text-cream hover:bg-cream hover:text-ink transition-colors"
        >
          Đặt bàn
        </Link>
      </div>
    </header>
  );
}
