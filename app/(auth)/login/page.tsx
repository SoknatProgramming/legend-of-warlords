'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '@/app/components/auth/AuthCard';
import AuthField from '@/app/components/auth/AuthField';
import SocialDivider from '@/app/components/auth/SocialDivider';
import { authStyles } from '@/app/lib/auth-styles';
import { ROUTES } from '@/app/lib/constants/routes';
import { loginAction } from '@/app/actions/auth';
import { useLocale } from '@/app/lib/i18n/LocaleProvider';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await loginAction({ email, password });

    if (result.success) {
      router.push(ROUTES.DASHBOARD);
      return;
    }

    setError(result.error);
    setIsLoading(false);
  };

  return (
    <AuthCard
      title={t.auth.loginTitle}
      subtitle={t.auth.loginSubtitle}
    >
      {error && (
        <div className={`mb-6 ${authStyles.alertError}`} role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          id="login-email"
          type="email"
          name="email"
          label={t.common.email}
          value={email}
          onChange={handleChange}
          autoComplete="email"
          required
          placeholder={t.auth.emailPlaceholder}
        />
        <AuthField
          id="login-password"
          type="password"
          name="password"
          label={t.common.password}
          value={password}
          onChange={handleChange}
          autoComplete="current-password"
          required
          placeholder={t.auth.passwordPlaceholder}
        />

        <div className="flex items-center justify-between text-xs sm:text-sm mt-1">
          <label className="flex items-center gap-2 cursor-pointer text-muted hover:text-body transition-colors">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-amber-500 accent-amber-500 focus:ring-amber-500/50"
            />
            <span>{t.auth.rememberMe}</span>
          </label>
          <Link href="#" className={authStyles.linkMuted}>
            {t.auth.forgotPassword}
          </Link>
        </div>

        <button type="submit" disabled={isLoading} className={authStyles.btnPrimary}>
          {isLoading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-stone-900/40 border-t-stone-900 rounded-full animate-spin" />
              {t.auth.signingIn}
            </span>
          ) : (
            t.common.signIn
          )}
        </button>
      </form>

      <SocialDivider label={t.auth.orContinueWith}>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className={authStyles.btnSecondary}>
            {t.common.google}
          </button>
          <button type="button" className={authStyles.btnSecondary}>
            {t.common.discord}
          </button>
        </div>
      </SocialDivider>

      <p className="mt-6 text-center text-sm text-muted">
        {t.auth.noAccount}{' '}
        <Link href={ROUTES.REGISTER} className={authStyles.link}>
          {t.auth.createOne}
        </Link>
      </p>
    </AuthCard>
  );
}
