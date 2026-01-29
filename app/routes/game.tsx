import { createFileRoute } from '@tanstack/react-router';
import { ROUTES } from '~/constants';
import { GameRoute } from './GameRoute';

export const Route = createFileRoute(ROUTES.GAME)({
  component: GameRoute,
});
