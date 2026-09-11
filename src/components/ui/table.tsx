import { cn } from '@lib/utils';
import * as React from 'react';

/* =========================================================
   Table
========================================================= */

export class Table extends React.Component<React.ComponentProps<'table'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <div data-slot="table-container" className="relative w-full overflow-x-auto">
        <table
          data-slot="table"
          className={cn(String.raw`w-full caption-bottom text-xs`, className)}
          {...props}
        />
      </div>
    );
  }
}

/* =========================================================
   Table Header
========================================================= */

export class TableHeader extends React.Component<React.ComponentProps<'thead'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <thead
        data-slot="table-header"
        className={cn(String.raw`[&_tr]\\:border-b`, className)}
        {...props}
      />
    );
  }
}

/* =========================================================
   Table Body
========================================================= */

export class TableBody extends React.Component<React.ComponentProps<'tbody'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <tbody
        data-slot="table-body"
        className={cn('[&_tr\\:last-child]\\:border-0', className)}
        {...props}
      />
    );
  }
}

/* =========================================================
   Table Footer
========================================================= */

export class TableFooter extends React.Component<React.ComponentProps<'tfoot'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <tfoot
        data-slot="table-footer"
        className={cn(
          String.raw`border-t bg-muted/50 font-medium [&>tr]\:last\:border-b-0`,
          className,
        )}
        {...props}
      />
    );
  }
}

/* =========================================================
   Table Row
========================================================= */

export class TableRow extends React.Component<React.ComponentProps<'tr'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <tr
        data-slot="table-row"
        className={cn(
          String.raw`border-b transition-colors hover\:bg-muted/50 data-[state=selected]\:bg-muted`,
          className,
        )}
        {...props}
      />
    );
  }
}

/* =========================================================
   Table Head
========================================================= */

export class TableHead extends React.Component<React.ComponentProps<'th'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <th
        data-slot="table-head"
        className={cn(
          String.raw`h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&\:has([role=checkbox])]\:pr-0`,
          className,
        )}
        {...props}
      />
    );
  }
}

/* =========================================================
   Table Cell
========================================================= */

export class TableCell extends React.Component<React.ComponentProps<'td'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <td
        data-slot="table-cell"
        className={cn(
          String.raw`p-2 align-middle whitespace-nowrap [&\:has([role=checkbox])]\:pr-0`,
          className,
        )}
        {...props}
      />
    );
  }
}

/* =========================================================
   Table Caption
========================================================= */

export class TableCaption extends React.Component<React.ComponentProps<'caption'>> {
  override render() {
    const { className, ...props } = this.props;

    return (
      <caption
        data-slot="table-caption"
        className={cn('mt-4 text-xs text-muted-foreground', className)}
        {...props}
      />
    );
  }
}
