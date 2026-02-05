import { memo, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, FC } from 'react';
import './Fireworks.css';

const DEFAULT_PALETTE = ' .·:+*o#@';

interface Particle {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly life: number;
  readonly maxLife: number;
}

interface Rocket {
  readonly x: number;
  readonly y: number;
  readonly vy: number;
  readonly explodeAt: number;
}

interface FireworksSimulationProps {
  readonly width?: number;
  readonly height?: number;
  readonly fps?: number;
  readonly launchRate?: number;
  readonly particleCount?: number;
  readonly gravity?: number;
  readonly fadeRate?: number;
  readonly cellSize?: number;
  readonly palette?: string;
  readonly className?: string;
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const createGrid = (width: number, height: number) =>
  Array.from({ length: width * height }, () => 0);

const createExplosion = (
  x: number,
  y: number,
  particleCount: number
): readonly Particle[] => {
  const particles: Particle[] = [];
  const angleStep = (Math.PI * 2) / particleCount;

  for (let i = 0; i < particleCount; i += 1) {
    const angle = angleStep * i + (Math.random() - 0.5) * 0.5;
    const speed = 0.5 + Math.random() * 1.5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 0.7 + Math.random() * 0.3,
    });
  }

  return particles;
};

export const FireworksSimulation: FC<FireworksSimulationProps> = memo(({
  width = 80,
  height = 40,
  fps = 24,
  launchRate = 0.03,
  particleCount = 24,
  gravity = 0.03,
  fadeRate = 0.02,
  cellSize = 12,
  palette = DEFAULT_PALETTE,
  className,
}) => {
  const [grid, setGrid] = useState(() => createGrid(width, height));
  const [rockets, setRockets] = useState<readonly Rocket[]>([]);
  const [particles, setParticles] = useState<readonly Particle[]>([]);

  const paletteChars = useMemo(() => palette.split(''), [palette]);

  useEffect(() => {
    setGrid(createGrid(width, height));
    setRockets([]);
    setParticles([]);
  }, [width, height]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      // Launch new rockets
      setRockets((prev) => {
        const next = [...prev];

        if (Math.random() < launchRate) {
          next.push({
            x: Math.random() * width,
            y: height - 1,
            vy: -1.5 - Math.random() * 0.5,
            explodeAt: height * (0.2 + Math.random() * 0.4),
          });
        }

        return next;
      });

      // Update rockets and create explosions
      setRockets((prev) => {
        const remaining: Rocket[] = [];
        const newParticles: Particle[] = [];

        for (const rocket of prev) {
          const newY = rocket.y + rocket.vy;

          if (newY <= rocket.explodeAt) {
            // Explode!
            newParticles.push(...createExplosion(rocket.x, newY, particleCount));
          } else {
            remaining.push({
              ...rocket,
              y: newY,
            });
          }
        }

        if (newParticles.length > 0) {
          setParticles((p) => [...p, ...newParticles]);
        }

        return remaining;
      });

      // Update particles
      setParticles((prev) => {
        const remaining: Particle[] = [];

        for (const particle of prev) {
          const newLife = particle.life - fadeRate;

          if (newLife > 0) {
            remaining.push({
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy + gravity,
              vy: particle.vy + gravity,
              vx: particle.vx * 0.98,
              life: newLife,
            });
          }
        }

        return remaining;
      });

      // Render to grid
      setGrid(() => {
        const next = createGrid(width, height);

        // Draw rockets
        for (const rocket of rockets) {
          const rx = Math.round(rocket.x);
          const ry = Math.round(rocket.y);

          if (rx >= 0 && rx < width && ry >= 0 && ry < height) {
            const idx = ry * width + rx;
            next[idx] = Math.max(next[idx] ?? 0, 0.8);
          }
        }

        // Draw particles
        for (const particle of particles) {
          const px = Math.round(particle.x);
          const py = Math.round(particle.y);

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const idx = py * width + px;
            const intensity = particle.life / particle.maxLife;
            next[idx] = Math.max(next[idx] ?? 0, intensity);
          }
        }

        return next;
      });
    }, Math.max(16, 1000 / fps));

    return () => window.clearInterval(interval);
  }, [fadeRate, fps, gravity, height, launchRate, particleCount, particles, rockets, width]);

  const output = useMemo(() => {
    const maxIndex = paletteChars.length - 1;
    const lines: string[] = [];

    for (let y = 0; y < height; y += 1) {
      let row = '';
      for (let x = 0; x < width; x += 1) {
        const intensity = grid[y * width + x] ?? 0;
        const index = Math.round(clamp(intensity) * maxIndex);
        row += paletteChars[index] ?? paletteChars[0] ?? ' ';
      }
      lines.push(row);
    }

    return lines.join('\n');
  }, [grid, height, paletteChars, width]);

  const style: CSSProperties = {
    '--fireworks-width': `${width}`,
    '--fireworks-height': `${height}`,
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
