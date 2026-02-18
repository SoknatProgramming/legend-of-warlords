'use client';

import { useLocale } from '@/app/lib/i18n/LocaleProvider';
import type { Locale } from '@/app/lib/i18n';

const labels: Record<Locale, string> = {
  en: 'EN',
  km: 'ខ្មែរ',
};

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const next: Locale = locale === 'en' ? 'km' : 'en';

  return (
    <button
      onClick={() => setLocale(next)}
      className="rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-muted transition-all duration-200 hover:bg-surface-hover hover:text-heading hover:border-line focus:outline-none focus:ring-2 focus:ring-amber-400/40"
      title={locale === 'en' ? 'ប្ដូរទៅភាសាខ្មែរ' : 'Switch to English'}
    >
      {labels[next]}
    </button>
  );
}
