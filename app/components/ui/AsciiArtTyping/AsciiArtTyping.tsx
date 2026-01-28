import { memo, useEffect, useState } from 'react';
import type { FC } from 'react';

interface AsciiArtTypingProps {
  readonly text: string;
  readonly duration?: number;
  readonly delay?: number;
  readonly onAnimationEnd?: () => void;
  readonly className?: string;
}

export const AsciiArtTyping: FC<AsciiArtTypingProps> = memo(
  ({ text, duration = 2000, delay = 0, onAnimationEnd, className }) => {
    const [displayedText, setDisplayedText] = useState(delay === 0 ? '' : '');

    useEffect(() => {
      let timeoutId: number | undefined;
      let intervalId: number | undefined;

      const startTyping = () => {
        if (text.length === 0) {
          onAnimationEnd?.();
          return;
        }

        const intervalDelay = Math.max(duration / text.length, 10);
        let currentIndex = 0;

        setDisplayedText('');

        intervalId = window.setInterval(() => {
          currentIndex += 1;
          setDisplayedText(text.slice(0, currentIndex));

          if (currentIndex >= text.length) {
            if (intervalId) {
              window.clearInterval(intervalId);
            }
            onAnimationEnd?.();
          }
        }, intervalDelay);
      };

      if (delay > 0) {
        timeoutId = window.setTimeout(startTyping, delay);
      } else {
        startTyping();
      }

      return () => {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
        if (intervalId) {
          window.clearInterval(intervalId);
        }
      };
    }, [text, duration, delay, onAnimationEnd]);

    return <pre className={className}>{displayedText}</pre>;
  },
);

AsciiArtTyping.displayName = 'AsciiArtTyping';
