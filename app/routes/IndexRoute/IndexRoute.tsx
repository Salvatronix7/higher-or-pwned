import { useCallback, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TerminalText } from '~/components/ui/TerminalText';
import { ROUTES, UI_TEXT, TIMING } from '~/constants';
import type { IndexRouteProps } from './IndexRoute.types';
import { isStartKey } from './IndexRoute.utils';
import './IndexRoute.css';

export const IndexRoute: FC<IndexRouteProps> = () => {
  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    navigate({ to: ROUTES.GAME });
  }, [navigate]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isStartKey(event)) {
        handleStart();
      }
    },
    [handleStart],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className='indexRouteContainer' onClick={handleStart}>
      <div className='indexRouteContent'>
        <h1 className='indexRouteTitle'>
          <span className='indexRouteGlow'>
            <TerminalText text={UI_TEXT.APP_TITLE} duration={TIMING.TERMINAL_TEXT_DURATION} />
          </span>
        </h1>
        <span className='indexRoutePrompt'>
          <TerminalText
            text={UI_TEXT.START_PROMPT}
            duration={TIMING.TERMINAL_TEXT_DURATION}
            delay={TIMING.TERMINAL_TEXT_DURATION}
          />
        </span>
      </div>
    </div>
  );
};
