'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { getT, DEFAULT_LOCALE, LOCALE_COOKIE, type Locale, type Translations } from './index';

interface LocaleContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Provides locale + translations to all client components.
 * The initial locale is read server-side and passed as a prop.
 */
export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((l: Locale) => {
    // Update cookie (1 year expiry, SameSite=Lax)
    document.cookie = `${LOCALE_COOKIE}=${l};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    setLocaleState(l);
    // Soft reload so server components re-render with new locale
    window.location.reload();
  }, []);

  const t = getT(locale);

  return (
    <LocaleContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Hook to access locale and translations from any client component.
 */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Fallback if used outside provider (shouldn't happen)
    return {
      locale: DEFAULT_LOCALE,
      t: getT(DEFAULT_LOCALE),
      setLocale: () => {},
    };
  }
  return ctx;
}
