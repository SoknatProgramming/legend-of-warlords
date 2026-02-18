'use client';

import { motion } from 'framer-motion';

const variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.2 },
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps page content for smooth route transitions.
 * Use with layout so only inner content animates (no flash of background).
 */
export default function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      key={undefined}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
