'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { navigation, businessInfo } from '@/shared/constants/site.constant';
import { TheHomeLogo, IcArrowDown } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';

function isNavItemActive(pathname: string, href: string) {
  const hrefPath = href.startsWith('#') ? '/' : href.split('#')[0];
  return pathname === hrefPath;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('header');
  const tCommon = useTranslations('common');
  const [mobileOpen, setMobileOpen] = useState(false);

  // The Menu page sits on a cream background (not the hero video), so it
  // needs dark text/logo/button instead of the cream-on-video treatment.
  const isDark = pathname?.startsWith('/menu');

  const switchLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gold/25 backdrop-blur-md">
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
            {navigation.main.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'text-base font-sans transition-colors border-b pb-0.5',
                    active ? 'font-semibold' : 'border-transparent',
                    isDark
                      ? active
                        ? 'text-ink border-ink'
                        : 'text-ink hover:text-umber'
                      : active
                        ? 'text-cream border-cream'
                        : 'text-cream hover:text-white'
                  )}
                >
                  {t(`nav.${item.id}`)}
                </Link>
              );
            })}

            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  'flex items-center gap-1.5 text-base font-sans outline-none transition-colors focus-ring',
                  isDark ? 'text-ink hover:text-umber' : 'text-cream hover:text-white'
                )}
              >
                {locale.toUpperCase()}
                <IcArrowDown className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-36 rounded-lg border border-ink/15 bg-cream p-1 text-ink shadow-xl"
              >
                {routing.locales.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    onSelect={() => switchLocale(loc)}
                    className={cn(
                      'cursor-pointer rounded-md px-3 py-2 font-sans text-sm focus:bg-ink focus:text-cream',
                      loc === locale && 'font-semibold text-umber'
                    )}
                  >
                    {tCommon(`language.${loc}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop CTA Button */}
          <Button
            asChild
            variant="outline"
            className={cn(
              'hidden lg:inline-flex max-w-35 w-full h-5.5 rounded-full border bg-transparent uppercase font-bold text-sm transition-colors',
              isDark
                ? 'border-ink text-ink hover:bg-ink hover:text-cream'
                : 'border-cream text-cream hover:bg-cream hover:text-ink'
            )}
          >
            <Link href="#reservation">{tCommon('bookTable')}</Link>
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
            className={cn(
              'flex size-11 shrink-0 items-center justify-center lg:hidden focus-ring',
              isDark ? 'text-ink' : 'text-cream'
            )}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </header>

      {/* Blurred scrim behind the mobile nav panel — rendered as a sibling
          of <header>, not a child: <header> has `backdrop-blur-md`, and
          `backdrop-filter` makes an element the containing block for its
          `position: fixed` descendants, which collapsed this scrim's height
          to 0 when it lived inside the header. */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-x-0 bottom-0 top-[46px] z-30 bg-ink/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 top-[46px] z-40 bg-ink shadow-xl lg:hidden"
        >
          <nav className="container-base flex flex-col gap-1 py-6">
            {navigation.main.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'min-h-12 border-b border-cream/15 py-3 font-sans text-lg text-cream transition-colors',
                    active && 'font-semibold text-gold'
                  )}
                >
                  {t(`nav.${item.id}`)}
                </Link>
              );
            })}

            <div className="flex items-center gap-4 py-4">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    switchLocale(loc);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    'font-sans text-sm uppercase tracking-wide text-cream/70 transition-colors',
                    loc === locale && 'font-semibold text-gold underline underline-offset-4'
                  )}
                >
                  {loc}
                </button>
              ))}
            </div>

            <Button
              asChild
              variant="outline"
              className="mt-2 h-11 w-full rounded-full border border-cream bg-transparent uppercase font-bold text-sm text-cream transition-colors hover:bg-cream hover:text-ink"
            >
              <Link href="#reservation" onClick={() => setMobileOpen(false)}>
                {tCommon('bookTable')}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}
