import { NotFoundComponent } from '@components/root/not-found';
import { RootComponent } from '@components/root/root-component';
import { createRootRoute } from '@tanstack/react-router';

import '@styles/globals.css';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});
