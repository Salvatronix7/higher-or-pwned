import { memo } from 'react';
import type { FC, CSSProperties } from 'react';
import styles from './TerminalText.module.css';

interface TerminalTextProps {
  readonly text: string;
  readonly duration?: number;
  readonly onAnimationEnd?: () => void;
  readonly className?: string;
}

export const TerminalText: FC<TerminalTextProps> = memo(({
  text,
  duration = 2000,
  onAnimationEnd,
  className,
}) => {
  const style: CSSProperties = {
    '--terminal-text-duration': `${duration}ms`,
  } as CSSProperties;

  return (
    <span
      className={`${styles.terminalText} ${className ?? ''}`}
      style={style}
      onAnimationEnd={onAnimationEnd}
    >
      {text}
    </span>
  );
});

TerminalText.displayName = 'TerminalText';
