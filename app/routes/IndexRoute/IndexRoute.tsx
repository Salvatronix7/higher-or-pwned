import { useCallback, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TerminalText } from '~/components/ui/TerminalText';
import { ROUTES, UI_TEXT, TIMING } from '~/constants';
import type { IndexRouteProps } from './IndexRoute.types';
import { isStartKey } from './IndexRoute.utils';
import './IndexRoute.css';
import { CommandLine } from '~/components/ui/CommandLine/CommandLine';

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
      <div>
        <CommandLine duration={1}>Higher || Pwned</CommandLine>
        <CommandLine duration={.5} delay={1} keepCursorOnAnimationEnd>Press any key to continue</CommandLine>
      </div>
    </div>
  );
};
