import { useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { CommandLine, PasswordCard } from '~/components';
import { Console } from '~/components/ui/Console/Console';
import { TerminalText } from '~/components/ui/TerminalText';
import {
  GAME_STATES,
  GUESS_CHOICES,
  ROUTES,
  TIMING,
  UI_TEXT,
} from '~/constants';
import { useGame } from '~/hooks';
import type { GuessChoice } from '~/types';
import './GameRoute.css';
import type { ScoreDisplayProps } from './GameRoute.types';
import { FireSimulation } from '~/components/Fire/Fire';

const Header: FC = memo(() => (
  <header className='gameRouteHeader'>
    <TerminalText text={UI_TEXT.APP_TITLE} duration={TIMING.TERMINAL_TEXT_DURATION} />
  </header>
));

Header.displayName = 'Header';

const ScoreDisplay: FC<ScoreDisplayProps> = memo(({ score }) => (
  <div className="scoreDisplayRoot">
    <CommandLine>{`       ${UI_TEXT.SCORE_LABEL}       `}</CommandLine>
    <CommandLine>{`         ${score}       `}</CommandLine>
  </div>
));

ScoreDisplay.displayName = 'ScoreDisplay';

type FireConfig = Record<number, { decay: number; sparkRate: number; cooling: number, fps?: number }>

//decay 0.09 - 0.01

const fireParameters: FireConfig = {
  // [0]: { decay: 0.01, sparkRate: 0.9, cooling: 0, fps: 40 },
  [1]: { decay: 0.1, sparkRate: 0, cooling: 0, fps: 24 },
  [5]: { decay: 0.5, sparkRate: .25, cooling: 0, fps: 26 },
  [10]: { decay: 0.2, sparkRate: .75, cooling: 0, fps: 28 },
  [15]: { decay: 0.1, sparkRate: 0.75, cooling: 0, fps: 30 },
  [20]: { decay: 0.05, sparkRate: 0.75, cooling: 0, fps: 32 },
  [25]: { decay: 0.02, sparkRate: 0.8, cooling: 0, fps: 34 },
  [30]: { decay: 0.01, sparkRate: 0.8, cooling: 0, fps: 36 },
  [35]: { decay: 0.01, sparkRate: 0.9, cooling: 0, fps: 38 },
  [40]: { decay: 0.01, sparkRate: 1, cooling: 0, fps: 40 },
  [45]: { decay: 0.0, sparkRate: 1, cooling: 0, fps: 40 },
}

export const GameRoute: FC = () => {
  const fireConfigRef = useRef<FireConfig>();

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
      }, TIMING.REVEAL_DELAY * 1000);
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

  fireConfigRef.current = fireParameters[score] || fireConfigRef.current

  return (
    <main className='gameRouteContainer'>
      {fireConfigRef.current && <FireSimulation
        width={200}
        height={150}
        intensity={1}
        {...fireConfigRef.current}
      // fps={24}
      />}
      <Console score={score}>
        <div className='gameBoard'>
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
      </Console >
    </main >
  );
};
