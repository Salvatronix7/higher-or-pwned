import type { ReactNode } from 'react';

export interface CommandLineProps {
    children: string
    keepCursorOnAnimationEnd?: boolean
    duration?: number
    delay?: number
}
