import { memo } from 'react';
import type { FC } from 'react';
import { DEFAULT_BUTTON_TYPE, DEFAULT_BUTTON_VARIANT } from './Button.constants';
import type { ButtonProps } from './Button.types';
import { getButtonClassName } from './Button.utils';
import './Button.css';

export const Button: FC<ButtonProps> = memo(
  ({
    children,
    onClick,
    variant = DEFAULT_BUTTON_VARIANT,
    disabled = false,
    type = DEFAULT_BUTTON_TYPE,
  }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getButtonClassName(variant)}
    >
      <span className='buttonBorder'>--------</span>
      <span className='buttonContent'>[ {children} ]</span>
      <span className='buttonBorder'>--------</span>
    </button>
  )
);

Button.displayName = 'Button';
