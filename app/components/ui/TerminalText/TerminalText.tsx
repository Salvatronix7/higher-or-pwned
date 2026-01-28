import { memo, useEffect, useState } from 'react';
import type { FC } from 'react';
import { DEFAULT_TERMINAL_TEXT_DELAY, DEFAULT_TERMINAL_TEXT_DURATION } from './TerminalText.constants';
import type { TerminalTextProps } from './TerminalText.types';
import { createTerminalTextStyle } from './TerminalText.utils';
import './TerminalText.css';

export const TerminalText: FC<TerminalTextProps> = memo(
  ({
    text,
    duration = DEFAULT_TERMINAL_TEXT_DURATION,
    delay = DEFAULT_TERMINAL_TEXT_DELAY,
    onAnimationEnd,
    className,
  }) => {
    const [showCaret, setShowCaret] = useState(delay === 0);
    const style = createTerminalTextStyle({ duration, delay, textLength: text.length });

    useEffect(() => {
      setShowCaret(delay === 0);

      if (delay === 0) {
        return;
      }

      const timeout = window.setTimeout(() => {
        setShowCaret(true);
      }, delay);

      return () => window.clearTimeout(timeout);
    }, [delay]);

    const handleAnimationEnd = () => {
      setShowCaret(false);
      onAnimationEnd && onAnimationEnd();
    };

    return (
      <div className='terminalTextContainer' key={text}>
        <div
          className={`terminalTextValue ${className ?? ''}`}
          style={style}
          onAnimationEnd={handleAnimationEnd}
        >
          {text}
        </div>
        {showCaret && <div className='terminalTextCaret'>_</div>}
      </div>
    );
  },
);

TerminalText.displayName = 'TerminalText';
