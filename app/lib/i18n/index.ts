import { en, type Translations } from './en';
import { km } from './km';

// ── Types ──────────────────────────────────────────────────────────────

export type Locale = 'en' | 'km';
export const LOCALES: Locale[] = ['en', 'km'];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'locale';

// ── Translation dictionaries ──────────────────────────────────────────

const dictionaries: Record<Locale, Translations> = { en, km };

/**
 * Get the translations object for a given locale.
 * Works in both server and client code.
 */
export function getT(locale: Locale = DEFAULT_LOCALE): Translations {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

// Re-exports
export type { Translations };
export { en, km };
