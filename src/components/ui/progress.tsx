import { cn } from '@lib/utils';
import { Progress as ProgressPrimitive } from 'radix-ui';
import * as React from 'react';

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>;

export class Progress extends React.Component<ProgressProps> {
  override render() {
    const { className, value, ...props } = this.props;

    const progressValue = value ?? 0;

    return (
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          'relative flex h-1 w-full items-center overflow-x-hidden rounded-md bg-muted',
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="size-full flex-1 bg-primary transition-all"
          style={{
            transform: `translateX(-${100 - progressValue}%)`,
          }}
        />
      </ProgressPrimitive.Root>
    );
  }
}
