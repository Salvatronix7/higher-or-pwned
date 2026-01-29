import { memo, useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import type { FirePreProps } from './FirePre.types';
import './FirePre.css';

const MAX_INTENSITY = 15;
const FIRE_CHARS = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@', '█'];

const createEmptyGrid = (width: number, height: number) =>
  Array.from({ length: height }, () => Array.from({ length: width }, () => 0));

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const seedBottomRow = (grid: number[][], width: number) => {
  const lastRowIndex = grid.length - 1;
  const seeded = grid.map((row) => [...row]);
  seeded[lastRowIndex] = Array.from({ length: width }, () => MAX_INTENSITY);
  return seeded;
};

const stepFire = (grid: number[][]) => {
  const height = grid.length;
  const width = grid[0].length;
  const next = createEmptyGrid(width, height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (y === height - 1) {
        next[y][x] = MAX_INTENSITY;
        continue;
      }
      const below = grid[y + 1][x];
      const belowLeft = grid[y + 1][Math.max(0, x - 1)];
      const belowRight = grid[y + 1][Math.min(width - 1, x + 1)];
      const belowTwo = y + 2 < height ? grid[y + 2][x] : below;
      const decay = Math.floor(Math.random() * 3);
      const intensity = Math.floor(
        (below + belowLeft + belowRight + belowTwo) / 4 - decay,
      );
      next[y][x] = clamp(intensity, 0, MAX_INTENSITY);
    }
  }

  return next;
};

export const FirePre: FC<FirePreProps> = memo(({ width, height, fps }) => {
  const [grid, setGrid] = useState(() =>
    seedBottomRow(createEmptyGrid(width, height), width),
  );

  useEffect(() => {
    setGrid(seedBottomRow(createEmptyGrid(width, height), width));
  }, [width, height]);

  useEffect(() => {
    if (fps <= 0) {
      return;
    }
    const interval = window.setInterval(() => {
      setGrid((current) => stepFire(current));
    }, 1000 / fps);
    return () => window.clearInterval(interval);
  }, [fps]);

  const output = useMemo(
    () =>
      grid
        .map((row) =>
          row
            .map((cell) => {
              const charIndex = Math.floor(
                (cell / MAX_INTENSITY) * (FIRE_CHARS.length - 1),
              );
              return FIRE_CHARS[charIndex];
            })
            .join(''),
        )
        .join('\n'),
    [grid],
  );

  return <pre className='firePre'>{output}</pre>;
});

FirePre.displayName = 'FirePre';
