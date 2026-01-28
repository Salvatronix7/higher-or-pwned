import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, memo, useRef } from 'react';
import type { FC } from 'react';
import { useGame } from '~/hooks';
import { PasswordCard } from '~/components';
import {
  ROUTES,
  GAME_STATES,
  GUESS_CHOICES,
  UI_TEXT,
  TIMING,
} from '~/constants';
import type { GuessChoice } from '~/types';
import styles from './game.module.css';
import { TerminalText } from '~/components/ui/TerminalText';

export const Route = createFileRoute(ROUTES.GAME)({
  component: GamePage,
});

const Header: FC = memo(() => (
  <header className={styles.header}>
    <TerminalText text={UI_TEXT.APP_TITLE} duration={TIMING.TERMINAL_TEXT_DURATION} />
  </header>
));

Header.displayName = 'Header';

interface ScoreDisplayProps {
  readonly score: number;
}

const ScoreDisplay: FC<ScoreDisplayProps> = memo(({ score }) => (
  <div className={styles.scoreContainer}>
    <span className={styles.scoreLabel}>{UI_TEXT.SCORE_LABEL}</span>
    <span className={styles.scoreValue}>{score}</span>
  </div>
));

ScoreDisplay.displayName = 'ScoreDisplay';

function GamePage() {
  const navigate = useNavigate();
  const {
    leftPassword,
    rightPassword,
    score,
    gameState,
    isLoading,
    gameResult,
    makeGuess,
    startReveal,
  } = useGame();
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGuess = useCallback(
    (choice: GuessChoice) => {
      if (!startReveal()) {
        return;
      }
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
      revealTimeoutRef.current = setTimeout(() => {
        makeGuess(choice);
      }, TIMING.REVEAL_DELAY);
    },
    [makeGuess, startReveal],
  );

  useEffect(() => {
    if (gameState === GAME_STATES.GAME_OVER && gameResult) {
      navigate({
        to: ROUTES.RESULT,
        search: {
          score: gameResult.score,
        },
      });
    }
  }, [gameState, gameResult, navigate]);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.gameBoard}>
          <PasswordCard
            key={leftPassword.value}
            password={leftPassword}
            guess={() => handleGuess(GUESS_CHOICES.LEFT)}
            isLoading={isLoading}
            isDisabled={gameState !== GAME_STATES.PLAYING}
            showCount={gameState !== GAME_STATES.PLAYING}
            position={GUESS_CHOICES.LEFT}
          />
          <ScoreDisplay score={score} />
          <PasswordCard
            key={rightPassword.value}
            password={rightPassword}
            guess={() => handleGuess(GUESS_CHOICES.RIGHT)}
            isLoading={isLoading}
            isDisabled={gameState !== GAME_STATES.PLAYING}
            showCount={gameState !== GAME_STATES.PLAYING}
            position={GUESS_CHOICES.RIGHT}
          />
        </div>
        <p className={styles.instruction}>
          {UI_TEXT.GAME_INSTRUCTION}
        </p>
      </main>
    </div>
  );
}
