'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '@/app/components/auth/AuthCard';
import AuthField from '@/app/components/auth/AuthField';
import SocialDivider from '@/app/components/auth/SocialDivider';
import { authStyles } from '@/app/lib/auth-styles';
import { ROUTES } from '@/app/lib/constants/routes';
import { registerAction } from '@/app/actions/auth';
import { useLocale } from '@/app/lib/i18n/LocaleProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const confirmTouched = confirmPassword.length > 0;
  const passwordMatch = password === confirmPassword;
  const confirmValid = confirmTouched && passwordMatch;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t.auth.passwordsMismatch);
      return;
    }
    if (password.length < 8) {
      setError(t.auth.passwordTooShort);
      return;
    }

    setIsLoading(true);
    const result = await registerAction({ username, email, password });

    if (result.success) {
      router.push(ROUTES.DASHBOARD);
      return;
    }

    setError(result.error);
    setIsLoading(false);
  };

  return (
    <AuthCard
      title={t.auth.registerTitle}
      subtitle={t.auth.registerSubtitle}
    >
      {error && (
        <div className={`mb-6 ${authStyles.alertError}`} role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          id="reg-username"
          type="text"
          name="username"
          label={t.common.username}
          value={username}
          onChange={handleChange}
          autoComplete="username"
          required
          placeholder={t.auth.usernamePlaceholder}
        />
        <AuthField
          id="reg-email"
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
          id="reg-password"
          type="password"
          name="password"
          label={t.common.password}
          value={password}
          onChange={handleChange}
          autoComplete="new-password"
          required
          placeholder={t.auth.passwordPlaceholder}
          hint={t.auth.passwordHint}
        />
        <AuthField
          id="reg-confirm"
          type="password"
          name="confirmPassword"
          label={t.auth.confirmPassword}
          value={confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
          placeholder={t.auth.repeatPassword}
          state={confirmTouched ? (confirmValid ? 'success' : 'error') : undefined}
          hint={
            confirmTouched
              ? confirmValid
                ? t.auth.passwordsMatch
                : t.auth.passwordsNoMatch
              : undefined
          }
        />

        <label className="flex items-start gap-3 cursor-pointer animate-field-reveal">
          <input
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-amber-500 accent-amber-500 focus:ring-amber-500/50"
          />
          <span className="text-sm text-muted">
            {t.auth.agreeTerms}{' '}
            <Link href="#" className={authStyles.linkMuted}>{t.auth.termsOfService}</Link> {t.auth.and}{' '}
            <Link href="#" className={authStyles.linkMuted}>{t.auth.privacyPolicy}</Link>.
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading || (confirmTouched && !confirmValid)}
          className={authStyles.btnPrimary}
        >
          {isLoading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-stone-900/40 border-t-stone-900 rounded-full animate-spin" />
              {t.auth.creatingAccount}
            </span>
          ) : (
            t.auth.createAccount
          )}
        </button>
      </form>

      <SocialDivider label={t.auth.orSignUpWith}>
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
        {t.auth.hasAccount}{' '}
        <Link href={ROUTES.LOGIN} className={authStyles.link}>
          {t.common.signIn}
        </Link>
      </p>
    </AuthCard>
  );
}
