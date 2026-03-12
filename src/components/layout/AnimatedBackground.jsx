import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Simple animated background: soft gradient with a slow flow animation.
 */
export function AnimatedBackground({ className }) {
  return (
    <div
      className={cn(
        'fixed inset-0 -z-10',
        'bg-gradient-to-b from-background to-muted/30 dark:to-muted/20',
        className
      )}
      aria-hidden
    >
      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25] animate-gradient-flow"
        style={{
          background: 'linear-gradient(110deg, transparent 0%, var(--primary) 15%, transparent 35%, var(--muted) 55%, transparent 75%, var(--primary) 90%, transparent 100%)',
          backgroundSize: '200% 200%',
        }}
        aria-hidden
      />
    </div>
  );
}
