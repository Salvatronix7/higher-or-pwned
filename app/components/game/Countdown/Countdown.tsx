import { memo, useMemo } from 'react';
import type { FC } from 'react';
import type { CountdownProps } from './Countdown.types';
import './Countdown.css';

export const Countdown: FC<CountdownProps> = memo(({ countdownValue }) => {
  const displayNumber = useMemo(() => {
    // Convert milliseconds to seconds and round up
    return Math.ceil(countdownValue / 1000);
  }, [countdownValue]);

  return (
    <div className="countdownOverlay">
      <div className="countdownNumber">{displayNumber}</div>
    </div>
  );
});

Countdown.displayName = 'Countdown';
