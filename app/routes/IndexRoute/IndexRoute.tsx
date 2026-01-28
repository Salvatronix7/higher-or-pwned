import { useCallback, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TerminalText } from '~/components/ui/TerminalText';
import {
  INDEX_ROUTE_PROMPT_TEXT,
  INDEX_ROUTE_TEXT_DELAY_MS,
  INDEX_ROUTE_TITLE_TEXT,
} from './IndexRoute.constants';
import type { IndexRouteProps } from './IndexRoute.types';
import { isStartKey } from './IndexRoute.utils';
import './IndexRoute.css';

export const IndexRoute: FC<IndexRouteProps> = () => {
  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    navigate({ to: '/game' });
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
            <TerminalText text={INDEX_ROUTE_TITLE_TEXT} duration={750} />
          </span>
        </h1>
        <span className='indexRoutePrompt'>
          <TerminalText
            text={INDEX_ROUTE_PROMPT_TEXT}
            duration={750}
            delay={INDEX_ROUTE_TEXT_DELAY_MS}
          />
        </span>
      </div>
    </div>
  );
};
