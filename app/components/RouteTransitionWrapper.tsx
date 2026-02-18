'use client';

import { motion } from 'framer-motion';

interface RouteTransitionWrapperProps {
  children: React.ReactNode;
}

/**
 * Simple fade-in wrapper for page content.
 * No AnimatePresence / key-based remounting — avoids "more hooks" errors
 * when navigating between pages with different hook counts.
 */
export default function RouteTransitionWrapper({ children }: RouteTransitionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex min-h-full flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
