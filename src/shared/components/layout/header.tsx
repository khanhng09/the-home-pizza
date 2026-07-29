'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation, businessInfo } from '@/shared/constants/site.constant';
import { TheHomeLogo } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

export function Header() {
  const pathname = usePathname();
  // The Menu page sits on a cream background (not the hero video), so it
  // needs dark text/logo/button instead of the cream-on-video treatment.
  const isDark = pathname?.startsWith('/menu');

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-gold/25 backdrop-blur-md">
      <div className="container-base flex items-center justify-between h-[46px]">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <TheHomeLogo
            aria-label={businessInfo.name}
            className={cn('h-4 w-auto lg:h-6', isDark ? 'text-ink' : 'text-cream')}
          />
        </Link>

        {/* Main Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-base font-sans transition-colors',
                isDark ? 'text-ink hover:text-umber' : 'text-cream hover:text-white'
              )}
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
        <Button
          asChild
          variant="outline"
          className={cn(
            'max-w-24 sm:max-w-35 w-full h-5.5 rounded-full border bg-transparent uppercase font-bold text-xs sm:text-sm transition-colors',
            isDark
              ? 'border-ink text-ink hover:bg-ink hover:text-cream'
              : 'border-cream text-cream hover:bg-cream hover:text-ink'
          )}
        >
          <Link href="#reservation">Đặt bàn</Link>
        </Button>
      </div>
    </header>
  );
}
