'use client';

import { type ReactNode } from 'react';
import { authStyles } from '@/app/lib/auth-styles';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <section
      className={authStyles.card}
      style={{ maxWidth: '28rem' }}
    >
      <div className="p-7 sm:p-9">
        <div className="mb-6 animate-title-reveal">
          <h2 className="text-xl font-bold text-heading">{title}</h2>
          <p className="text-sm text-muted mt-1">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
