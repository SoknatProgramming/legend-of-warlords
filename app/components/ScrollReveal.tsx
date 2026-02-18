'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { type ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
}

function getHiddenState(direction: Direction, distance: number) {
  switch (direction) {
    case 'up':    return { opacity: 0, y: distance };
    case 'down':  return { opacity: 0, y: -distance };
    case 'left':  return { opacity: 0, x: distance };
    case 'right': return { opacity: 0, x: -distance };
    case 'none':  return { opacity: 0, scale: 0.95 };
  }
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 50,
  once = true,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-80px 0px' });

  const hidden = getHiddenState(direction, distance);
  const visible = { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={isInView ? visible : hidden}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
