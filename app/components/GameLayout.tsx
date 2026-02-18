'use client';

import Image from 'next/image';
import { type ReactNode } from 'react';
import SnowfallWrapper from './SnowfallWrapper';
import RouteTransitionWrapper from './RouteTransitionWrapper';
import ScrollToTop from './ScrollToTop';

interface GameLayoutProps {
  children: ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <SnowfallWrapper>
      <div className="min-h-screen relative flex flex-col px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 overflow-hidden transition-colors duration-300">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="relative h-full w-full">
            <Image
              src="/background/IMG_9077.PNG"
              alt=""
              fill
              priority
              className="object-cover opacity-20 dark:opacity-35 sm:opacity-25 dark:sm:opacity-45 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-300"
            />
            {/* Light mode: warm parchment gradient / Dark mode: deep black overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-amber-50/85 via-orange-50/75 to-stone-100/90 dark:from-black/80 dark:via-black/80 dark:to-black/95 transition-colors duration-300" />
          </div>
        </div>

        {/* Ambient glow — warmer & more visible in light mode */}
        <div
          className="pointer-events-none absolute -top-28 -left-20 h-80 w-80 rounded-full bg-amber-400/15 dark:bg-amber-500/18 blur-[90px] animate-float-soft"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-orange-400/12 dark:bg-orange-600/20 blur-[110px] animate-float-soft"
          style={{ animationDelay: '-2s' }}
          aria-hidden
        />
        {/* Extra light-mode glow for a warm feel */}
        <div
          className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-rose-300/8 dark:bg-transparent blur-[100px] animate-float-soft"
          style={{ animationDelay: '-4s' }}
          aria-hidden
        />

        <RouteTransitionWrapper>{children}</RouteTransitionWrapper>
        <ScrollToTop />
      </div>
    </SnowfallWrapper>
  );
}
