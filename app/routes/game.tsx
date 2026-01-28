import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, memo, useRef } from 'react';
import type { FC } from 'react';
import { useGame } from '~/hooks';
import { PasswordCard } from '~/components';
import type { GuessChoice } from '~/types';
import styles from './game.module.css';
import { TerminalText } from '~/components/ui/TerminalText';

export const Route = createFileRoute('/game')({
  component: GamePage,
});

const Header: FC = memo(() => (
  <header className={styles.header}>
    <TerminalText text='HIGHER || PWNED' duration={750} />
  </header>
));

Header.displayName = 'Header';

interface ScoreDisplayProps {
  readonly score: number;
}

const ScoreDisplay: FC<ScoreDisplayProps> = memo(({ score }) => (
  <div className={styles.scoreContainer}>
    <span className={styles.scoreLabel}>SCORE</span>
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
      }, 2000);
    },
    [makeGuess, startReveal],
  );

  useEffect(() => {
    if (gameState === 'gameOver' && gameResult) {
      navigate({
        to: '/result',
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
            guess={() => handleGuess('left')}
            isLoading={isLoading}
            isDisabled={gameState !== 'playing'}
            showCount={gameState !== 'playing'}
            position='left'
          />
          <ScoreDisplay score={score} />
          <PasswordCard
            key={rightPassword.value}
            password={rightPassword}
            guess={() => handleGuess('right')}
            isLoading={isLoading}
            isDisabled={gameState !== 'playing'}
            showCount={gameState !== 'playing'}
            position='right'
          />
        </div>
        <p className={styles.instruction}>
          {'>'} click the password with MORE breaches_
        </p>
      </main>
    </div>
  );
}
