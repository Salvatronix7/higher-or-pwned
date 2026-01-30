import { memo, useEffect, useMemo, useRef } from 'react';
import type { FC } from 'react';
import styles from './AsciiDoomFire.module.css';

interface AsciiDoomFireProps {
  readonly width?: number;
  readonly height?: number;
  readonly fps?: number;
  readonly charset?: string;
  readonly decayMax?: number;
  readonly driftRange?: number;
  readonly flickerMax?: number;
  readonly className?: string;
}

export const AsciiDoomFire: FC<AsciiDoomFireProps> = memo(
  ({
    width = 80,
    height = 40,
    fps = 30,
    charset = ' .:-=+*#%@',
    decayMax = 2,
    driftRange = 1,
    flickerMax = 2,
    className,
  }) => {
    const preRef = useRef<HTMLPreElement | null>(null);
    const lookup = useMemo(() => {
      const chars = charset.split('');
      return chars.length > 0 ? chars : [' '];
    }, [charset]);

    useEffect(() => {
      const pre = preRef.current;
      if (!pre) {
        return undefined;
      }

      const clampedWidth = Math.max(1, Math.floor(width));
      const clampedHeight = Math.max(1, Math.floor(height));
      const maxIntensity = Math.max(lookup.length - 1, 0);
      const buffer = new Uint8Array(clampedWidth * clampedHeight);
      const frameInterval = 1000 / Math.max(1, fps);
      let lastFrameTime = 0;
      let animationFrame = 0;

      const renderFrame = () => {
        const lines = new Array(clampedHeight);
        for (let y = 0; y < clampedHeight; y += 1) {
          let row = '';
          const rowOffset = y * clampedWidth;
          for (let x = 0; x < clampedWidth; x += 1) {
            row += lookup[buffer[rowOffset + x]] ?? lookup[0];
          }
          lines[y] = row;
        }
        pre.textContent = lines.join('\n');
      };

      const updateFire = (time: number) => {
        if (time - lastFrameTime < frameInterval) {
          animationFrame = requestAnimationFrame(updateFire);
          return;
        }

        lastFrameTime = time;

        const bottomRowOffset = (clampedHeight - 1) * clampedWidth;
        for (let x = 0; x < clampedWidth; x += 1) {
          const flicker = Math.floor(Math.random() * (flickerMax + 1));
          buffer[bottomRowOffset + x] = Math.max(maxIntensity - flicker, 0);
        }

        for (let y = 0; y < clampedHeight - 1; y += 1) {
          const rowOffset = y * clampedWidth;
          const belowOffset = (y + 1) * clampedWidth;
          for (let x = 0; x < clampedWidth; x += 1) {
            const driftSpan = Math.max(0, Math.floor(driftRange));
            const drift =
              driftSpan > 0
                ? Math.floor(Math.random() * (driftSpan * 2 + 1)) - driftSpan
                : 0;
            const sampleX = (x + drift + clampedWidth) % clampedWidth;
            const decaySpan = Math.max(0, Math.floor(decayMax));
            const decay =
              decaySpan > 0 ? Math.floor(Math.random() * (decaySpan + 1)) : 0;
            const sourceIntensity = buffer[belowOffset + sampleX];
            const nextIntensity = Math.max(sourceIntensity - decay, 0);
            buffer[rowOffset + x] = nextIntensity;
          }
        }

        renderFrame();
        animationFrame = requestAnimationFrame(updateFire);
      };

      animationFrame = requestAnimationFrame(updateFire);

      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }, [decayMax, driftRange, flickerMax, fps, height, lookup, width]);

    return (
      <pre
        ref={preRef}
        className={`${styles.asciiDoomFire} ${className ?? ''}`}
      />
    );
  },
);

AsciiDoomFire.displayName = 'AsciiDoomFire';

// Demo usage:
// <AsciiDoomFire width={90} height={45} fps={24} decayMax={3} driftRange={2} />
