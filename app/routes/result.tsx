import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, memo } from 'react';
import type { FC } from 'react';
import { Button } from '~/components';
import { getRandomItem } from '~/utils';
import { SARCASTIC_MESSAGES } from '~/constants';
import styles from './result.module.css';

interface ResultSearchParams {
  score: number;
}

export const Route = createFileRoute('/result')({
  validateSearch: (search: Record<string, unknown>): ResultSearchParams => ({
    score: Number(search.score) || 0,
  }),
  component: ResultPage,
});

const ASCII_ART = `
          .-"""-.
         /        \\
        /_        _\\
       // \\      / \\\\
       |\\__\\    /__/|
       \\    ||    /
        \\        /
         \\  __  /
          '.__.'
           |  |
          /|  |\\
         (_|  |_)
`;

const Header: FC = memo(() => (
  <header className={styles.header}>
    <h1 className={styles.title}>
      <span className={styles.glow}>HIGHER</span>
      <span className={styles.separator}> || </span>
      <span className={styles.glow}>PWNED</span>
      <span className={styles.cursor}>_</span>
    </h1>
  </header>
));

Header.displayName = 'Header';

function ResultPage() {
  const navigate = useNavigate();
  const { score } = Route.useSearch();

  const sarcasticMessage = useMemo(
    () => getRandomItem(SARCASTIC_MESSAGES),
    []
  );

  const handleRetry = useCallback(() => {
    navigate({ to: '/game' });
  }, [navigate]);

  const handleShare = useCallback(async () => {
    const shareText = `I scored ${score} on HIGHER || PWNED_ - the password breach guessing game! Can you beat my score?`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HIGHER || PWNED_',
          text: shareText,
        });
      } catch {
        await navigator.clipboard.writeText(shareText);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  }, [score]);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.scoreSection}>
          <span className={styles.scoreLabel}>score</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>

        <pre className={styles.asciiArt}>{ASCII_ART}</pre>

        <p className={styles.message}>{sarcasticMessage}</p>

        <div className={styles.actions}>
          <Button onClick={handleRetry}>retry</Button>
          <Button onClick={handleShare} variant="secondary">
            share
          </Button>
        </div>
      </main>
    </div>
  );
}
