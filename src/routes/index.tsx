import { Index } from '@components/home/index-observer';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => <Index />,
});
