import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const defaultVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

const defaultTransition = { duration: 0.25, ease: [0.4, 0, 0.2, 1] };

/**
 * Wraps page content with Framer Motion for enter/exit animations.
 * Use with AnimatePresence when switching views for exit animations.
 */
export function PageTransition({
  children,
  className,
  variants = defaultVariants,
  transition = defaultTransition,
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
