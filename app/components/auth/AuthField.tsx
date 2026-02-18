'use client';

import { type InputHTMLAttributes, type ReactNode } from 'react';
import { authStyles } from '@/app/lib/auth-styles';

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  id: string;
  label: string;
  hint?: ReactNode;
  /** 'success' | 'error' for confirm password etc. */
  state?: 'success' | 'error' | undefined;
}

export default function AuthField({ id, label, hint, state, ...inputProps }: AuthFieldProps) {
  const inputClass = [
    authStyles.input,
    state === 'error' && authStyles.inputError,
    state === 'success' && authStyles.inputSuccess,
  ]
    .filter(Boolean)
    .join(' ');

  const hintClass =
    state === 'success'
      ? 'text-xs text-emerald-600 dark:text-emerald-400/90 mt-1'
      : state === 'error'
        ? 'text-xs text-red-500 dark:text-red-400/95 mt-1'
        : 'text-xs text-amber-600/60 dark:text-amber-400/60 mt-1';

  return (
    <div className="flex flex-col gap-2 animate-field-reveal">
      <label htmlFor={id} className="text-sm font-medium text-stone-700 dark:text-amber-50/90 tracking-wide">
        {label}
      </label>
      <input id={id} className={inputClass} {...inputProps} />
      {hint != null && <p className={hintClass}>{hint}</p>}
    </div>
  );
}
