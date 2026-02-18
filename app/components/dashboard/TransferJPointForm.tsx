'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { transferJPoint } from '@/app/actions/account';
import { useLocale } from '@/app/lib/i18n/LocaleProvider';
import type { GameCharacter } from '@/app/lib/types/auth';

interface Props {
  characters: GameCharacter[];
}

export default function TransferJPointForm({ characters }: Props) {
  const router = useRouter();
  const { t } = useLocale();
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (characters.length < 2) return null;

  const fromChar = characters.find((c) => c.id === fromId);
  const maxAmount = fromChar?.jpoint ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await transferJPoint({
      fromCharacterId: fromId,
      toCharacterId: toId,
      amount: Number(amount),
    });
    setLoading(false);

    if (result.success) {
      setSuccess(result.message ?? '');
      setAmount('');
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  const selectClass =
    'w-full rounded-lg bg-input-bg border border-line px-4 py-3 text-sm text-heading outline-none transition-all focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 appearance-none';
  const inputClass =
    'w-full rounded-lg bg-input-bg border border-line px-4 py-3 text-sm text-heading placeholder:text-faint outline-none transition-all focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30';

  return (
    <div className="rounded-xl border border-line bg-surface p-6 backdrop-blur-md transition-colors duration-300">
      <h3 className="text-base font-bold text-heading mb-1">{t.dashboard.transferJPoint}</h3>
      <p className="text-xs text-faint mb-4">
        {t.characters.jpoint} only — {t.common.gold} cannot be transferred from website
      </p>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* From */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{t.dashboard.transferFrom}</label>
            <select
              value={fromId}
              onChange={(e) => { setFromId(e.target.value); setError(''); }}
              required
              className={selectClass}
            >
              <option value="" disabled>{t.dashboard.selectCharacter}</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === toId}>
                  {c.name} — {c.jpoint.toLocaleString()} JP
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{t.dashboard.transferTo}</label>
            <select
              value={toId}
              onChange={(e) => { setToId(e.target.value); setError(''); }}
              required
              className={selectClass}
            >
              <option value="" disabled>{t.dashboard.selectCharacter}</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === fromId}>
                  {c.name} — {c.jpoint.toLocaleString()} JP
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            {t.dashboard.transferAmount}
            {fromId && (
              <span className="ml-2 text-faint">
                (max: {maxAmount.toLocaleString()})
              </span>
            )}
          </label>
          <input
            type="number"
            min={1}
            max={maxAmount || undefined}
            placeholder="0"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(''); }}
            required
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !fromId || !toId || !amount}
          className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-900 transition-all hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? t.dashboard.transferring : t.dashboard.transferButton}
        </button>
      </form>
    </div>
  );
}
