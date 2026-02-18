import 'server-only';

import { cookies } from 'next/headers';
import { LOCALE_COOKIE, type Locale } from './index';

/**
 * Read the locale from the cookie store (server-side only).
 * Must only be called from Server Components or Server Actions.
 */
export async function getLocaleFromCookies(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  if (raw === 'km') return 'km';
  return 'en';
}
