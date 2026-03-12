import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

const PARTICLE_COUNT = 32;
const PARALLAX_FACTOR = 0.015;

/**
 * Animated background: subtle gradient + soft particles with reduced blur and mouse parallax.
 */
export function AnimatedBackground({ className }) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      size: 80 + (i % 120),
      left: `${(i * 19 + 7) % 92}%`,
      top: `${(i * 27 + 13) % 86}%`,
      delay: `${(i * 0.5) % 8}s`,
      duration: 18 + (i % 10),
      opacity: 0.06 + (i % 5) * 0.02,
      alt: i % 3 === 0,
    }));
  }, []);

  const onMove = useCallback((e) => {
    setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [onMove]);

  const dx = (mouse.x - 0.5) * 100 * PARALLAX_FACTOR;
  const dy = (mouse.y - 0.5) * 100 * PARALLAX_FACTOR;

  return (
    <div
      className={cn('fixed inset-0 -z-10 overflow-hidden', 'bg-gradient-to-b from-background to-muted/30 dark:to-muted/20', className)}
      aria-hidden
    >
      {/* Subtle gradient flow — lower opacity, no blur */}
      <div
        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1] animate-gradient-flow pointer-events-none"
        style={{
          background:
            'linear-gradient(110deg, transparent 0%, var(--primary) 12%, transparent 38%, var(--muted) 55%, transparent 72%, var(--primary) 88%, transparent 100%)',
          backgroundSize: '200% 200%',
        }}
        aria-hidden
      />

      {/* Soft particles: less blur, tint from primary with opacity */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${dx}px, ${dy}px)`,
        }}
        aria-hidden
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className={cn(
              'absolute rounded-full',
              p.alt ? 'animate-particle-float-alt' : 'animate-particle-float'
            )}
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              opacity: p.opacity,
              animationDelay: p.delay,
              animationDuration: `${p.duration}s`,
              background: `radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--primary) 35%, transparent), transparent 65%)`,
              filter: 'blur(10px)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
