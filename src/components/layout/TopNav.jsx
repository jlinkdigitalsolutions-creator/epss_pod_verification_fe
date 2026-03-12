import React, { useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

export function TopNav({ user, onLogout, title }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/98 backdrop-blur-md shadow-sm">
      <div className="flex h-14 md:h-16 items-center justify-between gap-4 px-4 md:px-8 lg:px-10 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 md:gap-6 min-w-0">
          <Logo variant="inline" size="sm" className="shrink-0" />
          {title && (
            <span className="hidden sm:inline text-sm font-medium text-muted-foreground truncate max-w-[200px] md:max-w-xs pl-2 border-l border-border">
              {title}
            </span>
          )}
        </div>

        <div className="relative flex items-center gap-1 md:gap-2">
          <ThemeToggle
            variant="ghost"
            size="icon"
            className="shrink-0 h-9 w-9 md:h-10 md:w-10 rounded-lg hover:bg-muted/80 transition-colors"
          />
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg py-2 pl-2 pr-3 md:pl-3 md:pr-4 min-h-[40px] border border-border bg-muted/40 hover:bg-muted/70 hover:border-primary/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <span className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </span>
            <span className="hidden sm:block text-left text-sm font-medium truncate max-w-[120px] md:max-w-[140px]">
              {user?.name || 'Deliverer'}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform duration-200',
                profileOpen && 'rotate-180'
              )}
            />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                aria-hidden="true"
                onClick={() => setProfileOpen(false)}
              />
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-border bg-card p-1 shadow-lg z-50 animate-scale-in"
              >
                <div className="px-3 py-2.5 border-b border-border">
                  <p className="text-sm font-medium truncate">{user?.name || 'Deliverer'}</p>
                  <p className="text-xs text-muted-foreground truncate">ID: {user?.id || '—'}</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout?.();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
