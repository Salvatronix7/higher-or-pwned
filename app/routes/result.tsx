import { createFileRoute } from '@tanstack/react-router';
import { ROUTES } from '~/constants';
import type { ResultSearchParams } from './ResultRoute';
import { ResultRoute } from './ResultRoute';

export const Route = createFileRoute(ROUTES.RESULT)({
  validateSearch: (search: Record<string, unknown>): ResultSearchParams => ({
    score: Number(search.score) || 0,
  }),
  component: ResultPage,
});

function ResultPage() {
  const { score } = Route.useSearch();

  return <ResultRoute score={score} />;
}
