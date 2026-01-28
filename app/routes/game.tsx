import { createFileRoute } from '@tanstack/react-router';
import { GameRoute } from './GameRoute';

export const Route = createFileRoute('/game')({
  component: GameRoute,
});
