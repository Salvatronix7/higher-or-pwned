import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';
import { memo } from 'react';
import { TerminalText } from '~/components/ui/TerminalText';
import type { ResultSearchParams } from './ResultRoute';
import { ResultRoute } from './ResultRoute';

export const Route = createFileRoute('/result')({
  validateSearch: (search: Record<string, unknown>): ResultSearchParams => ({
    score: Number(search.score) || 0,
  }),
  component: ResultPage,
});

const Header: FC = memo(() => (
  <header className="header">
    <TerminalText text='HIGHER || PWNED' duration={750} />
  </header>
));

Header.displayName = 'Header';

function ResultPage() {
  const { score } = Route.useSearch();

  return <ResultRoute score={score} />;
}
