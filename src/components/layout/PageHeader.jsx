import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Consistent page header for dashboard views. Title + optional description and meta.
 */
export function PageHeader({ title, description, className, children }) {
  return (
    <header className={cn(/*'mb-6 md:mb-8',*/ className)}>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}
