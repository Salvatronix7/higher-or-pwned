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
  ({ text, duration = 2, delay = 0, onAnimationEnd, className }) => {
    const lines = text.split('\n').filter((line) => line.length > 0);
    const lineCount = Math.max(lines.length, 1);
    const maxLineLength = Math.max(
      ...lines.map((line) => line.length),
      1,
    );

    var actualDuration = duration / lineCount;
    const style: CSSProperties = {
      '--ascii-art-duration': `${actualDuration}s`,
      '--ascii-art-length': `${text.length}`,
      '--ascii-art-lines': `${lineCount}`,
      '--ascii-art-columns': `${maxLineLength}`,

    } as CSSProperties;

    return (
      <div
        className={`${styles.asciiArtTyping} ${className ?? ''}`}
        onAnimationEnd={onAnimationEnd}
      >
        {text.split('\n').map((line, index) => (
          <div key={index} style={{ ...style, '--ascii-art-delay': `${delay + (actualDuration * index)}s`, } as any} className={styles.asciiArtLine}>
            {line}
          </div>
        ))}
      </div>
    );
  },
);

AsciiArtTyping.displayName = 'AsciiArtTyping';
