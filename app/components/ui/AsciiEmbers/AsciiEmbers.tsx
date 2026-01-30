import { memo, useEffect, useRef } from 'react';
import type { FC } from 'react';
import type { AsciiEmbersProps, Particle } from './AsciiEmbers.types';
import { resolveCharset } from './AsciiEmbers.utils';
import './AsciiEmbers.css';

export const AsciiEmbers: FC<AsciiEmbersProps> = memo(
  ({
    width = 80,
    height = 40,
    fps = 30,
    spawnRate = 25,
    maxParticles = 500,
    charset,
    className,
  }) => {
    const preRef = useRef<HTMLPreElement | null>(null);

    useEffect(() => {
      const preElement = preRef.current;
      if (!preElement) {
        return undefined;
      }

      let animationFrame = 0;
      let lastTime = performance.now();
      let spawnAccumulator = 0;

      const particles: Particle[] = [];
      const cellCount = width * height;
      const heat = new Float32Array(cellCount);
      const scratch = new Float32Array(cellCount);

      const chars = resolveCharset(charset);
      const maxCharIndex = chars.length - 1;

      const spawnParticle = () => {
        if (particles.length >= maxParticles) {
          return;
        }
        const x = Math.random() * (width - 1);
        const y = height - 1 - Math.random() * 2;
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(0.6 + Math.random() * 1.4),
          life: 1 + Math.random() * 1.5,
        });
      };

      const applyBlur = () => {
        scratch.set(heat);
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const idx = x + y * width;
            let sum = scratch[idx] * 0.6;
            let count = 0.6;

            if (x > 0) {
              sum += scratch[idx - 1] * 0.1;
              count += 0.1;
            }
            if (x < width - 1) {
              sum += scratch[idx + 1] * 0.1;
              count += 0.1;
            }
            if (y > 0) {
              sum += scratch[idx - width] * 0.1;
              count += 0.1;
            }
            if (y < height - 1) {
              sum += scratch[idx + width] * 0.1;
              count += 0.1;
            }

            heat[idx] = sum / count;
          }
        }
      };

      const renderFrame = (now: number) => {
        animationFrame = requestAnimationFrame(renderFrame);
        const frameDuration = 1000 / fps;
        const deltaMs = now - lastTime;
        if (deltaMs < frameDuration) {
          return;
        }

        const deltaSeconds = Math.min(deltaMs / 1000, 0.1);
        lastTime = now - (deltaMs % frameDuration);

        spawnAccumulator += spawnRate * deltaSeconds;
        while (spawnAccumulator >= 1) {
          spawnParticle();
          spawnAccumulator -= 1;
        }

        heat.fill(0);

        for (let index = particles.length - 1; index >= 0; index -= 1) {
          const particle = particles[index];
          particle.vx += (Math.random() - 0.5) * 0.04;
          particle.vy += (Math.random() - 0.5) * 0.02;
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life -= deltaSeconds;

          if (
            particle.life <= 0 ||
            particle.x < 0 ||
            particle.x >= width ||
            particle.y < 0 ||
            particle.y >= height
          ) {
            particles.splice(index, 1);
            continue;
          }

          const baseX = Math.floor(particle.x);
          const baseY = Math.floor(particle.y);
          const fracX = particle.x - baseX;
          const fracY = particle.y - baseY;

          const weight00 = (1 - fracX) * (1 - fracY);
          const weight10 = fracX * (1 - fracY);
          const weight01 = (1 - fracX) * fracY;
          const weight11 = fracX * fracY;

          const intensity = particle.life + 0.3;

          const addHeat = (x: number, y: number, weight: number) => {
            if (x < 0 || x >= width || y < 0 || y >= height) {
              return;
            }
            heat[x + y * width] += intensity * weight;
          };

          addHeat(baseX, baseY, weight00);
          addHeat(baseX + 1, baseY, weight10);
          addHeat(baseX, baseY + 1, weight01);
          addHeat(baseX + 1, baseY + 1, weight11);
        }

        applyBlur();

        let maxHeat = 0.0001;
        for (let i = 0; i < heat.length; i += 1) {
          if (heat[i] > maxHeat) {
            maxHeat = heat[i];
          }
        }
        const scale = 1 / maxHeat;

        const lines: string[] = [];
        lines.length = height;

        let heatIndex = 0;
        for (let y = 0; y < height; y += 1) {
          const row: string[] = [];
          row.length = width;
          for (let x = 0; x < width; x += 1) {
            const value = Math.min(1, heat[heatIndex] * scale);
            const charIndex = Math.min(
              maxCharIndex,
              Math.floor(value * maxCharIndex),
            );
            row[x] = chars[charIndex];
            heatIndex += 1;
          }
          lines[y] = row.join('');
        }

        preElement.textContent = lines.join('\n');
      };

      animationFrame = requestAnimationFrame(renderFrame);

      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }, [width, height, fps, spawnRate, maxParticles, charset]);

    return (
      <pre
        ref={preRef}
        className={`asciiEmbers ${className ?? ''}`}
        aria-hidden="true"
      />
    );
  },
);

AsciiEmbers.displayName = 'AsciiEmbers';
