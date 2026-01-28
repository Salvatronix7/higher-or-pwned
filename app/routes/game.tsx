import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, memo } from 'react';
import type { FC } from 'react';
import { useGame } from '~/hooks';
import { PasswordCard } from '~/components';
import type { GuessChoice } from '~/types';
import styles from './game.module.css';

export const Route = createFileRoute('/game')({
  component: GamePage,
});

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
  } = useGame();

  const handleGuess = useCallback(
    (choice: GuessChoice) => {
      makeGuess(choice);
    },
    [makeGuess]
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

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.gameBoard}>
          <PasswordCard
            password={leftPassword}
            onClick={() => handleGuess('left')}
            isLoading={isLoading}
            position="left"
          />
          <ScoreDisplay score={score} />
          <PasswordCard
            password={rightPassword}
            onClick={() => handleGuess('right')}
            isLoading={isLoading}
            position="right"
          />
        </div>
        <p className={styles.instruction}>
          {'>'} click the password with MORE breaches_
        </p>
      </main>
    </div>
  );
}
