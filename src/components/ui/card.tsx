import { cn } from '@lib/utils';
import * as React from 'react';

interface CardProps extends React.ComponentProps<'div'> {
  size?: 'default' | 'sm';
}

export class Card extends React.Component<CardProps> {
  override render() {
    const { className, size = 'default', ...props } = this.props;

    return (
      <div
        data-slot="card"
        data-size={size}
        className={cn(
          String.raw`group/card flex flex-col gap-4 overflow-hidden rounded-lg bg-card py-4 text-xs/relaxed text-card-foreground ring-1 ring-foreground/10 has-[>img\:first-child]\:pt-0 data-[size=sm]\:gap-3 data-[size=sm]\:py-3 *:[img\:first-child]\:rounded-t-lg *:[img\:last-child]\:rounded-b-lg`,
          className,
        )}
        {...props}
      />
    );
  }
}

export class CardHeader extends React.Component<React.ComponentProps<'div'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <div
        data-slot="card-header"
        className={cn(
          String.raw`group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-lg px-4 group-data-[size=sm]/card\:px-3 has-data-[slot=card-action]\:grid-cols-[1fr_auto] has-data-[slot=card-description]\:grid-rows-[auto_auto] [.border-b]\:pb-4 group-data-[size=sm]/card:[.border-b]\:pb-3`,
          className,
        )}
        {...props}
      />
    );
  }
}

export class CardTitle extends React.Component<React.ComponentProps<'div'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <div data-slot="card-title" className={cn('text-sm font-medium', className)} {...props} />
    );
  }
}

export class CardDescription extends React.Component<React.ComponentProps<'div'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <div
        data-slot="card-description"
        className={cn('text-xs/relaxed text-muted-foreground', className)}
        {...props}
      />
    );
  }
}

export class CardAction extends React.Component<React.ComponentProps<'div'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <div
        data-slot="card-action"
        className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
        {...props}
      />
    );
  }
}

export class CardContent extends React.Component<React.ComponentProps<'div'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <div
        data-slot="card-content"
        className={cn(String.raw`px-4 group-data-[size=sm]/card\:px-3`, className)}
        {...props}
      />
    );
  }
}

export class CardFooter extends React.Component<React.ComponentProps<'div'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <div
        data-slot="card-footer"
        className={cn(
          String.raw`flex items-center rounded-b-lg px-4 group-data-[size=sm]/card\:px-3 [.border-t]\:pt-4 group-data-[size=sm]/card:[.border-t]\:pt-3`,
          className,
        )}
        {...props}
      />
    );
  }
}
