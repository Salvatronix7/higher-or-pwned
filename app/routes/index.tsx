import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState, memo } from 'react';
import type { FC } from 'react';
import styles from './index.module.css';

export const Route = createFileRoute('/')({
  component: WelcomePage,
});

const BlinkingCursor: FC = memo(() => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return <span className={styles.cursor}>{visible ? '_' : '\u00A0'}</span>;
});

BlinkingCursor.displayName = 'BlinkingCursor';

function WelcomePage() {
  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    navigate({ to: '/game' });
  }, [navigate]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        handleStart();
      }
    },
    [handleStart]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={styles.container} onClick={handleStart}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.glow}>HIGHER</span>
          <span className={styles.separator}> || </span>
          <span className={styles.glow}>PWNED</span>
          <BlinkingCursor />
        </h1>
        <p className={styles.prompt}>
          {'>'} press any key to start_
        </p>
      </div>
    </div>
  );
}
