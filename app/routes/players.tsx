import { createFileRoute } from '@tanstack/react-router';
import { ROUTES } from '~/constants';
import { Players } from './PlayersRoute/PlayersRoute';

export const Route = createFileRoute(ROUTES.PLAYERS)({
    component: Players,
});
