import { memo } from 'react';
import type { FC } from 'react';
import { formatNumber } from '~/utils';
import type { Password } from '~/types';
import styles from './PasswordCard.module.css';

interface PasswordCardProps {
  readonly password: Password;
  readonly onClick: () => void;
  readonly isLoading: boolean;
  readonly showCount?: boolean;
  readonly position: 'left' | 'right';
}

export const PasswordCard: FC<PasswordCardProps> = memo(
  ({ password, onClick, isLoading, showCount = false, position }) => (
    <button
      type="button"
      className={`${styles.card} ${styles[position]}`}
      onClick={onClick}
      disabled={isLoading}
    >
      <div className={styles.border}>
        <div className={styles.content}>
          <span className={styles.password}>{password.value}</span>
          {showCount && password.pwnedCount !== null && (
            <span className={styles.count}>
              {formatNumber(password.pwnedCount)} pwned
            </span>
          )}
          {isLoading && <span className={styles.loading}>loading...</span>}
        </div>
      </div>
    </button>
  )
);

PasswordCard.displayName = 'PasswordCard';
