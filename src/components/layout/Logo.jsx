import React from 'react';
import { cn } from '@/lib/utils';

import logoImg from '@/assets/logo.png';

export function Logo({ className, variant = 'stacked', size = 'md' }) {
  const isInline = variant === 'inline';
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[140px]',
    md: 'h-10 w-auto max-w-[180px]',
    lg: 'h-12 md:h-14 w-auto max-w-[220px]',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        isInline ? 'flex-row' : 'flex-col',
        className
      )}
    >
      <img
        src={logoImg}
        alt="Ethiopian Pharmaceutical Supply Service"
        className={cn(
          'object-contain object-left',
          sizeClasses[size],
          'dark:invert'
        )}
      />
      {!isInline && (
        <span className="text-[10px] md:text-xs text-muted-foreground tracking-wider uppercase mt-2">
          Receiving Voucher
        </span>
      )}
    </div>
  );
}

export function LogoIcon({ className }) {
  return (
    <img
      src={logoImg}
      alt="EPS"
      className={cn('h-9 w-auto object-contain dark:invert', className)}
    />
  );
}
