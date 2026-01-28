import { memo } from 'react';
import type { CSSProperties, FC } from 'react';
import styles from './AsciiArtTyping.module.css';

interface AsciiArtTypingProps {
  readonly text: string;
  readonly duration?: number;
  readonly delay?: number;
  readonly onAnimationEnd?: () => void;
  readonly className?: string;
}

export const AsciiArtTyping: FC<AsciiArtTypingProps> = memo(
  ({ text, duration = 2000, delay = 0, onAnimationEnd, className }) => {
    const style: CSSProperties = {
      '--ascii-art-duration': `${duration}ms`,
      '--ascii-art-delay': `${delay}ms`,
      '--ascii-art-length': `${text.length}`,
    } as CSSProperties;

    return (
      <pre
        className={`${styles.asciiArtTyping} ${className ?? ''}`}
        style={style}
        onAnimationEnd={onAnimationEnd}
      >
        {text}
      </pre>
    );
  },
);

AsciiArtTyping.displayName = 'AsciiArtTyping';
