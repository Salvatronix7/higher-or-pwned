import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, memo, useState } from 'react';
import type { FC } from 'react';
import { Button } from '~/components';
import { getRandomItem } from '~/utils';
import {
  ROUTES,
  SARCASTIC_MESSAGES,
  UI_TEXT,
  TIMING,
  RESULT_ASCII_ART,
  createShareText,
} from '~/constants';
import styles from './result.module.css';
import { TerminalText } from '~/components/ui/TerminalText';

interface ResultSearchParams {
  score: number;
}

export const Route = createFileRoute(ROUTES.RESULT)({
  validateSearch: (search: Record<string, unknown>): ResultSearchParams => ({
    score: Number(search.score) || 0,
  }),
  component: ResultPage,
});

const Header: FC = memo(() => (
  <header className={styles.header}>
    <TerminalText text={UI_TEXT.APP_TITLE} duration={TIMING.TERMINAL_TEXT_DURATION} />
  </header>
));

Header.displayName = 'Header';

function ResultPage() {
  const [showFooter, setShowFooter] = useState(false);
  const navigate = useNavigate();
  const { score } = Route.useSearch();

  const sarcasticMessage = useMemo(() => getRandomItem(SARCASTIC_MESSAGES), []);

  const handleRetry = useCallback(() => {
    navigate({ to: ROUTES.GAME });
  }, [navigate]);

  const handleShare = useCallback(async () => {
    const shareText = createShareText(score);

    if (navigator.share) {
      try {
        await navigator.share({
          title: UI_TEXT.SHARE_TITLE,
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
          <TerminalText text={UI_TEXT.SCORE_LABEL.toLowerCase()} duration={TIMING.TERMINAL_TEXT_DURATION} />
          <TerminalText text={score.toString()} duration={TIMING.TERMINAL_TEXT_DURATION} delay={TIMING.TERMINAL_TEXT_DURATION} />
        </div>

        <pre className={styles.asciiArt}>{RESULT_ASCII_ART}</pre>

        <TerminalText
          text={sarcasticMessage}
          duration={TIMING.TERMINAL_TEXT_DURATION}
          delay={TIMING.TERMINAL_TEXT_DURATION}
          onAnimationEnd={() => setShowFooter(true)}
        />

        {showFooter && (
          <div className={styles.actions}>
            <Button onClick={handleRetry}>{UI_TEXT.RETRY_BUTTON}</Button>
            <Button onClick={handleShare} variant='secondary'>
              {UI_TEXT.SHARE_BUTTON}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
