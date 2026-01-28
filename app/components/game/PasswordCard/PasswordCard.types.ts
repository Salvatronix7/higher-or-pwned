import type { Password } from '~/types';

export interface PasswordCardProps {
  readonly password: Password;
  readonly guess: () => void;
  readonly isLoading: boolean;
  readonly isDisabled: boolean;
  readonly showCount: boolean;
  readonly position: 'left' | 'right';
}
