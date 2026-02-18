'use client';

import Image from 'next/image';
import type { GameEvent } from '@/app/lib/types/events';

interface EventCardProps {
  event: GameEvent;
  onClick: () => void;
}

const statusStyles = {
  live: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
  upcoming: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
  ended: 'bg-stone-500/20 text-stone-500 dark:text-stone-400 border-stone-500/30',
} as const;

const statusDot = {
  live: 'bg-emerald-500 animate-pulse',
  upcoming: 'bg-amber-500',
  ended: 'bg-stone-400',
} as const;

export default function EventCard({ event, onClick }: EventCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl border border-line bg-surface text-left backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
    >
      {/* Image area */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm ${statusStyles[event.status]}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot[event.status]}`} />
            {event.badge}
          </span>
        </div>

        {/* Date */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-medium text-white/80">{event.date}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-heading transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-300 line-clamp-1">
          {event.title}
        </h3>
        <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">
          {event.description}
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 transition-colors group-hover:text-amber-500 dark:group-hover:text-amber-300">
          View details
          <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </button>
  );
}
