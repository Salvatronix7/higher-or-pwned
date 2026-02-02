import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FC } from 'react';
import './Fireworks.css';

const DEFAULT_PALETTE = ' .:-=+*#%@';

type ParticleKind = 'rocket' | 'spark';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  kind: ParticleKind;
}

interface FireworksSimulationProps {
  readonly width?: number;
  readonly height?: number;
  readonly fps?: number;
  readonly rocketRate?: number;
  readonly burstSize?: number;
  readonly spread?: number;
  readonly gravity?: number;
  readonly cellSize?: number;
  readonly palette?: string;
  readonly className?: string;
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const createGrid = (width: number, height: number) =>
  Array.from({ length: width * height }, () => 0);

const getIntensity = (particle: Particle) => {
  const base = particle.life / particle.maxLife;
  return particle.kind === 'rocket' ? clamp(base + 0.2) : clamp(base);
};

export const FireworksSimulation: FC<FireworksSimulationProps> = ({
  width = 80,
  height = 40,
  fps = 24,
  rocketRate = 0.08,
  burstSize = 20,
  spread = 1.6,
  gravity = 0.04,
  cellSize = 12,
  palette = DEFAULT_PALETTE,
  className,
}) => {
  const [grid, setGrid] = useState(() => createGrid(width, height));
  const particlesRef = useRef<Particle[]>([]);
  const paletteChars = useMemo(() => palette.split(''), [palette]);

  useEffect(() => {
    particlesRef.current = [];
    setGrid(createGrid(width, height));
  }, [width, height]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nextParticles: Particle[] = [];
      const current = particlesRef.current;

      if (Math.random() < rocketRate) {
        const maxLife = Math.max(18, Math.round(height * 0.45));
        nextParticles.push({
          x: Math.random() * (width - 1),
          y: height - 1,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -(0.8 + Math.random() * 0.6),
          life: maxLife,
          maxLife,
          kind: 'rocket',
        });
      }

      current.forEach((particle) => {
        const updated: Particle = { ...particle };

        if (updated.kind === 'spark') {
          updated.vy += gravity;
          updated.vx *= 0.985;
          updated.vy *= 0.985;
        } else {
          updated.vy += gravity * 0.15;
        }

        updated.x += updated.vx;
        updated.y += updated.vy;
        updated.life -= 1;

        if (updated.kind === 'rocket') {
          const shouldExplode =
            updated.life <= 0 || updated.vy >= -0.1 || updated.y <= height * 0.3;

          if (shouldExplode) {
            const count = Math.max(6, Math.round(burstSize + Math.random() * 6));
            for (let i = 0; i < count; i += 1) {
              const angle = Math.random() * Math.PI * 2;
              const speed = spread * (0.4 + Math.random() * 0.9);
              const maxLife = Math.round(18 + Math.random() * 18);
              nextParticles.push({
                x: updated.x,
                y: updated.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: maxLife,
                maxLife,
                kind: 'spark',
              });
            }
            return;
          }
        }

        const inBounds =
          updated.x >= 0 &&
          updated.x < width &&
          updated.y >= 0 &&
          updated.y < height;

        if (updated.life > 0 && inBounds) {
          nextParticles.push(updated);
        }
      });

      particlesRef.current = nextParticles;

      const nextGrid = createGrid(width, height);
      nextParticles.forEach((particle) => {
        const x = Math.round(particle.x);
        const y = Math.round(particle.y);
        if (x < 0 || x >= width || y < 0 || y >= height) {
          return;
        }
        const index = y * width + x;
        const intensity = getIntensity(particle);
        nextGrid[index] = Math.max(nextGrid[index] ?? 0, intensity);
      });
      setGrid(nextGrid);
    }, Math.max(16, 1000 / fps));

    return () => window.clearInterval(interval);
  }, [burstSize, fps, gravity, height, rocketRate, spread, width]);

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
};

FireworksSimulation.displayName = 'FireworksSimulation';
