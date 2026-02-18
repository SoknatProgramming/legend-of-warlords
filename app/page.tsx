'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import ScrollReveal from '@/app/components/ScrollReveal';
import EventCard from '@/app/components/EventCard';
import EventModal from '@/app/components/EventModal';
import { ROUTES } from '@/app/lib/constants/routes';
import { useLocale } from '@/app/lib/i18n/LocaleProvider';
import type { GameEvent } from '@/app/lib/types/events';

export default function HomePage() {
  const { t } = useLocale();
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);
  const handleClose = useCallback(() => setSelectedEvent(null), []);

  const features = [
    { icon: '⚔️', title: t.landing.feat1Title, desc: t.landing.feat1Desc },
    { icon: '📈', title: t.landing.feat2Title, desc: t.landing.feat2Desc },
    { icon: '🏰', title: t.landing.feat3Title, desc: t.landing.feat3Desc },
  ] as const;

  const stats = [
    { value: '10K+', label: t.landing.statPlayers },
    { value: '500+', label: t.landing.statGuilds },
    { value: '1M+', label: t.landing.statBattles },
    { value: '99.9%', label: t.landing.statUptime },
  ] as const;

  const events: GameEvent[] = [
    {
      id: 'guild-war-s3',
      title: t.events.ev1Title,
      description: t.events.ev1Desc,
      details: t.events.ev1Details,
      date: t.events.ev1Date,
      status: 'live',
      image: '/events/guild-war.svg',
      badge: t.events.ev1Badge,
      rewards: [t.events.ev1Reward1, t.events.ev1Reward2, t.events.ev1Reward3, t.events.ev1Reward4],
    },
    {
      id: 'winter-festival',
      title: t.events.ev2Title,
      description: t.events.ev2Desc,
      details: t.events.ev2Details,
      date: t.events.ev2Date,
      status: 'live',
      image: '/events/winter-festival.svg',
      badge: t.events.ev2Badge,
      rewards: [t.events.ev2Reward1, t.events.ev2Reward2, t.events.ev2Reward3, t.events.ev2Reward4],
    },
    {
      id: 'double-xp',
      title: t.events.ev3Title,
      description: t.events.ev3Desc,
      details: t.events.ev3Details,
      date: t.events.ev3Date,
      status: 'upcoming',
      image: '/events/double-xp.svg',
      badge: t.events.ev3Badge,
      rewards: [t.events.ev3Reward1, t.events.ev3Reward2, t.events.ev3Reward3],
    },
    {
      id: 'new-faction',
      title: t.events.ev4Title,
      description: t.events.ev4Desc,
      details: t.events.ev4Details,
      date: t.events.ev4Date,
      status: 'upcoming',
      image: '/events/new-faction.svg',
      badge: t.events.ev4Badge,
      rewards: [t.events.ev4Reward1, t.events.ev4Reward2, t.events.ev4Reward3, t.events.ev4Reward4],
    },
    {
      id: 'martial-arts-cup',
      title: t.events.ev5Title,
      description: t.events.ev5Desc,
      details: t.events.ev5Details,
      date: t.events.ev5Date,
      status: 'upcoming',
      image: '/events/martial-arts.svg',
      badge: t.events.ev5Badge,
      rewards: [t.events.ev5Reward1, t.events.ev5Reward2, t.events.ev5Reward3, t.events.ev5Reward4],
    },
    {
      id: 'treasure-hunt',
      title: t.events.ev6Title,
      description: t.events.ev6Desc,
      details: t.events.ev6Details,
      date: t.events.ev6Date,
      status: 'ended',
      image: '/events/treasure-hunt.svg',
      badge: t.events.ev6Badge,
      rewards: [t.events.ev6Reward1, t.events.ev6Reward2, t.events.ev6Reward3],
    },
  ];

  return (
    <>
      <SiteHeader showAuthButtons />

      <main className="relative z-10 flex flex-1 flex-col items-center">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section id="overview" className="w-full max-w-5xl mx-auto text-center px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
          <ScrollReveal direction="down" delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300 mb-8">
              <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              {t.landing.seasonBadge}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="text-5xl font-extrabold tracking-tight text-heading sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.1]">
              {t.landing.heroTitle}
              <span className="mt-2 block bg-linear-to-r from-amber-500 via-amber-600 to-orange-500 dark:from-amber-200 dark:via-amber-400 dark:to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,191,36,0.15)] dark:drop-shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                {t.landing.heroHighlight}
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <p className="mt-8 text-lg text-body sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed">
              {t.landing.heroDesc}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
              <Link
                href={ROUTES.REGISTER}
                className="w-full sm:w-auto min-w-[240px] rounded-2xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 px-10 py-4 text-center text-lg font-bold text-stone-900 shadow-xl shadow-amber-500/20 dark:shadow-amber-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/30 dark:hover:shadow-amber-500/40 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-amber-400/50 active:scale-[0.98]"
              >
                {t.landing.ctaRegister}
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="w-full sm:w-auto min-w-[240px] rounded-2xl border-2 border-stone-300 dark:border-white/15 bg-white/60 dark:bg-white/5 px-10 py-4 text-center text-lg font-semibold text-stone-700 dark:text-stone-100 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/10 hover:border-stone-400 dark:hover:border-white/25 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-stone-300/30 dark:focus:ring-white/20 active:scale-[0.98]"
              >
                {t.landing.ctaSignIn}
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* ── Stats bar ───────────────────────────────────────── */}
        <ScrollReveal className="w-full max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 rounded-2xl border border-line bg-surface backdrop-blur-md p-6 sm:p-8 transition-colors duration-300">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 sm:text-3xl">
                  {value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-faint sm:text-sm">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Features ────────────────────────────────────────── */}
        <section id="features" className="mt-20 sm:mt-28 lg:mt-36 w-full max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl font-bold text-heading sm:text-4xl">
                {t.landing.featuresTitle}
              </h2>
              <p className="mt-4 text-muted text-lg max-w-xl mx-auto">
                {t.landing.featuresDesc}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            {features.map(({ icon, title, desc }, i) => (
              <ScrollReveal key={title} direction="up" delay={i * 0.12}>
                <div className="group rounded-2xl border border-line bg-surface p-8 backdrop-blur-md transition-all duration-300 hover:bg-surface-hover hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-2xl">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold text-heading transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-300">
                    {title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted">
                    {desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── Events ──────────────────────────────────────────── */}
        <section id="events" className="mt-20 sm:mt-28 lg:mt-36 w-full max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl font-bold text-heading sm:text-4xl">
                {t.events.sectionTitle}
              </h2>
              <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
                {t.events.sectionDesc}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <ScrollReveal key={event.id} direction="up" delay={i * 0.08}>
                <EventCard
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── Lore ────────────────────────────────────────────── */}
        <section className="mt-20 sm:mt-28 w-full max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal direction="none">
            <div className="rounded-2xl border border-amber-500/20 bg-linear-to-b from-amber-500/5 to-transparent p-10 sm:p-14 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-300 sm:text-3xl">
                {t.landing.loreTitle}
              </h2>
              <p className="mt-6 text-body leading-relaxed text-base sm:text-lg">
                {t.landing.loreDesc}
              </p>
              <div className="mt-8 h-px w-24 mx-auto bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
              <p className="mt-6 text-sm text-faint italic">
                {t.landing.loreQuote}
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ── Bottom CTA ──────────────────────────────────────── */}
        <section className="mt-20 sm:mt-28 pb-20 sm:pb-28 w-full max-w-2xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-heading sm:text-3xl">
              {t.landing.ctaTitle}
            </h2>
            <p className="mt-4 text-muted text-base sm:text-lg">
              {t.landing.ctaDesc}
            </p>
            <div className="mt-8">
              <Link
                href={ROUTES.REGISTER}
                className="inline-block rounded-2xl bg-amber-500 px-8 py-3.5 text-base font-bold text-stone-900 shadow-lg shadow-amber-500/20 dark:shadow-amber-500/25 transition-all duration-300 hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/30 dark:hover:shadow-amber-500/35 focus:outline-none focus:ring-4 focus:ring-amber-400/50 active:scale-[0.98]"
              >
                {t.landing.ctaButton}
              </Link>
            </div>
            <p className="mt-6 text-sm text-faint">
              {t.landing.ctaHasAccount}{' '}
              <Link
                href={ROUTES.LOGIN}
                className="font-semibold text-amber-600 dark:text-amber-400 transition-colors hover:text-amber-500 dark:hover:text-amber-300"
              >
                {t.common.signIn}
              </Link>
            </p>
          </ScrollReveal>
        </section>
      </main>

      {/* Event detail modal */}
      <EventModal event={selectedEvent} onClose={handleClose} />
    </>
  );
}
