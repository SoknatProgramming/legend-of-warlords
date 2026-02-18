'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameEvent } from '@/app/lib/types/events';

interface EventModalProps {
  event: GameEvent | null;
  onClose: () => void;
}

const statusLabel = {
  live: { text: 'Live Now', class: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40' },
  upcoming: { text: 'Upcoming', class: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40' },
  ended: { text: 'Ended', class: 'bg-stone-500/20 text-stone-500 dark:text-stone-400 border-stone-500/30' },
} as const;

export default function EventModal({ event, onClose }: EventModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!event) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [event, onClose]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-white dark:bg-stone-950 shadow-2xl shadow-black/30"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Hero image */}
            <div className="relative h-56 sm:h-72 w-full overflow-hidden">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-white dark:from-stone-950 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="px-6 pb-8 -mt-8 relative">
              {/* Badge + date row */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusLabel[event.status].class}`}>
                  {event.status === 'live' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                  {statusLabel[event.status].text}
                </span>
                <span className="text-xs font-medium text-muted">{event.date}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-heading sm:text-3xl">
                {event.title}
              </h2>

              <p className="mt-4 text-body leading-relaxed">
                {event.details}
              </p>

              {/* Rewards */}
              {event.rewards && event.rewards.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-heading uppercase tracking-wider mb-3">
                    Rewards
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {event.rewards.map((reward) => (
                      <div
                        key={reward}
                        className="flex items-center gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3"
                      >
                        <span className="text-amber-500 text-sm">★</span>
                        <span className="text-sm font-medium text-body">{reward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action */}
              {event.status !== 'ended' && (
                <div className="mt-8">
                  <button className="rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 px-8 py-3 text-base font-bold text-stone-900 shadow-lg shadow-amber-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/35 active:scale-[0.98]">
                    {event.status === 'live' ? 'Join Now' : 'Set Reminder'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
