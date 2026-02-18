'use client';

import { authStyles } from '@/app/lib/auth-styles';

interface SocialDividerProps {
  label: string;
  children: React.ReactNode;
}

export default function SocialDivider({ label, children }: SocialDividerProps) {
  return (
    <>
      <div className={authStyles.divider}>
        <div className={authStyles.dividerLine}>
          <div className="h-px w-full bg-linear-to-r from-transparent via-amber-500/30 dark:via-amber-500/40 to-transparent" />
        </div>
        <div className={authStyles.dividerText}>
          <span className={authStyles.dividerLabel}>{label}</span>
        </div>
      </div>
      {children}
    </>
  );
}
