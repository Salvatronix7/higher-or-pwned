export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export interface AsciiEmbersProps {
  readonly width?: number;
  readonly height?: number;
  readonly fps?: number;
  readonly spawnRate?: number;
  readonly maxParticles?: number;
  readonly charset?: string;
  readonly className?: string;
}
