import { Button } from '@components/ui/button';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@lib/utils';
import { languageStore } from '@store/language-store';
import { Dialog as SheetPrimitive } from 'radix-ui';
import * as React from 'react';

/* =========================================================
   Types
========================================================= */

type SheetProps = React.ComponentProps<typeof SheetPrimitive.Root>;

type SheetTriggerProps = React.ComponentProps<typeof SheetPrimitive.Trigger>;

type SheetCloseProps = React.ComponentProps<typeof SheetPrimitive.Close>;

type SheetPortalProps = React.ComponentProps<typeof SheetPrimitive.Portal>;

type SheetOverlayProps = React.ComponentProps<typeof SheetPrimitive.Overlay>;

type SheetContentProps = React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
};

type SheetTitleProps = React.ComponentProps<typeof SheetPrimitive.Title>;

type SheetDescriptionProps = React.ComponentProps<typeof SheetPrimitive.Description>;

type SheetHeaderProps = React.ComponentProps<'div'>;

type SheetFooterProps = React.ComponentProps<'div'>;

/* =========================================================
   Sheet
========================================================= */

export class Sheet extends React.Component<SheetProps> {
  override render() {
    const props = this.props;

    return <SheetPrimitive.Root data-slot="sheet" {...props} />;
  }
}

/* =========================================================
   Sheet Trigger
========================================================= */

export class SheetTrigger extends React.Component<SheetTriggerProps> {
  override render() {
    const props = this.props;

    return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
  }
}

/* =========================================================
   Sheet Close
========================================================= */

export class SheetClose extends React.Component<SheetCloseProps> {
  override render() {
    const props = this.props;

    return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
  }
}

/* =========================================================
   Sheet Portal
========================================================= */

export const SheetPortal = function SheetPortal(props: SheetPortalProps) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
};

/* =========================================================
   Sheet Overlay
========================================================= */

export const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  SheetOverlayProps
>(function SheetOverlay({ className, ...props }, forwardedRef) {
  return (
    <SheetPrimitive.Overlay
      ref={forwardedRef}
      data-slot="sheet-overlay"
      className={cn(
        String.raw`fixed inset-0 z-50 bg-black/80 duration-100 data-ending-style\:opacity-0 data-starting-style\:opacity-0 supports-backdrop-filter\:backdrop-blur-xs data-open\:animate-in data-open\:fade-in-0 data-closed\:animate-out data-closed\:fade-out-0`,
        className,
      )}
      {...props}
    />
  );
});

/* =========================================================
   Sheet Content
========================================================= */

export const SheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(function SheetContent(
  { className, children, side = 'right', showCloseButton = true, ...props },
  forwardedRef,
) {
  return (
    <SheetPrimitive.Portal>
      <SheetOverlay />

      <SheetPrimitive.Content
        ref={forwardedRef}
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          String.raw`fixed z-50 flex flex-col bg-background bg-clip-padding text-xs/relaxed shadow-lg transition duration-200 ease-in-out data-[side=bottom]\:inset-x-0 data-[side=bottom]\:bottom-0 data-[side=bottom]\:h-auto data-[side=bottom]\:border-t data-[side=left]\:inset-y-0 data-[side=left]\:left-0 data-[side=left]\:h-full data-[side=left]\:w-3/4 data-[side=left]\:border-r data-[side=right]\:inset-y-0 data-[side=right]\:right-0 data-[side=right]\:h-full data-[side=right]\:w-3/4 data-[side=right]\:border-l data-[side=top]\:inset-x-0 data-[side=top]\:top-0 data-[side=top]\:h-auto data-[side=top]\:border-b data-[side=left]\:sm\:max-w-sm data-[side=right]\:sm\:max-w-sm data-open\:animate-in data-open\:fade-in-0 data-[side=bottom]\:data-open\:slide-in-from-bottom-10 data-[side=left]\:data-open\:slide-in-from-left-10 data-[side=right]\:data-open\:slide-in-from-right-10 data-[side=top]\:data-open\:slide-in-from-top-10 data-closed\:animate-out data-closed\:fade-out-0 data-[side=bottom]\:data-closed\:slide-out-to-bottom-10 data-[side=left]\:data-closed\:slide-out-to-left-10 data-[side=right]\:data-closed\:slide-out-to-right-10 data-[side=top]\:data-closed\:slide-out-to-top-10`,
          className,
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <SheetPrimitive.Close data-slot="sheet-close" asChild>
            <Button variant="ghost" className="absolute top-4 right-4" size="icon-sm">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />

              <span className="sr-only">{languageStore.t('nav.close')}</span>
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
});

/* =========================================================
   Sheet Header
========================================================= */

export class SheetHeader extends React.Component<SheetHeaderProps> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <div
        data-slot="sheet-header"
        className={cn('flex flex-col gap-1.5 p-6', className)}
        {...props}
      />
    );
  }
}

/* =========================================================
   Sheet Footer
========================================================= */

export class SheetFooter extends React.Component<SheetFooterProps> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <div
        data-slot="sheet-footer"
        className={cn('mt-auto flex flex-col gap-2 p-6', className)}
        {...props}
      />
    );
  }
}

/* =========================================================
   Sheet Title
========================================================= */

export class SheetTitle extends React.Component<SheetTitleProps> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <SheetPrimitive.Title
        data-slot="sheet-title"
        className={cn('text-sm font-medium text-foreground', className)}
        {...props}
      />
    );
  }
}

/* =========================================================
   Sheet Description
========================================================= */

export class SheetDescription extends React.Component<SheetDescriptionProps> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <SheetPrimitive.Description
        data-slot="sheet-description"
        className={cn('text-xs/relaxed text-muted-foreground', className)}
        {...props}
      />
    );
  }
}
