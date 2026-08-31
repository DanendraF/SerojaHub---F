import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]',
  {
    variants: {
      variant: {
        default: 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs border border-emerald-600/30',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 shadow-xs',
        outline:
          'border border-stone-300/80 bg-white/10 backdrop-blur-sm text-stone-900 hover:bg-stone-100/80 dark:border-stone-700 dark:text-white',
        secondary:
          'bg-stone-100 text-stone-900 hover:bg-stone-200/80 border border-stone-200/80 dark:bg-stone-800 dark:text-stone-100',
        ghost: 'hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800',
        link: 'text-emerald-700 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-5 text-sm',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
