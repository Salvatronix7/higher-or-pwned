import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';
import { TerminalText } from '../components/ui/TerminalText';
import { ROUTES, UI_TEXT, KEYBOARD_KEYS, TIMING } from '~/constants';
import styles from './index.module.css';

export const Route = createFileRoute(ROUTES.HOME)({
  component: WelcomePage,
});

function WelcomePage() {
  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    navigate({ to: ROUTES.GAME });
  }, [navigate]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE) {
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
    <div className={styles.container} onClick={handleStart}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.glow}>
            <TerminalText text={UI_TEXT.APP_TITLE} duration={TIMING.TERMINAL_TEXT_DURATION} />
          </span>
        </h1>
        <span className={styles.prompt}>
          <TerminalText
            text={UI_TEXT.START_PROMPT}
            duration={TIMING.TERMINAL_TEXT_DURATION}
            delay={TIMING.TERMINAL_TEXT_DURATION}
          />
        </span>
      </div>
    </div>
  );
}
