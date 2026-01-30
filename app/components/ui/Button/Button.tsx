import { memo } from 'react';
import type { FC } from 'react';
import type { ButtonProps } from './Button.types';
import './Button.css';
import { CommandLine } from '../CommandLine';
import { getClassNames } from '~/utils/getClassNames';
import { addChars } from '~/utils/addChars';

export const Button: FC<ButtonProps> = ({ children, subtitle, width = 30, height = 5, duration = 0, delay = 0, className, onClick }) => {
  const classNames = getClassNames({
    [className || '']: !!className,
    buttonRoot: true,
  });

  const actualDuration = duration / height;

  return <button onClick={onClick} className={classNames}>
    <CommandLine duration={actualDuration} delay={delay}>{addChars("-", width + 1)}</CommandLine>
    {height > 3 && Array(height - 3).fill(0).map((_, index) => (
      <CommandLine key={index} duration={actualDuration} delay={delay + (index * actualDuration)}>{`|${addChars(" ", width - 1)}|`}</CommandLine>
    ))}
    <CommandLine duration={actualDuration} delay={delay + ((height - 1) * actualDuration)}>{addChars("-", width + 1)}</CommandLine>
    <div className='text'>
      <CommandLine
        duration={actualDuration} delay={delay + ((height / 2) * actualDuration)}>
        {children}
      </CommandLine>
    </div>
    {
      subtitle &&
      <div className='subtitle'>
        <CommandLine
          duration={1}>
          {subtitle}
        </CommandLine>
      </div>
    }
  </button >
}

Button.displayName = 'Button';
