import { memo } from 'react';
import type { FC } from 'react';
import { TerminalText } from '~/components/ui/TerminalText';
import { formatNumber } from '~/utils';
import { UI_TEXT, TIMING } from '~/constants';
import type { PasswordCardProps } from './PasswordCard.types';
import { getCardClassName } from './PasswordCard.utils';
import './PasswordCard.css';
import { Button, CommandLine } from '~/components/ui';

export const PasswordCard: FC<PasswordCardProps> = memo(
  ({ password, guess, isLoading, isDisabled, showCount, position }) => {
    return (
      <Button
        duration={1}
        onClick={guess}
        subtitle={showCount ? formatNumber(password.pwnedCount || 0).toString() : undefined}
        className={getCardClassName(position)}
        width={30}
        height={15}
      >
        {password.value}
      </Button>
    );
  },
);

PasswordCard.displayName = 'PasswordCard';
