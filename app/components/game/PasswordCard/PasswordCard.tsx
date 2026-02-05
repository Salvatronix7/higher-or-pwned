import { memo } from 'react';
import type { FC } from 'react';
import { TerminalText } from '~/components/ui/TerminalText';
import { formatNumber } from '~/utils';
import { UI_TEXT, TIMING } from '~/constants';
import type { PasswordCardProps } from './PasswordCard.types';
import { getCardClassName } from './PasswordCard.utils';
import './PasswordCard.css';
import { Button } from '~/components/ui/Button';
import { CommandLine } from '~/components/ui/CommandLine';

export const PasswordCard: FC<PasswordCardProps> = memo(
  ({ password, guess, isLoading, isDisabled, showCount, position }) => {
    return (
      <Button
        className="passwordCardRoot"
        duration={.5}
        onClick={guess}
        subtitle={showCount ? formatNumber(password.pwnedCount || 0).toString() : undefined}
        width={30}
        height={15}
      >
        {password.value}
      </Button>
    );
  },
);

PasswordCard.displayName = 'PasswordCard';
