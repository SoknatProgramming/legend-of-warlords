'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logoutAction } from '@/app/actions/auth';
import { useLocale } from '@/app/lib/i18n/LocaleProvider';

export default function LogoutButton() {
  const router = useRouter();
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logoutAction();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-600 dark:text-red-300 transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-50"
    >
      {isLoading ? t.dashboard.signingOut : t.common.signOut}
    </button>
  );
}
