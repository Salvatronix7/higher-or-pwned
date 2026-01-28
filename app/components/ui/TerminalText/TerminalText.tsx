import { memo, useState } from 'react';
import type { FC, CSSProperties } from 'react';
import styles from './TerminalText.module.css';

interface TerminalTextProps {
  readonly text: string;
  readonly duration?: number;
  readonly delay?: number;
  readonly onAnimationEnd?: () => void;
  readonly className?: string;
}

export const TerminalText: FC<TerminalTextProps> = memo(
  ({ text, duration = 2000, delay = 0, onAnimationEnd, className }) => {
    const [showCaret, setShowCaret] = useState(true);
    const style: CSSProperties = {
      '--terminal-text-duration': `${duration}ms`,
      '--terminal-text-delay': `${delay}ms`,
      '--terminal-text-length': `${text.length}`,
    } as CSSProperties;

    const handleAnimationEnd = (
      event: React.AnimationEvent<HTMLSpanElement>,
    ) => {
      setShowCaret(false);
      onAnimationEnd && onAnimationEnd();
    };

    return (
      <div className={styles.textContainer} key={text}>
        <div
          className={`${styles.terminalText} ${className ?? ''}`}
          style={style}
          onAnimationEnd={handleAnimationEnd}
        >
          {text}
        </div>
        {showCaret && <div className={styles.caret}>_</div>}
      </div>
    );
  },
);

TerminalText.displayName = 'TerminalText';
