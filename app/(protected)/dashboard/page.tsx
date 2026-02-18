import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/app/actions/auth';
import { getAccountProfile, getCharacters } from '@/app/actions/account';
import { getT } from '@/app/lib/i18n';
import { getLocaleFromCookies } from '@/app/lib/i18n/server';
import { ROUTES } from '@/app/lib/constants/routes';
import LogoutButton from '@/app/components/LogoutButton';
import CharacterList from '@/app/components/dashboard/CharacterList';
import CreateCharacterForm from '@/app/components/dashboard/CreateCharacterForm';
import TransferJPointForm from '@/app/components/dashboard/TransferJPointForm';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const locale = await getLocaleFromCookies();
  const t = getT(locale);

  const [profile, characters] = await Promise.all([
    getAccountProfile(),
    getCharacters(),
  ]);

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 text-center">
        <p className="text-muted">{t.dashboard.profileError}</p>
        <div className="mt-4"><LogoutButton /></div>
      </div>
    );
  }

  const totalJPoint = characters.reduce((sum, c) => sum + c.jpoint, 0);
  const totalGold = characters.reduce((sum, c) => sum + c.gold, 0);
  const highestLevel = characters.length > 0 ? Math.max(...characters.map((c) => c.level)) : 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-10 pb-24 sm:px-8 sm:pt-14">
      {/* ── Welcome banner ──────────────────────────────── */}
      <div className="rounded-2xl border border-amber-500/30 bg-linear-to-br from-amber-500/10 via-transparent to-orange-500/5 p-8 sm:p-10 backdrop-blur-sm transition-colors duration-300">
        <h1 className="text-3xl font-extrabold text-heading sm:text-4xl">
          {t.dashboard.welcomeBack}{' '}
          <span className="bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-300 dark:to-orange-400 bg-clip-text text-transparent">
            {user.username}
          </span>
        </h1>
        <p className="mt-2 text-muted text-base sm:text-lg">
          {t.dashboard.subtitle}
        </p>
      </div>

      {/* ── Account Stats ───────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-line bg-surface p-5 backdrop-blur-md text-center transition-colors duration-300">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-faint">{t.dashboard.statCharacters}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-amber-600 dark:text-amber-400">{characters.length}<span className="text-sm text-faint font-medium">/10</span></p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5 backdrop-blur-md text-center transition-colors duration-300">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-faint">{t.dashboard.statHighestLevel}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-amber-600 dark:text-amber-400">{highestLevel || '—'}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5 backdrop-blur-md text-center transition-colors duration-300">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-faint">{t.dashboard.statTotalJPoint}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-amber-600 dark:text-amber-400">{totalJPoint.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5 backdrop-blur-md text-center transition-colors duration-300">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-faint">{t.dashboard.statTotalGold}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-yellow-600 dark:text-yellow-500/80">{totalGold.toLocaleString()}</p>
        </div>
      </div>

      {/* ── Characters Section ──────────────────────────── */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-heading">{t.dashboard.gameCharacters}</h2>
          <span className="text-xs font-medium text-faint">
            {characters.length}/10 {t.dashboard.slotsUsed}
          </span>
        </div>

        <CharacterList
          characters={characters}
          hasSecondaryPassword={profile.hasSecondaryPassword}
        />

        <div className="mt-4">
          <CreateCharacterForm characterCount={characters.length} />
        </div>
      </section>

      {/* ── JPoint Transfer ─────────────────────────────── */}
      <section className="mt-10">
        <TransferJPointForm characters={characters} />
      </section>

      {/* ── Account Profile ─────────────────────────────── */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-heading mb-5">{t.dashboard.accountProfile}</h2>

        <div className="rounded-xl border border-line bg-surface p-6 backdrop-blur-md transition-colors duration-300">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-line-subtle pb-3">
              <span className="text-sm text-muted">{t.common.username}</span>
              <span className="text-sm font-medium text-body">{profile.username}</span>
            </div>
            <div className="flex items-center justify-between border-b border-line-subtle pb-3">
              <span className="text-sm text-muted">{t.common.email}</span>
              <span className="text-sm font-medium text-body">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between border-b border-line-subtle pb-3">
              <span className="text-sm text-muted">{t.dashboard.accountId}</span>
              <span className="text-xs font-mono text-muted">{profile.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{t.dashboard.secondaryPassword}</span>
              <Link
                href={ROUTES.SECURITY}
                className={`inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-amber-500 dark:hover:text-amber-300 ${profile.hasSecondaryPassword ? 'text-emerald-600 dark:text-emerald-400' : 'text-faint'}`}
              >
                {profile.hasSecondaryPassword ? t.common.enabled : t.common.notSet}
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logout ──────────────────────────────────────── */}
      <div className="mt-10 pt-6 border-t border-line-subtle">
        <LogoutButton />
      </div>
    </div>
  );
}
