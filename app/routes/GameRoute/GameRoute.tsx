import { memo, useCallback, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PasswordCard } from '~/components';
import { TerminalText } from '~/components/ui/TerminalText';
import { useGame } from '~/hooks';
import type { GuessChoice } from '~/types';
import {
  GAME_ROUTE_REVEAL_DELAY_MS,
  GAME_ROUTE_TITLE_TEXT,
} from './GameRoute.constants';
import type { ScoreDisplayProps } from './GameRoute.types';
import { getGameInstructionText } from './GameRoute.utils';
import './GameRoute.css';

const Header: FC = memo(() => (
  <header className='gameRouteHeader'>
    <TerminalText text={GAME_ROUTE_TITLE_TEXT} duration={750} />
  </header>
));

Header.displayName = 'Header';

const ScoreDisplay: FC<ScoreDisplayProps> = memo(({ score }) => (
  <div className='gameRouteScoreContainer'>
    <span className='gameRouteScoreLabel'>SCORE</span>
    <span className='gameRouteScoreValue'>{score}</span>
  </div>
));

ScoreDisplay.displayName = 'ScoreDisplay';

export const GameRoute: FC = () => {
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
      }, GAME_ROUTE_REVEAL_DELAY_MS);
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
    <div className='gameRouteContainer'>
      <Header />
      <main className='gameRouteMain'>
        <div className='gameRouteBoard'>
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
        <p className='gameRouteInstruction'>{getGameInstructionText()}</p>
      </main>
    </div>
  );
};
