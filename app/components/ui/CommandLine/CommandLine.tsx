import { memo, useEffect, useRef, useState } from 'react';
import type { CSSProperties, FC } from 'react';
import type { CommandLineProps } from './CommandLine.types';
import './CommandLine.css';

export const CommandLine: FC<CommandLineProps> = memo(({ children, delay = 0, duration = 1, keepCursorOnAnimationEnd = false }) => {
    const [showCursor, setShowCursor] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShowCursor(true)
        }, delay * 1000);
    }, []);

    const style = {
        "--duration": `${duration}s`,
        "--delay": `${delay}s`,
        "--length": `${children.length}`,
    }

    const onAnimationEnd = () => {
        if (!keepCursorOnAnimationEnd) {
            setShowCursor(false)
        }
    }

    return <div className={`commandLineRoot ${showCursor ? " with_cursor" : ""}`} style={style as CSSProperties} onAnimationEnd={onAnimationEnd}>{children}</div>;
});