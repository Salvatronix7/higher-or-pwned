import type { MouseEvent, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  readonly children: ReactNode;
  readonly onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  readonly variant?: ButtonVariant;
  readonly disabled?: boolean;
  readonly type?: 'button' | 'submit' | 'reset';
}
