/**
 * Shared Tailwind class names for auth UI.
 * Single source of truth — no custom CSS classes, only Tailwind utilities.
 * Supports light/dark mode via semantic theme colors + dark: variants.
 */
export const authStyles = {
  /* ── Inputs ───────────────────────────────────── */
  input:
    'w-full rounded-xl bg-white/90 dark:bg-black/45 border border-amber-500/30 dark:border-amber-500/40 px-5 py-4 text-base text-stone-800 dark:text-amber-50 placeholder:text-stone-400 dark:placeholder:text-amber-400/50 placeholder:italic tracking-wide shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_1px_0_rgba(255,200,100,0.12)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_0_rgba(255,200,100,0.12)] outline-none transition-all duration-250 hover:border-amber-500/45 dark:hover:border-amber-500/55 hover:bg-white dark:hover:bg-black/50 focus:border-amber-400/70 dark:focus:border-amber-300/85 focus:bg-white dark:focus:bg-black/55 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-500/25 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_0_28px_rgba(217,119,6,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.45),0_0_28px_rgba(217,119,6,0.15)]',
  inputError:
    'border-red-500/60 dark:border-red-500/70 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:border-red-400/80 dark:focus:border-red-400/90 focus:ring-red-500/20 dark:focus:ring-red-500/25 animate-error-shake',
  inputSuccess:
    'border-emerald-400/40 dark:border-emerald-400/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:border-emerald-400/60 dark:focus:border-emerald-400/75 focus:ring-emerald-400/15 dark:focus:ring-emerald-400/20 animate-success-pulse',

  /* ── Buttons ──────────────────────────────────── */
  btnPrimary:
    'w-full py-3.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 font-semibold shadow-[0_0_25px_rgba(251,191,36,0.35)] dark:shadow-[0_0_25px_rgba(251,191,36,0.45)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] dark:hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-page disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 btn-shine',
  btnSecondary:
    'w-full py-2.5 rounded-xl border border-stone-300 dark:border-stone-600/70 bg-white/80 dark:bg-stone-900/70 text-stone-700 dark:text-stone-100 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800/90 hover:border-amber-400/60 transition-all duration-200',

  /* ── Alerts ───────────────────────────────────── */
  alertError:
    'rounded-xl bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-200 px-4 py-3 text-sm animate-error-shake',

  /* ── Card ─────────────────────────────────────── */
  card:
    'rounded-2xl border border-amber-500/30 dark:border-amber-500/45 bg-white/95 dark:bg-black/80 shadow-[0_20px_60px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl overflow-hidden animate-card-enter transition-colors duration-300',

  /* ── Tabs ─────────────────────────────────────── */
  cardTabs: 'flex border-b border-stone-200 dark:border-stone-700/80 bg-stone-50 dark:bg-black/60',
  tabActive:
    'flex-1 py-4 text-sm font-semibold transition-colors bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 shadow-[0_0_22px_rgba(251,191,36,0.8)]',
  tabInactive:
    'flex-1 py-4 text-sm font-semibold transition-colors text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-black/60',

  /* ── Divider ──────────────────────────────────── */
  divider: 'relative my-8',
  dividerLine: 'absolute inset-0 flex items-center',
  dividerText: 'relative flex justify-center',
  dividerLabel:
    'bg-white/95 dark:bg-black/85 px-3 text-[10px] font-medium uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500',

  /* ── Links ────────────────────────────────────── */
  link: 'text-amber-600 dark:text-amber-300 hover:text-amber-500 dark:hover:text-amber-200 font-semibold transition-colors',
  linkMuted:
    'text-amber-600 dark:text-amber-300 hover:text-amber-500 dark:hover:text-amber-200 underline underline-offset-2 transition-colors',
} as const;
