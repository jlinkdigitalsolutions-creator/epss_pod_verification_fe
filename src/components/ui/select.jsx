import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef(({ className, children, leftIcon, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'group relative flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background transition-all duration-200',
      'placeholder:text-muted-foreground',
      'hover:border-input hover:bg-muted/20',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary/60 focus:bg-background',
      'data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2 data-[state=open]:border-primary/60',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background',
      'dark:bg-card/80 dark:border-border dark:hover:bg-muted/30 dark:focus:bg-card dark:data-[state=open]:bg-card',
      '[&>span]:line-clamp-1 [&>span]:text-left',
      leftIcon && 'pl-11',
      className
    )}
    {...props}
  >
    {leftIcon && (
      <span className="pointer-events-none absolute left-3.5 text-muted-foreground group-data-[state=open]:text-primary [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0">
        {leftIcon}
      </span>
    )}
    {children}
    <SelectPrimitive.Icon asChild>
      <span className="flex shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180">
        <ChevronDown className="h-4 w-4 opacity-60" />
      </span>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef(
  ({ className, children, position = 'popper', sideOffset = 0, ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'relative z-50 max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg',
          'data-[state=open]:animate-select-open data-[state=closed]:animate-select-close',
          'dark:bg-card dark:border-border',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            'p-1.5',
            position === 'popper' && 'w-full'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-lg py-3 pl-9 pr-3 text-sm outline-none transition-colors duration-150',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText className="min-w-0 flex-1 truncate">
      {children}
    </SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem };
