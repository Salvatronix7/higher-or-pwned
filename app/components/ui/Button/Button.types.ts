import type { MouseEvent, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  children: string;
  subtitle?: string;
  width?: number;
  height?: number;
  className?: string;
  duration?: number;
  delay?: number;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}
