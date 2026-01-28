import { memo } from 'react';
import type { FC } from 'react';
import { formatNumber } from '~/utils';
import type { Password } from '~/types';
import styles from './PasswordCard.module.css';
import { TerminalText } from '~/components/ui/TerminalText';

interface PasswordCardProps {
  readonly password: Password;
  // readonly onClick: () => void;
  readonly guess: () => void;
  readonly isLoading: boolean;
  readonly isDisabled: boolean;
  readonly showCount: boolean;
  readonly position: 'left' | 'right';
}

export const PasswordCard: FC<PasswordCardProps> = memo(
  ({ password, guess, isLoading, isDisabled, showCount, position }) => {
    return (
      <button
        type='button'
        className={`${styles.card} ${styles[position]}`}
        onClick={guess}
        disabled={isLoading || isDisabled}
      >
        <div className={styles.border}>
          <div className={styles.content}>
            <TerminalText text={password.value} key={password.value} duration={750} />
            {showCount && password.pwnedCount !== null && (
              <TerminalText text={formatNumber(password.pwnedCount).toString()} duration={750} />
            )}
            {isLoading && <span className={styles.loading}>loading...</span>}
          </div>
        </div>
      </button>
    );
  },
);

PasswordCard.displayName = 'PasswordCard';
