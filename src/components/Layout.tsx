import type { ReactNode } from 'react';

import { Navbar } from './Navbar';

/* =========================================================
   Types
========================================================= */

interface LayoutProps {
  readonly children: ReactNode;
}

/* =========================================================
   View
========================================================= */

class LayoutClass {
  render = ({ children }: LayoutProps) => {
    return (
      <div
        className="
          relative
          flex
          min-h-dvh
          w-full
          flex-col
          bg-background
          text-foreground
          selection:bg-primary/30
          selection:text-foreground
        "
      >
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-[160px]" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[160px]" />
        </div>

        <Navbar />

        <main
          className="
            flex-1
            relative
            z-0
            w-full
            scroll-smooth
          "
        >
          {children}
        </main>
      </div>
    );
  };
}

const layoutInstance = new LayoutClass();

export const Layout = layoutInstance.render;
