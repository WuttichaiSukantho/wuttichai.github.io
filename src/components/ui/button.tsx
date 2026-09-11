import { buttonVariants } from '@lib/button-variant';
import { cn } from '@lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, Readonly<ButtonProps>>(function Button(
  { className, variant = 'default', size = 'default', asChild = false, ...props },
  forwardedRef,
) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      ref={forwardedRef}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  );
});
