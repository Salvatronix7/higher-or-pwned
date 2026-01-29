import { createFileRoute } from '@tanstack/react-router';
import { ROUTES } from '~/constants';
import { IndexRoute } from './IndexRoute';

export const Route = createFileRoute(ROUTES.HOME)({
  component: IndexRoute,
});
