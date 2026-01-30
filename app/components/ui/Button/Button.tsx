import { memo } from 'react';
import type { FC } from 'react';
import type { ButtonProps } from './Button.types';
import './Button.css';
import { CommandLine } from '../CommandLine';
import { getClassNames } from '~/utils/getClassNames';
import { addChars } from '~/utils/addChars';

export const Button: FC<ButtonProps> = ({ children, subtitle, width = 3, height = 3, duration = 0, delay = 0, className, onClick }) => {
  const classNames = getClassNames({
    buttonRoot: true,
    className: !!className,
  });

  return <button onClick={onClick} className={classNames}>
    <CommandLine
      duration={duration}
      delay={delay}>
      {addChars(Array(children.length + 1).join("-"), "-", width)}
    </CommandLine>
    {height > 3 && Array(height - 3).fill(0).map((_, index) => (
      <CommandLine key={index} duration={duration} delay={delay + ((index + 1) * duration)}>{`|${addChars(Array(children.length + 1).join(" "), " ", width - 1)}|`}</CommandLine>
    ))}
    <CommandLine
      duration={duration}
      delay={delay + duration}>
      {`|${addChars(children, " ", width - 1)}|`}
    </CommandLine>
    {height > 3 && Array(height - 3).fill(0).map((_, index) => (
      <CommandLine key={index} duration={duration} delay={delay + ((index + 1) * duration)}>{`|${addChars(Array(children.length + 1).join(" "), " ", width - 1)}|`}</CommandLine>
    ))}
    <CommandLine
      duration={duration}
      delay={delay + (duration * 2)}>
      {addChars(Array(children.length + 1).join("-"), "-", width)}
    </CommandLine>
    {subtitle && <CommandLine
      duration={duration}
      delay={delay + (duration * 2)}>
      {subtitle}
    </CommandLine>}
  </button>
}

Button.displayName = 'Button';
