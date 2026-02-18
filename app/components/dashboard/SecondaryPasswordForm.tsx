'use client';

import { useState } from 'react';
import { setSecondaryPassword, removeSecondaryPassword } from '@/app/actions/account';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/app/lib/i18n/LocaleProvider';
import { ROUTES } from '@/app/lib/constants/routes';

interface Props {
  hasSecondaryPassword: boolean;
}

export default function SecondaryPasswordForm({ hasSecondaryPassword }: Props) {
  const router = useRouter();
  const { t } = useLocale();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemove, setShowRemove] = useState(false);

  const handleSet = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPw !== confirmPw) {
      setError(t.secPw.passwordsMismatch);
      return;
    }

    setLoading(true);
    const result = await setSecondaryPassword({
      currentPassword: hasSecondaryPassword ? currentPw : undefined,
      newPassword: newPw,
    });
    setLoading(false);

    if (result.success) {
      setSuccess(result.message ?? '');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setTimeout(() => router.push(ROUTES.DASHBOARD), 1200);
    } else {
      setError(result.error);
    }
  };

  const handleRemove = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await removeSecondaryPassword({ currentPassword: currentPw });
    setLoading(false);

    if (result.success) {
      setSuccess(result.message ?? '');
      setCurrentPw('');
      setShowRemove(false);
      setTimeout(() => router.push(ROUTES.DASHBOARD), 1200);
    } else {
      setError(result.error);
    }
  };

  const inputClass =
    'w-full rounded-lg bg-input-bg border border-line px-4 py-3 text-sm text-heading placeholder:text-faint outline-none transition-all focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30';

  return (
    <div className="rounded-xl border border-line bg-surface p-6 backdrop-blur-md transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-heading">{t.secPw.title}</h3>
          <p className="text-xs text-muted mt-1">
            {hasSecondaryPassword ? t.secPw.enabledDesc : t.secPw.notSetDesc}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            hasSecondaryPassword
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-stone-500/15 text-muted border border-stone-400/30 dark:border-stone-500/30'
          }`}
        >
          {hasSecondaryPassword ? t.common.active : t.common.notSet}
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 text-sm text-emerald-600 dark:text-emerald-300">
          {success}
        </div>
      )}

      {!showRemove ? (
        <form onSubmit={handleSet} className="space-y-3">
          {hasSecondaryPassword && (
            <input
              type="password"
              placeholder={t.secPw.currentPlaceholder}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              required
              className={inputClass}
            />
          )}
          <input
            type="password"
            placeholder={hasSecondaryPassword ? t.secPw.newPlaceholder : t.secPw.createPlaceholder}
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            required
            minLength={6}
            className={inputClass}
          />
          <input
            type="password"
            placeholder={t.secPw.confirmPlaceholder}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            required
            className={inputClass}
          />
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-900 transition-all hover:bg-amber-400 disabled:opacity-50"
            >
              {loading ? t.common.saving : hasSecondaryPassword ? t.secPw.updatePassword : t.secPw.setPassword}
            </button>
            {hasSecondaryPassword && (
              <button
                type="button"
                onClick={() => setShowRemove(true)}
                className="rounded-lg border border-red-500/30 px-5 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 transition-all hover:bg-red-500/10"
              >
                {t.common.remove}
              </button>
            )}
          </div>
        </form>
      ) : (
        <form onSubmit={handleRemove} className="space-y-3">
          <p className="text-sm text-body">
            {t.secPw.removePrompt}
          </p>
          <input
            type="password"
            placeholder={t.secPw.currentPlaceholder}
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            required
            className={inputClass}
          />
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-red-500/20 border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-300 transition-all hover:bg-red-500/30 disabled:opacity-50"
            >
              {loading ? t.secPw.removing : t.secPw.confirmRemove}
            </button>
            <button
              type="button"
              onClick={() => { setShowRemove(false); setError(''); }}
              className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-muted transition-all hover:bg-surface"
            >
              {t.common.cancel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
