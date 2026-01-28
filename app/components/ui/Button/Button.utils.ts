import type { ButtonVariant } from './Button.types';

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'buttonPrimary',
  secondary: 'buttonSecondary',
};

export const getButtonClassName = (variant: ButtonVariant): string =>
  `buttonRoot ${variantClassMap[variant]}`;
