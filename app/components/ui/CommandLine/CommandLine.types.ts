import type { ReactNode } from 'react';

export interface CommandLineProps {
    children: string
    className?: string
    withCursor?: boolean
    keepCursorAnimation?: boolean | number
    duration?: number
    delay?: number
}
