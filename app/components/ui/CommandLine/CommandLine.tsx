import { memo, useEffect, useRef, useState } from 'react';
import type { CSSProperties, FC } from 'react';
import type { CommandLineProps } from './CommandLine.types';
import './CommandLine.css';
import { getClassNames } from '~/utils/getClassNames';

export const CommandLine: FC<CommandLineProps> = memo(({ children, className, delay = 0, duration = 0, withCursor = false, keepCursorAnimation = false }) => {
    const [showCursor, setShowCursor] = useState(false)

    useEffect(() => {
        if (!keepCursorAnimation) return
        setTimeout(() => {
            setShowCursor(true)
        }, delay * 1000);
    }, []);

    const style = {
        "--duration": `${duration}s`,
        "--delay": `${delay}s`,
        "--length": `${children.length}`,
    }

    const classNames = getClassNames({
        [className || '']: !!className,
        'commandLineRoot': true,
        'with_cursor': withCursor && showCursor,
    });

    const onAnimationEnd = () => {
        if (typeof keepCursorAnimation === 'boolean') {
            !keepCursorAnimation && setShowCursor(false)
        } else if (typeof keepCursorAnimation === 'number') {
            setTimeout(() => {
                setShowCursor(false)
            }, keepCursorAnimation * 1000);
        }
    }

    return <div
        className={classNames}
        style={style as CSSProperties}
        onAnimationEnd={onAnimationEnd}
    >
        {children}
    </div>
});