import { createFileRoute } from '@tanstack/react-router';
import { FireRoute } from './FireRoute';

export const Route = createFileRoute('/fire')({
  component: FireRoute,
});
