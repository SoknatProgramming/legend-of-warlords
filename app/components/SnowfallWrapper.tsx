'use client';

import { Snowfall } from 'react-snowfall';
import { ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface SnowfallWrapperProps {
  children: ReactNode;
}

export default function SnowfallWrapper({ children }: SnowfallWrapperProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme === 'dark';

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Snowfall — white in dark mode, bold amber/gold in light mode */}
      <Snowfall
        snowflakeCount={isDark ? 300 : 250}
        color={isDark ? '#ffffff' : '#b45309'}
        images={[]}
        radius={isDark ? [0.5, 2.5] : [1, 3]}
        speed={[0.5, 2]}
        wind={[-2, 1]}
      />
      <Snowfall
        snowflakeCount={isDark ? 150 : 120}
        color={isDark ? '#ffffffcc' : '#d97706'}
        images={[]}
        radius={isDark ? [1, 3] : [1.5, 4]}
        speed={[0.2, 1]}
        wind={[-1, 2]}
      />
      {/* Third layer — deeper orange in light mode for variety */}
      {!isDark && (
        <Snowfall
          snowflakeCount={80}
          color="#c2410c"
          images={[]}
          radius={[1, 2.5]}
          speed={[0.3, 1.2]}
          wind={[0, 1.5]}
        />
      )}

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-amber-500/4 to-orange-500/6 dark:via-yellow-600/5 dark:to-orange-600/10 pointer-events-none animate-pulse" />

      {/* Cinematic vignette */}
      <div className="absolute inset-0 shadow-2xl shadow-amber-900/10 dark:shadow-black/60 pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
