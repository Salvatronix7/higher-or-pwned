import type { CSSProperties } from 'react';
import type { TerminalTextStyleInput } from './TerminalText.types';

export const createTerminalTextStyle = ({
  duration,
  delay,
  textLength,
}: TerminalTextStyleInput): CSSProperties =>
  ({
    '--terminal-text-duration': `${duration}ms`,
    '--terminal-text-delay': `${delay}ms`,
    '--terminal-text-length': `${textLength}`,
  }) as CSSProperties;
