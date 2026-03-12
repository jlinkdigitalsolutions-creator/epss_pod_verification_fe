import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

/**
 * Reusable theme toggle (light/dark). Use inside ThemeProvider.
 * @example
 * <ThemeToggle className="ml-2" />
 * <ThemeToggle variant="outline" size="icon" />
 */
export function ThemeToggle({ className, variant = 'ghost', size = 'icon', onClick, ...props }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={(e) => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
        onClick?.(e);
      }}
      className={cn('shrink-0', className)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      {...props}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-muted-foreground hover:text-foreground" aria-hidden />
      ) : (
        <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground" aria-hidden />
      )}
      <span className="sr-only">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
    </Button>
  );
}
