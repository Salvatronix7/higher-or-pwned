import { memo, useEffect, useMemo, useRef } from 'react';
import type { FC } from 'react';
import './AsciiFireColor.css';
import {
  DEFAULT_FIRE_CHARS,
  DEFAULT_FIRE_FPS,
  DEFAULT_FIRE_HEIGHT,
  DEFAULT_FIRE_PALETTE,
  DEFAULT_FIRE_WIDTH,
} from './AsciiFireColor.constants';
import type { AsciiFireColorProps } from './AsciiFireColor.types';
import { clamp, escapeHtml } from './AsciiFireColor.utils';

export const AsciiFireColor: FC<AsciiFireColorProps> = memo(
  ({
    width = DEFAULT_FIRE_WIDTH,
    height = DEFAULT_FIRE_HEIGHT,
    fps = DEFAULT_FIRE_FPS,
    chars = DEFAULT_FIRE_CHARS,
    palette = DEFAULT_FIRE_PALETTE,
    className,
    useBlockChar = false,
  }) => {
    const resolvedWidth = Math.max(1, Math.floor(width));
    const resolvedHeight = Math.max(1, Math.floor(height));
    const resolvedFps = Math.max(1, Math.floor(fps));
    const resolvedChars = chars.length > 0 ? chars : DEFAULT_FIRE_CHARS;
    const resolvedPalette =
      palette.length > 0 ? palette : DEFAULT_FIRE_PALETTE;

    const preRef = useRef<HTMLPreElement | null>(null);
    const bufferRef = useRef<Uint8Array>(
      new Uint8Array(resolvedWidth * resolvedHeight),
    );
    const animationRef = useRef<number | null>(null);
    const lastFrameRef = useRef(0);

    const { lookup, intensityLevels } = useMemo(() => {
      const levels = Math.max(
        2,
        resolvedChars.length,
        resolvedPalette.length,
      );
      const table = new Array<string>(levels);

      for (let i = 0; i < levels; i += 1) {
        const ratio = i / (levels - 1);
        const colorIndex = Math.round(
          ratio * (resolvedPalette.length - 1),
        );
        const charIndex = Math.round(ratio * (resolvedChars.length - 1));
        const char = useBlockChar
          ? '█'
          : resolvedChars.charAt(charIndex) || ' ';
        const safeChar = escapeHtml(char);
        const color = resolvedPalette[colorIndex] ?? '#000000';
        table[i] = `<span style="color: ${color}">${safeChar}</span>`;
      }

      return { lookup: table, intensityLevels: levels };
    }, [resolvedChars, resolvedPalette, useBlockChar]);

    useEffect(() => {
      bufferRef.current = new Uint8Array(
        resolvedWidth * resolvedHeight,
      );
    }, [resolvedWidth, resolvedHeight]);

    useEffect(() => {
      const frameDuration = 1000 / resolvedFps;

      const updateFrame = () => {
        const buffer = bufferRef.current;
        const maxIntensity = intensityLevels - 1;
        const bottomRowStart = (resolvedHeight - 1) * resolvedWidth;

        for (let x = 0; x < resolvedWidth; x += 1) {
          const spark = Math.floor(Math.random() * 3);
          const intensity = Math.max(0, maxIntensity - spark);
          buffer[bottomRowStart + x] = intensity;
        }

        for (let y = 0; y < resolvedHeight - 1; y += 1) {
          for (let x = 0; x < resolvedWidth; x += 1) {
            const belowIndex = (y + 1) * resolvedWidth + x;
            const intensity = buffer[belowIndex];
            const decay = Math.floor(Math.random() * 3);
            const drift = Math.floor(Math.random() * 3) - 1;
            const targetX = clamp(
              x + drift,
              0,
              resolvedWidth - 1,
            );
            const targetIndex = y * resolvedWidth + targetX;
            buffer[targetIndex] =
              intensity > decay ? intensity - decay : 0;
          }
        }
      };

      const renderFrame = () => {
        const buffer = bufferRef.current;
        const rows = new Array<string>(resolvedHeight);
        let index = 0;

        for (let y = 0; y < resolvedHeight; y += 1) {
          let row = '';
          for (let x = 0; x < resolvedWidth; x += 1) {
            row += lookup[buffer[index]] ?? '';
            index += 1;
          }
          rows[y] = row;
        }

        const html = rows.join('\n');
        if (preRef.current) {
          // Security note: HTML is generated from escaped, internal lookup data.
          preRef.current.innerHTML = html;
        }
      };

      const tick = (time: number) => {
        if (time - lastFrameRef.current >= frameDuration) {
          lastFrameRef.current = time;
          updateFrame();
          renderFrame();
        }
        animationRef.current = window.requestAnimationFrame(tick);
      };

      animationRef.current = window.requestAnimationFrame(tick);

      return () => {
        if (animationRef.current !== null) {
          window.cancelAnimationFrame(animationRef.current);
        }
      };
    }, [
      intensityLevels,
      lookup,
      resolvedFps,
      resolvedHeight,
      resolvedWidth,
    ]);

    return (
      <pre
        ref={preRef}
        className={`asciiFireColor ${className ?? ''}`}
        aria-label="ASCII fire animation"
      />
    );
  },
);

AsciiFireColor.displayName = 'AsciiFireColor';
