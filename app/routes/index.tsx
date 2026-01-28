import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { TerminalText } from '../components/ui/TerminalText';
import styles from './index.module.css';

export const Route = createFileRoute('/')({
  component: WelcomePage,
});

function WelcomePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

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

  const handleTextComplete = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  return (
    <div className={styles.container} onClick={handleStart}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          {currentStep >= 0 && (
            <span className={styles.glow}>
              <TerminalText
                text='HIGHER || PWNED'
                duration={750}
                onAnimationEnd={handleTextComplete}
              />
            </span>
          )}
        </h1>
        {currentStep >= 1 && (
          <span className={styles.prompt}>
            <TerminalText text='> press any key to start' duration={750} />
          </span>
        )}
      </div>
    </div>
  );
}
