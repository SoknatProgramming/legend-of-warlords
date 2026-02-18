'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ROUTES } from '@/app/lib/constants/routes';
import { useAppRoute } from '@/app/lib/hooks';
import { logoutAction } from '@/app/actions/auth';
import { useLocale } from '@/app/lib/i18n/LocaleProvider';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import type { SessionUser } from '@/app/lib/types/auth';

interface SiteHeaderProps {
  showAuthButtons?: boolean;
  user?: SessionUser | null;
}

export default function SiteHeader({ showAuthButtons = false, user }: SiteHeaderProps) {
  const router = useRouter();
  const { isLogin, isRegister } = useAppRoute();
  const { t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setVisible(y < lastScrollY.current || y < 10);
    setScrolled(y > 20);
    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const navLinks = [
    { href: '/#overview', label: t.header.navOverview },
    { href: '/#features', label: t.header.navFeatures },
    { href: '/#features', label: t.header.navCommunity },
  ] as const;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logoutAction();
    router.push(ROUTES.LOGIN);
    router.refresh();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-line backdrop-blur-xl transition-all duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled
          ? 'bg-overlay shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-overlay'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:gap-6 lg:gap-8 px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
        {/* Logo */}
        <Link
          href={user ? ROUTES.DASHBOARD : ROUTES.HOME}
          className="flex shrink-0 items-center gap-2.5 sm:gap-4 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-xl"
        >
          <div className="relative h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16 overflow-hidden rounded-xl bg-surface ring-2 ring-line shadow-lg">
            <Image
              src="/logo/logo.png"
              alt=""
              width={64}
              height={64}
              priority
              className="h-full w-full object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <span className="block text-lg font-bold tracking-tight text-heading sm:text-xl">
              {t.header.brand}
            </span>
            <span className="hidden lg:block text-xs font-medium uppercase tracking-widest text-amber-600 dark:text-amber-400/80">
              {t.header.tagline}
            </span>
          </div>
        </Link>

        {/* Nav links (desktop only) */}
        {!user && (
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {navLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="rounded-xl px-5 py-3 text-base font-medium text-muted transition-all duration-200 hover:bg-surface-hover hover:text-heading focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side: toggles + auth */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <LanguageSwitcher />

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl px-2 sm:px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-heading hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              >
                <span className="h-8 w-8 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-stone-900">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.username}</span>
                <svg
                  className={`h-4 w-4 text-faint transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-100 mt-2 w-52 origin-top-right rounded-xl border border-line bg-elevated backdrop-blur-xl shadow-2xl shadow-black/20 dark:shadow-black/40 animate-card-enter">
                  <div className="px-4 py-3 border-b border-line-subtle">
                    <p className="text-sm font-semibold text-heading truncate">{user.username}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>

                  <div className="py-1.5">
                    <Link
                      href={ROUTES.DASHBOARD}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-heading"
                    >
                      <svg className="h-4 w-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                      {t.header.menuDashboard}
                    </Link>
                    <Link
                      href={ROUTES.SECURITY}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-heading"
                    >
                      <svg className="h-4 w-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      {t.header.menuSecurity}
                    </Link>
                  </div>

                  <div className="border-t border-line-subtle py-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      {t.header.menuSignOut}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : showAuthButtons ? (
            <>
              <Link
                href={ROUTES.LOGIN}
                className={`hidden sm:inline-flex rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-200 hover:bg-surface-hover hover:text-heading focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:ring-offset-2 focus:ring-offset-transparent ${
                  isLogin ? 'bg-surface-hover text-heading' : 'text-body'
                }`}
              >
                {t.common.signIn}
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className={`rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold shadow-lg shadow-amber-500/25 transition-all duration-200 hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent active:scale-[0.98] ${
                  isRegister
                    ? 'ring-2 ring-amber-300 bg-amber-500 text-stone-900'
                    : 'bg-amber-500 text-stone-900'
                }`}
              >
                <span className="hidden sm:inline">{t.header.playFree}</span>
                <span className="sm:hidden">{t.common.signIn}</span>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
