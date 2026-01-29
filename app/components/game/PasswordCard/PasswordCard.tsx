import { memo } from 'react';
import type { FC } from 'react';
import { TerminalText } from '~/components/ui/TerminalText';
import { formatNumber } from '~/utils';
import { UI_TEXT, TIMING } from '~/constants';
import type { PasswordCardProps } from './PasswordCard.types';
import { getCardClassName } from './PasswordCard.utils';
import './PasswordCard.css';

export const PasswordCard: FC<PasswordCardProps> = memo(
  ({ password, guess, isLoading, isDisabled, showCount, position }) => {
    return (
      <button
        type='button'
        className={getCardClassName(position)}
        onClick={guess}
        disabled={isLoading || isDisabled}
      >
        <div className='passwordCardBorder'>
          <div className='passwordCardContent'>
            <TerminalText
              text={password.value}
              key={password.value}
              duration={TIMING.TERMINAL_TEXT_DURATION}
              className='passwordCardValue'
            />
            {showCount && password.pwnedCount !== null && (
              <TerminalText
                text={formatNumber(password.pwnedCount).toString()}
                duration={TIMING.TERMINAL_TEXT_DURATION}
                className='passwordCardCount'
              />
            )}
            {isLoading && <span className='passwordCardLoading'>{UI_TEXT.LOADING}</span>}
          </div>
        </div>
      </button>
    );
  },
);

PasswordCard.displayName = 'PasswordCard';
