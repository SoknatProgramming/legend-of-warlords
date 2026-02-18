import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/app/actions/auth';
import { getAccountProfile } from '@/app/actions/account';
import { getT } from '@/app/lib/i18n';
import { getLocaleFromCookies } from '@/app/lib/i18n/server';
import { ROUTES } from '@/app/lib/constants/routes';
import SecondaryPasswordForm from '@/app/components/dashboard/SecondaryPasswordForm';

export default async function SecurityPage() {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.LOGIN);

  const locale = await getLocaleFromCookies();
  const t = getT(locale);

  const profile = await getAccountProfile();
  if (!profile) redirect(ROUTES.DASHBOARD);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pt-10 pb-24 sm:px-8 sm:pt-14">
      {/* Back link */}
      <Link
        href={ROUTES.DASHBOARD}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-heading mb-8"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        {t.dashboard.backToDashboard}
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-heading sm:text-3xl">
          {t.dashboard.securityTitle}
        </h1>
        <p className="mt-2 text-muted text-sm sm:text-base">
          {t.dashboard.securitySubtitle}
        </p>
      </div>

      {/* Account info summary */}
      <div className="rounded-xl border border-line bg-surface p-5 backdrop-blur-md mb-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">{t.common.username}</p>
            <p className="text-base font-semibold text-heading">{profile.username}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            profile.hasSecondaryPassword
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-stone-500/15 text-muted border border-stone-400/30 dark:border-stone-500/30'
          }`}>
            {profile.hasSecondaryPassword ? t.common.enabled : t.common.notSet}
          </span>
        </div>
      </div>

      {/* Secondary password form */}
      <SecondaryPasswordForm hasSecondaryPassword={profile.hasSecondaryPassword} />
    </div>
  );
}
