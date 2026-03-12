import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Modern input: hover/focus transitions, optional icons, error state.
 * Variant: default | filled (subtle bg for read-only).
 */
const Input = React.forwardRef(
  (
    {
      className,
      type = 'text',
      error,
      leftIcon,
      rightIcon,
      disabled,
      variant = 'default',
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const hasError = error ?? ariaInvalid;
    const isFilled = variant === 'filled';

    return (
      <div className="relative w-full group">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError && typeof error === 'string' ? `${props.id}-error` : undefined}
          className={cn(
            'flex h-12 w-full rounded-xl border bg-background px-4 py-3 text-sm transition-all duration-200',
            'placeholder:text-muted-foreground',
            'hover:border-input hover:bg-muted/20',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-primary/60 focus-visible:bg-background',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50 disabled:hover:bg-muted/50',
            'dark:bg-card/80 dark:border-input dark:hover:bg-muted/30 dark:focus-visible:ring-primary dark:focus-visible:bg-card',
            hasError &&
              'border-destructive focus-visible:ring-destructive focus-visible:border-destructive/60',
            isFilled && 'bg-muted/30 hover:bg-muted/40 focus-visible:bg-muted/30 dark:bg-muted/20',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
