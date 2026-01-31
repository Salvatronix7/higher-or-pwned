import { memo, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, FC } from 'react';
import './Fire.css';
import { motion } from 'framer-motion';

const DEFAULT_PALETTE = ' .:-=+*#%@';

interface FireSimulationProps {
    readonly width?: number;
    readonly height?: number;
    readonly fps?: number;
    readonly intensity?: number;
    readonly decay?: number;
    readonly sparkRate?: number;
    readonly wind?: number;
    readonly cooling?: number;
    readonly cellSize?: number;
    readonly palette?: string;
    readonly className?: string;
}

const clamp = (value: number, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

const createGrid = (width: number, height: number) =>
    Array.from({ length: width * height }, () => 0);

export const FireSimulation: FC<FireSimulationProps> = memo(
    ({
        width = 32,
        height = 32,
        fps = 20,
        intensity = 0.9,
        decay = 0.035,
        sparkRate = 0.5,
        wind = 0,
        cooling = 0.02,
        cellSize = 12,
        palette = DEFAULT_PALETTE,
        className,
    }) => {
        const [grid, setGrid] = useState(() => createGrid(width, height));
        const paletteChars = useMemo(() => palette.split(''), [palette]);

        useEffect(() => {
            setGrid(createGrid(width, height));
        }, [width, height]);

        useEffect(() => {
            const interval = window.setInterval(() => {
                setGrid((prev) => {
                    const next = createGrid(width, height);
                    const lastRow = height - 1;

                    for (let x = 0; x < width; x += 1) {
                        const spark = Math.random() < sparkRate ? intensity : 0;
                        next[lastRow * width + x] = clamp(spark + (Math.random() * 0.15));
                    }

                    for (let y = height - 2; y >= 0; y -= 1) {
                        for (let x = 0; x < width; x += 1) {
                            const windOffset = Math.round(wind + (Math.random() - 0.5));
                            const sourceX = Math.min(width - 1, Math.max(0, x + windOffset));
                            const belowIndex = (y + 1) * width + sourceX;
                            const belowLeftIndex =
                                (y + 1) * width + Math.max(0, sourceX - 1);
                            const belowRightIndex =
                                (y + 1) * width + Math.min(width - 1, sourceX + 1);

                            const heat =
                                (prev[belowIndex] as any +
                                    prev[belowLeftIndex] +
                                    prev[belowRightIndex]) /
                                3;

                            const coolingAmount = cooling + Math.random() * decay;
                            const nextHeat = clamp(heat - coolingAmount);
                            next[y * width + x] = nextHeat;
                        }
                    }

                    return next;
                });
            }, Math.max(16, 1000 / fps));

            return () => window.clearInterval(interval);
        }, [cooling, decay, fps, height, intensity, sparkRate, width, wind]);

        const output = useMemo(() => {
            const maxIndex = paletteChars.length - 1;
            const lines: string[] = [];

            for (let y = 0; y < height; y += 1) {
                let row = '';
                for (let x = 0; x < width; x += 1) {
                    const heat = grid[y * width + x] ?? 0;
                    const index = Math.round(clamp(heat) * maxIndex);
                    row += paletteChars[index] ?? paletteChars[0] ?? ' ';
                }
                lines.push(row);
            }

            return lines.join('\n');
        }, [grid, height, paletteChars, width]);

        const size = Math.max(width, height);
        const style: CSSProperties = {
            '--fire-width': `${width}`,
            '--fire-height': `${height}`,
            '--fire-size': `${size}`,
            '--fire-cell-size': `${cellSize}px`,
        } as CSSProperties;

        return (
            <pre
                aria-label="Fire simulation"
                className={`fireSimulation ${className ?? ''}`}
                style={style}
            >
                {output}
            </pre>
        );
    },
);

FireSimulation.displayName = 'FireSimulation';
