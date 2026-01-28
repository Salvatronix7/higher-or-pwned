import { memo } from 'react';
import type { FC, ReactNode, MouseEvent } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  readonly children: ReactNode;
  readonly onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  readonly variant?: 'primary' | 'secondary';
  readonly disabled?: boolean;
  readonly type?: 'button' | 'submit' | 'reset';
}

export const Button: FC<ButtonProps> = memo(
  ({ children, onClick, variant = 'primary', disabled = false, type = 'button' }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]}`}
    >
      <span className={styles.border}>--------</span>
      <span className={styles.content}>[ {children} ]</span>
      <span className={styles.border}>--------</span>
    </button>
  )
);

Button.displayName = 'Button';
