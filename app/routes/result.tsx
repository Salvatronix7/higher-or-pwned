import { createFileRoute } from '@tanstack/react-router';
import { ResultRoute } from './ResultRoute';
import type { ResultSearchParams } from './ResultRoute';

export const Route = createFileRoute('/result')({
  validateSearch: (search: Record<string, unknown>): ResultSearchParams => ({
    score: Number(search.score) || 0,
  }),
  component: ResultPage,
});

function ResultPage() {
  const { score } = Route.useSearch();

  return <ResultRoute score={score} />;
}
