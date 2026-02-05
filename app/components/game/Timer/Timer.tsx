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
    const milliseconds = Math.floor((totalMs % 1000) / 10);

    // Format as "SS.mm" (e.g., "15.00", "3.25")
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  return (
    <div className="timerRoot">
      <CommandLine>{`       ${UI_TEXT.TIMER_LABEL}       `}</CommandLine>
      <CommandLine>{`      ${formattedTime}      `}</CommandLine>
    </div>
  );
});

Timer.displayName = 'Timer';
