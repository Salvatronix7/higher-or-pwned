import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';
import { TerminalText } from '../components/ui/TerminalText';
import styles from './index.module.css';

export const Route = createFileRoute('/')({
  component: WelcomePage,
});

function WelcomePage() {
  const navigate = useNavigate();
  const textDelay = 750;

  const handleStart = useCallback(() => {
    navigate({ to: '/game' });
  }, [navigate]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
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
            <TerminalText text='HIGHER || PWNED' duration={750} />
          </span>
        </h1>
        <span className={styles.prompt}>
          <TerminalText
            text='> press any key to start'
            duration={750}
            delay={textDelay}
          />
        </span>
      </div>
    </div>
  );
}
