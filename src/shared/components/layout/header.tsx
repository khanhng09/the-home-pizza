'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { navigation, businessInfo, bookingLink } from '@/shared/constants/site.constant';
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

  // /menu and everything under /story sit on cream paper rather than a
  // hero video or photo, so the header needs dark type, a dark logo and
  // the ink-filled CTA there. This is a prefix match on /story on purpose:
  // an individual article used to run on dark paper and was the one
  // exception, but it is cream now too, so the landing and its posts share
  // one treatment.
  const isDark = pathname.startsWith('/menu');

  const switchLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gold/25 backdrop-blur-md">
        <div className="container-base flex h-[var(--header-height)] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0 cursor-pointer">
            <TheHomeLogo
              aria-label={businessInfo.name}
              className={cn('h-4 w-auto lg:h-3.5', isDark ? 'text-ink' : 'text-cream')}
            />
          </Link>

          {/* Main Navigation */}
          <nav className="hidden lg:flex items-center gap-7.5 h-full">
            {navigation.main.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'cursor-pointer text-base font-sans transition-colors border-b h-full flex items-center justify-center',
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
                  'flex h-full cursor-pointer items-center gap-1 border-b border-transparent px-1 font-sans text-base outline-none transition-colors data-[state=open]:border-current',
                  isDark
                    ? 'text-ink hover:text-umber data-[state=open]:text-umber'
                    : 'text-cream hover:text-white data-[state=open]:text-white'
                )}
              >
                {locale.toUpperCase()}
                <IcArrowDown className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={0}
                className={cn(
                  'w-35 min-w-35 rounded-t-none rounded-b-[3px] border p-0 shadow-none backdrop-blur-md',
                  isDark
                    ? 'border-ink/15 bg-gold/25 text-ink'
                    : 'border-cream/25 bg-gold/25 text-cream'
                )}
              >
                {routing.locales.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    onSelect={() => switchLocale(loc)}
                    className={cn(
                      'h-10 cursor-pointer rounded-none border-b border-current/15 px-3 font-sans text-sm transition-colors last:border-b-0 focus:bg-current/10 focus:text-current',
                      loc === locale ? 'font-semibold opacity-100' : 'opacity-75 hover:opacity-100'
                    )}
                  >
                    {tCommon(`language.${loc}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop CTA Button — same filled pill as the hero's "Đặt bàn",
              which is the reference treatment for every CTA on the site. On
              the cream-backed screens a cream fill would disappear, so those
              get the ink-filled twin rather than a different shape. */}
          <Button
            asChild
            className={cn(
              'btn-cta hidden w-full max-w-35 lg:inline-flex',
              isDark ? 'bg-ink text-cream hover:bg-umber' : 'bg-cream text-ink hover:bg-linen'
            )}
          >
            <a href={bookingLink} target="_blank" rel="noopener noreferrer">{tCommon('bookTable')}</a>
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
            className={cn(
              'flex size-11 shrink-0 cursor-pointer items-center justify-center lg:hidden',
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
          className="fixed inset-x-0 bottom-0 top-[46px] z-30 cursor-pointer bg-ink/60 backdrop-blur-sm lg:hidden"
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
                    'min-h-12 cursor-pointer border-b border-cream/15 py-3 font-sans text-lg text-cream transition-colors',
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
                    'cursor-pointer font-sans text-sm uppercase tracking-wide text-cream/70 transition-colors',
                    loc === locale && 'font-semibold text-gold underline underline-offset-4'
                  )}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Same filled pill as everywhere else, but kept at 44px rather
                than the CTA's 32: this one is a row in the mobile nav, sized
                with the nav links above it, and it is a touch target. */}
            <Button
              asChild
              className="btn-cta mt-2 h-11 w-full bg-cream text-ink hover:bg-linen"
            >
              <a href={bookingLink} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
                {tCommon('bookTable')}
              </a>
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}
