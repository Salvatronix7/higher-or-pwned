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
    const lines = text.split('\n').filter((line) => line.length > 0);
    const lineCount = Math.max(lines.length, 1);
    const maxLineLength = Math.max(
      ...lines.map((line) => line.length),
      1,
    );
    const style: CSSProperties = {
      '--ascii-art-duration': `${duration}ms`,
      '--ascii-art-delay': `${delay}ms`,
      '--ascii-art-length': `${text.length}`,
      '--ascii-art-lines': `${lineCount}`,
      '--ascii-art-columns': `${maxLineLength}`,
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
