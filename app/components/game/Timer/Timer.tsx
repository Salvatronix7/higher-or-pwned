import { memo, useMemo } from 'react';
import type { FC } from 'react';
import { CommandLine } from '~/components/ui/CommandLine';
import { UI_TEXT } from '~/constants';
import type { TimerProps } from './Timer.types';
import './Timer.css';

export const Timer: FC<TimerProps> = memo(({ timeRemaining }) => {
  const formattedTime = useMemo(() => {
    const totalMs = Math.max(0, timeRemaining);
    const seconds = Math.floor(totalMs / 1000);
    const milliseconds = totalMs % 1000;

    // Format as "SS.mmm" (e.g., "15.000", "3.250")
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}`;
  }, [timeRemaining]);

  return (
    <div className="timerRoot">
      <CommandLine>{`       ${UI_TEXT.TIMER_LABEL}       `}</CommandLine>
      <CommandLine>{`      ${formattedTime}s      `}</CommandLine>
    </div>
  );
});

Timer.displayName = 'Timer';
