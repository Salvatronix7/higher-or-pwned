import type { ReactNode } from 'react';

export interface CommandLineProps {
    children: string
    withCursor?: boolean
    keepCursorAnimation?: boolean | number
    duration?: number
    delay?: number
}
