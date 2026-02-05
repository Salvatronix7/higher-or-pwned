import { memo, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, FC } from 'react';
import './Fireworks.css';

const DEFAULT_PALETTE = ' .:*oO@';

interface Particle {
    readonly x: number;
    readonly y: number;
    readonly vx: number;
    readonly vy: number;
    readonly life: number;
    readonly maxLife: number;
}

interface FireworksSimulationProps {
    readonly width?: number;
    readonly height?: number;
    readonly fps?: number;
    readonly intensity?: number;
    readonly burstRate?: number;
    readonly particlesPerBurst?: number;
    readonly gravity?: number;
    readonly cellSize?: number;
    readonly palette?: string;
    readonly className?: string;
}

const clamp = (value: number, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

const createGrid = (width: number, height: number) =>
    Array.from({ length: width * height }, () => 0);

const createParticle = (
    width: number,
    height: number,
    intensity: number
): Particle => {
    const x = Math.random() * width;
    const y = height - 1;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
    const speed = intensity * (2 + Math.random() * 3);

    return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 20 + Math.random() * 30,
    };
};

export const FireworksSimulation: FC<FireworksSimulationProps> = memo(({
    width = 32,
    height = 32,
    fps = 30,
    intensity = 1,
    burstRate = 0.15,
    particlesPerBurst = 15,
    gravity = 0.1,
    cellSize = 12,
    palette = DEFAULT_PALETTE,
    className,
}) => {
    const [particles, setParticles] = useState<readonly Particle[]>([]);
    const paletteChars = useMemo(() => palette.split(''), [palette]);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setParticles((prev) => {
                let updated = prev
                    .map((p) => ({
                        ...p,
                        x: p.x + p.vx,
                        y: p.y + p.vy,
                        vy: p.vy + gravity,
                        life: p.life - (1 / p.maxLife),
                    }))
                    .filter((p) =>
                        p.life > 0 &&
                        p.x >= 0 &&
                        p.x < width &&
                        p.y >= 0 &&
                        p.y < height
                    );

                // Create new bursts
                if (Math.random() < burstRate) {
                    const newParticles = Array.from(
                        { length: particlesPerBurst },
                        () => createParticle(width, height, intensity)
                    );
                    updated = [...updated, ...newParticles];
                }

                return updated;
            });
        }, Math.max(16, 1000 / fps));

        return () => window.clearInterval(interval);
    }, [burstRate, fps, gravity, height, intensity, particlesPerBurst, width]);

    const output = useMemo(() => {
        const grid = createGrid(width, height);
        const maxIndex = paletteChars.length - 1;

        // Draw particles on grid
        for (const particle of particles) {
            const px = Math.floor(particle.x);
            const py = Math.floor(particle.y);

            if (px >= 0 && px < width && py >= 0 && py < height) {
                const index = py * width + px;
                grid[index] = Math.max(grid[index] ?? 0, particle.life);
            }
        }

        // Convert grid to ASCII
        const lines: string[] = [];
        for (let y = 0; y < height; y += 1) {
            let row = '';
            for (let x = 0; x < width; x += 1) {
                const brightness = grid[y * width + x] ?? 0;
                const charIndex = Math.round(clamp(brightness) * maxIndex);
                row += paletteChars[charIndex] ?? paletteChars[0] ?? ' ';
            }
            lines.push(row);
        }

        return lines.join('\n');
    }, [grid, height, paletteChars, particles, width]);

    const size = Math.max(width, height);
    const style: CSSProperties = {
        '--fireworks-width': `${width}`,
        '--fireworks-height': `${height}`,
        '--fireworks-size': `${size}`,
        '--fireworks-cell-size': `${cellSize}px`,
    } as CSSProperties;

    return (
        <pre
            aria-label="Fireworks simulation"
            className={`fireworksSimulation ${className ?? ''}`}
            style={style}
        >
            {output}
        </pre>
    );
});

FireworksSimulation.displayName = 'FireworksSimulation';
