'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCharacter } from '@/app/actions/account';
import { useLocale } from '@/app/lib/i18n/LocaleProvider';

interface Props {
  characterCount: number;
}

export default function CreateCharacterForm({ characterCount }: Props) {
  const router = useRouter();
  const { t } = useLocale();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const isFull = characterCount >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await createCharacter({ name });
    setLoading(false);

    if (result.success) {
      setName('');
      setOpen(false);
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        disabled={isFull}
        className="w-full rounded-xl border-2 border-dashed border-line bg-surface/50 p-6 text-center transition-all hover:border-amber-500/40 hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="text-2xl">+</span>
        <p className="mt-1 text-sm font-medium text-muted">
          {isFull ? t.characters.maxReached : t.characters.createNew}
        </p>
        <p className="text-xs text-faint mt-0.5">
          {t.characters.slotsUsed.replace('{count}', String(characterCount))}
        </p>
      </button>
    );
  }

  const inputClass =
    'w-full rounded-lg bg-input-bg border border-line px-4 py-3 text-sm text-heading placeholder:text-faint outline-none transition-all focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30';

  return (
    <div className="rounded-xl border border-amber-500/30 bg-elevated p-6 backdrop-blur-md transition-colors duration-300">
      <h3 className="text-base font-bold text-heading mb-1">{t.characters.createNew}</h3>
      <p className="text-xs text-faint mb-4">{t.dashboard.noFaction}</p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">{t.characters.characterName}</label>
          <input
            type="text"
            placeholder={t.characters.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={16}
            pattern="^[a-zA-Z0-9_]+$"
            className={inputClass}
          />
          <p className="text-xs text-faint mt-1">{t.characters.nameHint}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-900 transition-all hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? t.characters.creating : t.characters.createCharacter}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setError(''); }}
            className="rounded-lg border border-line px-6 py-2.5 text-sm font-medium text-muted transition-all hover:bg-surface"
          >
            {t.common.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
