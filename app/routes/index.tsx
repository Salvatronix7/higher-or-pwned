import { createFileRoute } from '@tanstack/react-router';
import { ROUTES } from '~/constants';
import { WelcomeRoute } from './WelcomeRoute';

export const Route = createFileRoute(ROUTES.HOME)({
  component: WelcomeRoute,
});
