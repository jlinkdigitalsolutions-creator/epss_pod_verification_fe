import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-xl border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-card-foreground',
        destructive:
          'border-destructive/50 bg-destructive/10 text-destructive dark:bg-destructive/20 dark:border-destructive/30',
        success:
          'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
        warning:
          'border-amber-500/50 bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400',
        info: 'border-primary/50 bg-primary/10 text-primary dark:bg-primary/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const iconMap = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
};

const Alert = React.forwardRef(({ className, variant = 'default', showIcon = true, children, ...props }, ref) => {
  const Icon = iconMap[variant];
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), showIcon && 'pl-11', className)}
      {...props}
    >
      {showIcon && <Icon />}
      {children}
    </div>
  );
});
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm opacity-90 [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
