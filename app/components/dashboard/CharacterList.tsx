'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCharacter } from '@/app/actions/account';
import { useLocale } from '@/app/lib/i18n/LocaleProvider';
import type { GameCharacter } from '@/app/lib/types/auth';
import type { Translations } from '@/app/lib/i18n';

const factionKey: Record<string, keyof Translations['characters']> = {
  None: 'factionNone',
  Shaolin: 'factionShaolin',
  'Tang Clan': 'factionTangClan',
  'Five Poison': 'factionFivePoison',
  'Beggar Sect': 'factionBeggarSect',
  Wudang: 'factionWudang',
  Emei: 'factionEmei',
  'Royal Guard': 'factionRoyalGuard',
  Kunlun: 'factionKunlun',
};

interface Props {
  characters: GameCharacter[];
  hasSecondaryPassword: boolean;
}

export default function CharacterList({ characters, hasSecondaryPassword }: Props) {
  const router = useRouter();
  const { t } = useLocale();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [secondaryPw, setSecondaryPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async (charId: string) => {
    setError('');
    setLoading(true);

    const result = await deleteCharacter({
      characterId: charId,
      secondaryPassword: hasSecondaryPassword ? secondaryPw : undefined,
    });
    setLoading(false);

    if (result.success) {
      setDeletingId(null);
      setSecondaryPw('');
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  if (characters.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface/50 p-8 text-center transition-colors duration-300">
        <p className="text-3xl mb-2">⚔️</p>
        <p className="text-sm font-medium text-muted">{t.characters.noCharacters}</p>
        <p className="text-xs text-faint mt-1">{t.characters.noCharactersHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {characters.map((char) => (
        <div
          key={char.id}
          className="rounded-xl border border-line bg-surface p-4 sm:p-5 backdrop-blur-md transition-all hover:border-line duration-300"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Character info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-linear-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-lg shrink-0">
                  ⚔️
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-heading truncate">{char.name}</h4>
                  <p className={`text-xs ${char.faction === 'None' ? 'text-faint' : 'text-amber-600 dark:text-amber-400/80'}`}>
                    {(factionKey[char.faction] ? t.characters[factionKey[char.faction]] : char.faction) as string}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-faint">{t.common.level}</span>
                  <p className="text-sm font-bold text-body">{char.level}</p>
                </div>
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-faint">{t.characters.jpoint}</span>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{char.jpoint.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-faint">{t.common.gold}</span>
                  <p className="text-sm font-bold text-yellow-600 dark:text-yellow-500/80">{char.gold.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Delete button */}
            <div className="shrink-0">
              {deletingId === char.id ? (
                <div className="space-y-2">
                  {error && (
                    <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
                  )}
                  {hasSecondaryPassword && (
                    <input
                      type="password"
                      placeholder={t.characters.secondaryPwPlaceholder}
                      value={secondaryPw}
                      onChange={(e) => setSecondaryPw(e.target.value)}
                      className="w-full rounded-lg bg-input-bg border border-line px-3 py-2 text-xs text-heading placeholder:text-faint outline-none focus:border-red-500/50 transition-colors"
                    />
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(char.id)}
                      disabled={loading}
                      className="rounded-md bg-red-500/20 border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-300 transition-all hover:bg-red-500/30 disabled:opacity-50"
                    >
                      {loading ? '...' : t.common.confirm}
                    </button>
                    <button
                      onClick={() => { setDeletingId(null); setError(''); setSecondaryPw(''); }}
                      className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface"
                    >
                      {t.common.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setDeletingId(char.id)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-faint transition-all hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10"
                >
                  {t.common.delete}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
